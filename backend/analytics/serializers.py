from rest_framework import serializers
from analytics.models import QueryLog


class QueryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryLog
        fields = ['id', 'query', 'handled', 'response_time_ms', 'created_at']
        read_only_fields = ['id', 'created_at']
