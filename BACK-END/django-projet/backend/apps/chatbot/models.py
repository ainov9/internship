from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)   # The user who initiated the conversation
    created_at = models.DateTimeField(auto_now_add=True)  # The user who initiated the conversation


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.CharField(max_length=10)  # "user" or "bot"
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)