from django.db import models
from django.contrib.auth.models import User


class QueryLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    query = models.TextField()
    handled = models.BooleanField(default=False)
    response_time_ms = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.query[:80]
