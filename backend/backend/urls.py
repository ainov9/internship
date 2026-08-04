from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/', include('users.urls')),
    path('api/', include('datasets.urls')),
    path('api/', include('analytics.urls')),
]