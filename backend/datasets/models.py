from django.db import models


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField(blank=True, default='')
    category = models.CharField(max_length=100, default='General')
    status = models.CharField(
        max_length=20,
        choices=[('Answered', 'Answered'), ('Unanswered', 'Unanswered')],
        default='Unanswered',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.question[:80]


class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    content = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
