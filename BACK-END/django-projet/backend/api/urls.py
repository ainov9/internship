"""
API URL Configuration
Centralized URL routing for all API endpoints.
"""
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Import all view modules
from api.views.chat_views import (
    chat_view,
    upload_dataset_view,
    analytics_view,
    conversation_history_view
)
from api.views.user_views import (
    UserListView,
    UserDetailView,
    UserCreateView,
    current_user_view
)
from api.views.dataset_views import (
    faq_list_view,
    faq_detail_view,
    document_list_view,
    document_detail_view,
    document_upload_view,
    search_view,
    document_delete_view
)
from api.views.analytics_views import (
    analytics_summary_view,
    query_logs_view,
    query_log_detail_view,
    user_analytics_view
)


# User endpoints
user_urlpatterns = [
    path('list/', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('current/', current_user_view, name='current-user'),
    path('api/token/', TokenObtainPairView.as_view(), name='token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]


# Chatbot endpoints
chat_urlpatterns = [
    path('chat/', chat_view, name='chat'),
    path('upload/', upload_dataset_view, name='upload-dataset'),
    path('analytics/', analytics_view, name='analytics'),
    path('conversations/<int:conversation_id>/history/', conversation_history_view, name='conversation-history'),
]


# Dataset endpoints
dataset_urlpatterns = [
    path('faq/', faq_list_view, name='faq-list'),
    path('faq/<int:faq_id>/', faq_detail_view, name='faq-detail'),
    path('documents/', document_list_view, name='document-list'),
    path('documents/<int:document_id>/', document_detail_view, name='document-detail'),
    path('documents/upload/', document_upload_view, name='document-upload'),
    path('documents/<int:document_id>/delete/', document_delete_view, name='document-delete'),
    path('search/', search_view, name='search'),
]


# Analytics endpoints
analytics_urlpatterns = [
    path('summary/', analytics_summary_view, name='analytics-summary'),
    path('query-logs/', query_logs_view, name='query-logs'),
    path('query-logs/<int:log_id>/', query_log_detail_view, name='query-log-detail'),
    path('user/', user_analytics_view, name='user-analytics'),
]


# Main API URL patterns
urlpatterns = [
    # User endpoints
    path('users/', include(user_urlpatterns)),
    
    # Chatbot endpoints
    path('chatbot/', include(chat_urlpatterns)),
    
    # Dataset endpoints
    path('dataset/', include(dataset_urlpatterns)),
    
    # Analytics endpoints
    path('analytics/', include(analytics_urlpatterns)),
]
