from django.urls import path
from analytics.views import AnalyticsSummaryView, QueryLogListView, UserAnalyticsView

urlpatterns = [
    path('api/analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('api/analytics/query-logs/', QueryLogListView.as_view(), name='analytics-query-logs'),
    path('api/analytics/user/', UserAnalyticsView.as_view(), name='analytics-user'),
]
