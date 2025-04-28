from django.urls import path, re_path

from .views import RegisterAPIView, CustomTokenObtainPairView, LogoutAPIView
from .views import PasswordResetRequestView, PasswordResetConfirmView, CookieTokenRefreshView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]