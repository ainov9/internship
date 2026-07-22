from rest_framework import serializers


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=4000, trim_whitespace=True)
    user_id = serializers.IntegerField(default=1)
    conversation_id = serializers.UUIDField(required=False, allow_null=True)


class MessageSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    role = serializers.CharField()
    content = serializers.CharField()
    tokens_used = serializers.IntegerField()
    created_at = serializers.DateTimeField()


class ChatResponseSerializer(serializers.Serializer):
    conversation_id = serializers.CharField()
    message = serializers.CharField()
    tokens_used = serializers.IntegerField()
    model = serializers.CharField()


class ConversationDetailSerializer(serializers.Serializer):
    conversation_id = serializers.CharField()
    title = serializers.CharField()
    created_at = serializers.DateTimeField()
    messages = MessageSerializer(many=True)


class ConversationListSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    message_count = serializers.IntegerField()
