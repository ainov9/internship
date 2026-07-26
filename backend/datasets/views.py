from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from datasets.models import FAQ, Document
from datasets.serializers import FAQSerializer, DocumentSerializer


class FAQListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        faqs = FAQ.objects.all()
        serializer = FAQSerializer(faqs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FAQSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FAQDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, faq_id):
        try:
            faq = FAQ.objects.get(pk=faq_id)
            return Response(FAQSerializer(faq).data)
        except FAQ.DoesNotExist:
            return Response({'error': 'FAQ not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, faq_id):
        try:
            faq = FAQ.objects.get(pk=faq_id)
        except FAQ.DoesNotExist:
            return Response({'error': 'FAQ not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = FAQSerializer(faq, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, faq_id):
        try:
            faq = FAQ.objects.get(pk=faq_id)
            faq.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FAQ.DoesNotExist:
            return Response({'error': 'FAQ not found'}, status=status.HTTP_404_NOT_FOUND)


class DocumentListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        docs = Document.objects.all()
        serializer = DocumentSerializer(docs, many=True)
        return Response(serializer.data)


class DocumentUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DocumentDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, document_id):
        try:
            doc = Document.objects.get(pk=document_id)
            doc.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)


class DatasetSearchView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        query = request.data.get('query', '').strip().lower()
        limit = request.data.get('limit', 5)

        if not query:
            return Response([])

        faqs = FAQ.objects.filter(question__icontains=query)[:limit]
        return Response(FAQSerializer(faqs, many=True).data)
