from django.urls import path
from .views import chat_view, upload_dataset_view, analytics_view

urlpatterns = [
    path("chat/", chat_view),
    path("upload/", upload_dataset_view),
    path("analytics/", analytics_view),
]
