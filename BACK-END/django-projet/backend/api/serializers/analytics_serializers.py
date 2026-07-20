"""
Analytics Serializers
Centralized serializers for analytics-related API endpoints.
"""
from rest_framework import serializers
from apps.analytics.models import QueryLog


class QueryLogSerializer(serializers.ModelSerializer):
    """
    Serializer for QueryLog model.
    """
    class Meta:
        model = QueryLog
        fields = ['id', 'user', 'query', 'response', 'response_time', 'source', 'created_at']
        read_only_fields = ['id', 'created_at']


class AnalyticsSummarySerializer(serializers.Serializer):
    """
    Serializer for analytics summary data.
    """
    total_queries = serializers.IntegerField()
    avg_response_time = serializers.FloatField()
    source_distribution = serializers.DictField(child=serializers.IntegerField())


class AnalyticsRequestSerializer(serializers.Serializer):
    """
    Serializer for analytics request parameters.
    """
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    source = serializers.CharField(required=False)
    user_id = serializers.IntegerField(required=False)
