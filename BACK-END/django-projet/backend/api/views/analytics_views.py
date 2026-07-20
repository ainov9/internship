"""
Analytics Views
Centralized API views for analytics-related endpoints.
All views ONLY call service functions - no business logic here.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from api.serializers.analytics_serializers import (
    QueryLogSerializer,
    AnalyticsSummarySerializer,
    AnalyticsRequestSerializer
)
from apps.analytics.models import QueryLog
from apps.analytics.services.analytics_service import (
    get_total_queries,
    get_avg_response_time,
    get_source_distribution
)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def analytics_summary_view(request):
    """
    Get a summary of analytics data.
    
    Returns:
    {
        "total_queries": 100,
        "avg_response_time": 1.23,
        "source_distribution": {"ai": 50, "dataset": 30, "human": 20}
    }
    """
    try:
        total_queries = get_total_queries()
        avg_response_time = get_avg_response_time() or 0.0
        source_distribution = dict(get_source_distribution())
        
        response_data = {
            "total_queries": total_queries,
            "avg_response_time": round(avg_response_time, 2),
            "source_distribution": source_distribution
        }
        
        serializer = AnalyticsSummarySerializer(response_data)
        
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def query_logs_view(request):
    """
    List all query logs with optional filtering.
    
    Query parameters:
    - start_date: Filter by start date
    - end_date: Filter by end date
    - source: Filter by source (ai, dataset, human)
    - user_id: Filter by user ID
    
    Returns:
    [
        {
            "id": 1,
            "user": 1,
            "query": "...",
            "response": "...",
            "response_time": 1.23,
            "source": "ai",
            "created_at": "2024-01-01T00:00:00Z"
        },
        ...
    ]
    """
    try:
        queryset = QueryLog.objects.all().order_by('-created_at')
        
        # Apply filters from query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        source = request.query_params.get('source')
        user_id = request.query_params.get('user_id')
        
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        if source:
            queryset = queryset.filter(source=source)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        serializer = QueryLogSerializer(queryset, many=True)
        
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def query_log_detail_view(request, log_id):
    """
    Get a specific query log entry.
    """
    try:
        from django.shortcuts import get_object_or_404
        query_log = get_object_or_404(QueryLog, id=log_id)
        serializer = QueryLogSerializer(query_log)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_analytics_view(request):
    """
    Get analytics data for the current user.
    
    Returns:
    {
        "total_queries": 10,
        "avg_response_time": 1.23,
        "recent_queries": [...]
    }
    """
    try:
        from api.serializers.chat_serializers import MessageSerializer
        from apps.chatbot.models import Message
        
        user = request.user
        
        # Get user's query logs
        user_query_logs = QueryLog.objects.filter(user=user).order_by('-created_at')[:10]
        
        # Calculate user-specific stats
        total_queries = user_query_logs.count()
        avg_response_time = sum(
            log.response_time for log in user_query_logs
        ) / total_queries if total_queries > 0 else 0.0
        
        # Get recent queries
        recent_queries = [
            {"query": log.query, "created_at": log.created_at, "response_time": log.response_time}
            for log in user_query_logs[:5]
        ]
        
        response_data = {
            "total_queries": total_queries,
            "avg_response_time": round(avg_response_time, 2),
            "recent_queries": recent_queries
        }
        
        return Response(response_data)
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
