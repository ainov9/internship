from apps.analytics.models import QueryLog
from django.db.models import Avg, Count


def get_total_queries():
    return QueryLog.objects.count()


def get_avg_response_time():
    return QueryLog.objects.aggregate(avg=Avg("response_time"))["avg"]


def get_source_distribution():
    return QueryLog.objects.values("source").annotate(count=Count("id"))


def log_query(user, query=None, response=None, response_time=None, source="ai"):
    """
    Log a query to the QueryLog model for analytics tracking.
    """
    QueryLog.objects.create(
        user=user,
        query=query or "",
        response=response or "",
        response_time=response_time or 0.0,
        source=source
    )



