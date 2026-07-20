"""
User Views
Centralized API views for user-related endpoints.
All views ONLY call service functions or interact with models directly for CRUD.
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from apps.user.models import User
from api.serializers.user_serializers import (
    UserSerializer,
    UserListSerializer,
    UserCreateSerializer
)


class UserListView(generics.ListAPIView):
    """
    List all users (admin only).
    """
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific user by ID.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Allow users to view their own profile
        if self.request.method == 'GET':
            if 'pk' in self.kwargs and str(self.request.user.id) == self.kwargs['pk']:
                return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminUser()]


class UserCreateView(generics.CreateAPIView):
    """
    Create a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    Get the current authenticated user's information.
    
    Returns:
    {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "user"
    }
    """
    try:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
