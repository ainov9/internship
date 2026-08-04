from django.urls import path
from datasets.views import (
    FAQListView, FAQDetailView,
    DocumentListView, DocumentUploadView, DocumentDeleteView,
    DatasetSearchView,
)

urlpatterns = [
    path('dataset/faq/', FAQListView.as_view(), name='faq-list'),
    path('dataset/faq/<int:faq_id>/', FAQDetailView.as_view(), name='faq-detail'),
    path('dataset/documents/', DocumentListView.as_view(), name='document-list'),
    path('dataset/documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('dataset/documents/<int:document_id>/delete/', DocumentDeleteView.as_view(), name='document-delete'),
    path('dataset/search/', DatasetSearchView.as_view(), name='dataset-search'),
]