from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomTokenObtainPairView, NilaiViewSet
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

router = DefaultRouter()
router.register(r'nilai', NilaiViewSet, basename='nilai')

urlpatterns += [
    path('', include(router.urls)),
]
