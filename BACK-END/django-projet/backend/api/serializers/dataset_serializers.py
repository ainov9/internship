"""
Dataset Serializers
Centralized serializers for dataset-related API endpoints.
"""
from rest_framework import serializers
from apps.dataset.models import Document, FAQ


class FAQSerializer(serializers.ModelSerializer):
    """
    Serializer for FAQ model.
    """
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'created_at']
        read_only_fields = ['id', 'created_at']


class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for Document model.
    """
    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class DocumentUploadSerializer(serializers.Serializer):
    """
    Serializer for document upload requests.
    """
    file = serializers.FileField()
    title = serializers.CharField(max_length=255)


class SearchRequestSerializer(serializers.Serializer):
    """
    Serializer for search requests.
    """
    query = serializers.CharField(max_length=500)
    limit = serializers.IntegerField(default=5, min_value=1, max_value=20)


class SearchResultSerializer(serializers.Serializer):
    """
    Serializer for search results.
    """
    results = serializers.ListField(child=serializers.CharField())
    count = serializers.IntegerField()
