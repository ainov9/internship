"""
User Serializers
Centralized serializers for user-related API endpoints.
"""
from rest_framework import serializers
from apps.user.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Handles serialization and deserialization of user data.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        read_only_fields = ['id']


class UserListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing users.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'role']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new users.
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'user')
        )
        return user
