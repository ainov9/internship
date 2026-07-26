from django.urls import path
from datasets.views import (
    FAQListView, FAQDetailView,
    DocumentListView, DocumentUploadView, DocumentDeleteView,
    DatasetSearchView,
)

urlpatterns = [
    path('api/dataset/faq/', FAQListView.as_view(), name='faq-list'),
    path('api/dataset/faq/<int:faq_id>/', FAQDetailView.as_view(), name='faq-detail'),
    path('api/dataset/documents/', DocumentListView.as_view(), name='document-list'),
    path('api/dataset/documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('api/dataset/documents/<int:document_id>/delete/', DocumentDeleteView.as_view(), name='document-delete'),
    path('api/dataset/search/', DatasetSearchView.as_view(), name='dataset-search'),
]
