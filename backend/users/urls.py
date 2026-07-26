from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import RegisterView, CurrentUserView, UserListView, UserCreateView

urlpatterns = [
    path('api/users/register/', RegisterView.as_view(), name='user-register'),
    path('api/users/api/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/users/api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/users/current/', CurrentUserView.as_view(), name='user-current'),
    path('api/users/list/', UserListView.as_view(), name='user-list'),
    path('api/users/create/', UserCreateView.as_view(), name='user-create'),
    path('api/users/<int:user_id>/', UserCreateView.as_view(), name='user-detail'),
]
