from django.urls import path
from analytics.views import AnalyticsSummaryView, QueryLogListView, UserAnalyticsView

urlpatterns = [
    path('analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('analytics/query-logs/', QueryLogListView.as_view(), name='analytics-query-logs'),
    path('analytics/user/', UserAnalyticsView.as_view(), name='analytics-user'),
]