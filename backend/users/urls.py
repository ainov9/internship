from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import RegisterView, CurrentUserView, UserListView, UserCreateView

urlpatterns = [
    path('users/register/', RegisterView.as_view(), name='user-register'),
    path('users/api/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('users/api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('users/current/', CurrentUserView.as_view(), name='user-current'),
    path('users/list/', UserListView.as_view(), name='user-list'),
    path('users/create/', UserCreateView.as_view(), name='user-create'),
    path('users/<int:user_id>/', UserCreateView.as_view(), name='user-detail'),
]