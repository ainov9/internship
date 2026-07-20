"""
Chat Views
Centralized API views for chatbot-related endpoints.
All views ONLY call service functions - no business logic here.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from api.serializers.chat_serializers import ChatSerializer, ChatResponseSerializer
from apps.chatbot.services.chat_ai import handle_user_message
from apps.dataset.services.upload_service import handle_file_upload
from apps.analytics.services.analytics_service import (
    get_total_queries,
    get_avg_response_time,
    get_source_distribution
)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    """
    Process a chat message and return an AI response.
    
    Request body:
    {
        "message": "user message",
        "user_id": 1
    }
    
    Returns:
    {
        "conversation_id": 123,
        "message": "AI response",
        "response_time": 1.23
    }
    """
    serializer = ChatSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Extract validated data
        message = serializer.validated_data.get("message")
        user_id = serializer.validated_data.get("user_id")
        
        # Get the user object
        user = request.user
        
        # Call service layer - no business logic in view
        result = handle_user_message(
            user=user,
            content=message,
            conversation_id=None  # Will create new conversation
        )
        
        # Serialize the response
        response_serializer = ChatResponseSerializer(result)
        
        return Response(response_serializer.data)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_dataset_view(request):
    """
    Upload a dataset document.
    
    Request body:
    - file: The file to upload
    - title: Title for the document
    
    Returns:
    {
        "id": 123,
        "title": "Document Title",
        "created_at": "2024-01-01T00:00:00Z"
    }
    """
    try:
        file = request.FILES.get('file')
        title = request.data.get('title')
        
        if not file:
            return Response(
                {"error": "File is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not title:
            return Response(
                {"error": "Title is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Call service layer
        document = handle_file_upload(file, title)
        
        # Serialize the response
        from api.serializers.dataset_serializers import DocumentSerializer
        serializer = DocumentSerializer(document)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_view(request):
    """
    Get analytics summary for the chatbot.
    
    Returns:
    {
        "total_queries": 100,
        "avg_response_time": 1.23,
        "source_distribution": {"ai": 50, "dataset": 30, "human": 20}
    }
    """
    try:
        # Call service layer functions
        total_queries = get_total_queries()
        avg_response_time = get_avg_response_time() or 0.0
        source_distribution = dict(get_source_distribution())
        
        # Build response
        response_data = {
            "total_queries": total_queries,
            "avg_response_time": round(avg_response_time, 2),
            "source_distribution": source_distribution
        }
        
        return Response(response_data)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_history_view(request, conversation_id):
    """
    Get message history for a specific conversation.
    
    Returns:
    [
        {
            "id": 1,
            "sender": "user",
            "content": "Hello",
            "created_at": "2024-01-01T00:00:00Z"
        },
        ...
    ]
    """
    try:
        from apps.chatbot.models import Message
        from api.serializers.chat_serializers import MessageSerializer
        
        messages = Message.objects.filter(conversation_id=conversation_id).order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
