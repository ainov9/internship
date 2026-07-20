from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class QueryLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    query = models.TextField()
    response = models.TextField()

    response_time = models.FloatField()

    source = models.CharField(
        max_length=20,
        choices=[
            ("ai", "AI"),
            ("dataset", "Dataset"),
            ("human", "Human"),
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)