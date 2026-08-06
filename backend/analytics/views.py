from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from users.permissions import IsStaffUser
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.models import QueryLog
from analytics.serializers import QueryLogSerializer
from datasets.models import FAQ


class AnalyticsSummaryView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        total_faqs = FAQ.objects.count()
        answered = FAQ.objects.filter(status='Answered').count()
        unanswered = FAQ.objects.filter(status='Unanswered').count()
        total_queries = QueryLog.objects.count()
        handled_queries = QueryLog.objects.filter(handled=True).count()

        return Response({
            'total_faqs': total_faqs,
            'answered_faqs': answered,
            'unanswered_faqs': unanswered,
            'total_queries': total_queries,
            'handled_queries': handled_queries,
        })


class QueryLogListView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        logs = QueryLog.objects.all()[:100]
        serializer = QueryLogSerializer(logs, many=True)
        return Response(serializer.data)


class UserAnalyticsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        total_queries = QueryLog.objects.count()
        handled = QueryLog.objects.filter(handled=True).count()
        not_handled = total_queries - handled
        avg_response_time = 0
        if total_queries > 0:
            from django.db.models import Avg
            avg_result = QueryLog.objects.aggregate(avg=Avg('response_time_ms'))
            avg_response_time = round((avg_result['avg'] or 0) / 1000, 1)

        return Response({
            'total_queries': total_queries,
            'handled': handled,
            'not_handled': not_handled,
            'avg_response_time': avg_response_time,
        })
