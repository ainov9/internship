from django.urls import path
from chatbot.views import ChatView, ConversationHistoryView, ConversationListView, TTSView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('tts/', TTSView.as_view(), name='tts'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<uuid:conversation_id>/history/', ConversationHistoryView.as_view(), name='conversation-history'),
]
