from django.urls import path
from chatbot.views import ChatView, ConversationHistoryView, ConversationListView, TTSView, product_image

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('images/<str:filename>', product_image, name='product-image'),
    path('tts/', TTSView.as_view(), name='tts'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<uuid:conversation_id>/history/', ConversationHistoryView.as_view(), name='conversation-history'),
    
]
