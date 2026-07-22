from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from chatbot.serializers import (
    ChatRequestSerializer,
    ChatResponseSerializer,
    ConversationDetailSerializer,
    ConversationListSerializer,
)
from chatbot.services import chat_service


class ChatView(APIView):
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        result = chat_service.send_message(
            message_text=data['message'],
            user_id=data['user_id'],
            conversation_id=data.get('conversation_id'),
        )

        response_serializer = ChatResponseSerializer(result)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class ConversationHistoryView(APIView):
    def get(self, request, conversation_id):
        user_id = request.query_params.get('user_id', 1)
        result = chat_service.get_conversation_history(conversation_id, user_id)

        if result is None:
            return Response(
                {'error': 'Conversation not found'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ConversationDetailSerializer(result)
        return Response(serializer.data)


class ConversationListView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id', 1)
        conversations = chat_service.list_conversations(user_id)
        serializer = ConversationListSerializer(conversations, many=True)
        return Response(serializer.data)


class TTSView(APIView):
    def post(self, request):
        text = request.data.get('text', '').strip()
        if not text:
            return Response(
                {'error': 'Text is required'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {'message': 'TTS not yet implemented. Use browser TTS fallback.', 'status': 'not_implemented'},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )
