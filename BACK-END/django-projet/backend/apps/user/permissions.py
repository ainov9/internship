from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class IsAssitant_sousAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['assistant', 'sous-admin']
    
class IsUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'user'

class IsAdminOrAssitant_sousAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'assistant', 'sous-admin']
    

