from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, NilaiSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import Nilai

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class NilaiViewSet(viewsets.ModelViewSet):
    queryset = Nilai.objects.all()
    serializer_class = NilaiSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, 'role', None)
        if role == 'student':
            return Nilai.objects.filter(student=user)
        if role == 'instructor':
            return Nilai.objects.filter(lecturer=user)
        # staff/admin fallback
        return Nilai.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, 'role', None) != 'instructor':
            raise PermissionDenied('Hanya dosen yang dapat membuat nilai.')
        serializer.save(lecturer=user)

    def perform_update(self, serializer):
        user = self.request.user
        if getattr(user, 'role', None) != 'instructor':
            raise PermissionDenied('Hanya dosen yang dapat mengubah nilai.')
        serializer.save(lecturer=user)

    def perform_destroy(self, instance):
        user = self.request.user
        if getattr(user, 'role', None) != 'instructor':
            raise PermissionDenied('Hanya dosen yang dapat menghapus nilai.')
        instance.delete()