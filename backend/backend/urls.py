from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chatbot/', include('chatbot.urls')),
    path('', include('users.urls')),
    path('', include('datasets.urls')),
    path('', include('analytics.urls')),
]
