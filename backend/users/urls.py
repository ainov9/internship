from django.urls import path
from rest_framework_simplejwt.views import TokenViewBase
from users.serializers import StaffTokenObtainPairSerializer, StaffTokenRefreshSerializer
from users.views import CurrentUserView, UserListView


class StaffTokenObtainPairView(TokenViewBase):
    serializer_class = StaffTokenObtainPairSerializer


class StaffTokenRefreshView(TokenViewBase):
    serializer_class = StaffTokenRefreshSerializer

urlpatterns = [
    path('users/api/token/', StaffTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('users/api/token/refresh/', StaffTokenRefreshView.as_view(), name='token-refresh'),
    path('users/current/', CurrentUserView.as_view(), name='user-current'),
    path('users/list/', UserListView.as_view(), name='user-list'),
]
