"""
Dataset Views
Centralized API views for dataset-related endpoints.
All views ONLY call service functions - no business logic here.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from api.serializers.dataset_serializers import (
    FAQSerializer,
    DocumentSerializer,
    DocumentUploadSerializer,
    SearchRequestSerializer,
    SearchResultSerializer
)
from apps.dataset.models import FAQ, Document
from apps.dataset.services.search_service import search_dataset
from apps.dataset.services.upload_service import handle_file_upload
from apps.dataset.services.validation import validate_file


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def faq_list_view(request):
    """
    List all FAQ entries.
    
    Returns:
    [
        {
            "id": 1,
            "question": "How to use?",
            "answer": "Use it like this...",
            "created_at": "2024-01-01T00:00:00Z"
        },
        ...
    ]
    """
    try:
        faqs = FAQ.objects.all().order_by('-created_at')
        serializer = FAQSerializer(faqs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def faq_detail_view(request, faq_id):
    """
    Get a specific FAQ entry.
    """
    try:
        from django.shortcuts import get_object_or_404
        faq = get_object_or_404(FAQ, id=faq_id)
        serializer = FAQSerializer(faq)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_list_view(request):
    """
    List all documents.
    
    Returns:
    [
        {
            "id": 1,
            "title": "Document 1",
            "created_at": "2024-01-01T00:00:00Z"
        },
        ...
    ]
    """
    try:
        documents = Document.objects.all().order_by('-created_at')
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_detail_view(request, document_id):
    """
    Get a specific document.
    """
    try:
        from django.shortcuts import get_object_or_404
        document = get_object_or_404(Document, id=document_id)
        serializer = DocumentSerializer(document)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def document_upload_view(request):
    """
    Upload a new document.
    
    Request body:
    - file: The file to upload
    - title: Title for the document
    
    Returns:
    {
        "id": 123,
        "title": "Document Title",
        "content": "...",
        "created_at": "2024-01-01T00:00:00Z"
    }
    """
    try:
        serializer = DocumentUploadSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES.get('file')
        title = serializer.validated_data.get('title')
        
        if not file:
            return Response(
                {"error": "File is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file
        validate_file(file)
        
        # Call service layer
        document = handle_file_upload(file, title)
        
        # Serialize the response
        response_serializer = DocumentSerializer(document)
        
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_view(request):
    """
    Search across datasets (FAQ and Documents).
    
    Request body:
    {
        "query": "search term",
        "limit": 5
    }
    
    Returns:
    {
        "results": ["match 1", "match 2", ...],
        "count": 5
    }
    """
    try:
        serializer = SearchRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        query = serializer.validated_data.get('query')
        limit = serializer.validated_data.get('limit', 5)
        
        # Call service layer
        results = search_dataset(query)
        
        # Limit results
        results = results[:limit]
        
        response_data = {
            "results": results,
            "count": len(results)
        }
        
        response_serializer = SearchResultSerializer(response_data)
        
        return Response(response_serializer.data)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def document_delete_view(request, document_id):
    """
    Delete a document.
    """
    try:
        from django.shortcuts import get_object_or_404
        document = get_object_or_404(Document, id=document_id)
        document.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
