"""
Chat Serializers
Centralized serializers for chatbot-related API endpoints.
"""
from rest_framework import serializers


class ChatSerializer(serializers.Serializer):
    """
    Serializer for chatbot message processing.
    Handles input validation and output formatting for chat messages.
    """
    message = serializers.CharField(max_length=500)
    user_id = serializers.IntegerField()
    analytics = serializers.JSONField(required=False)  # Optional field for analytics data
    dataset = serializers.JSONField(required=False)  # Optional field for dataset data


class ChatResponseSerializer(serializers.Serializer):
    """
    Serializer for chatbot response output.
    """
    conversation_id = serializers.IntegerField()
    message = serializers.CharField()
    response_time = serializers.FloatField()


class MessageSerializer(serializers.Serializer):
    """
    Serializer for individual chat messages.
    """
    id = serializers.IntegerField(read_only=True)
    conversation_id = serializers.IntegerField()
    sender = serializers.CharField(max_length=10)
    content = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)
    response_time = serializers.FloatField(required=False)


class ConversationSerializer(serializers.Serializer):
    """
    Serializer for chat conversations.
    """
    id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField()
    created_at = serializers.DateTimeField(read_only=True)
