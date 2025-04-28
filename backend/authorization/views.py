import json

from datetime import datetime, timedelta

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer

from utils.utils import errordetail_to_dict

from django.conf import settings

# Create your views here.

User = get_user_model()

# New user registration
class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            content = super().create(request, *args, **kwargs)
        except Exception as e:
            print(f'Error: {self.__class__.__name__}: {e}')
            errors = errordetail_to_dict(e)
            if not errors:
                errors = str(e)    
            return Response({'errors': errors}, status=400)
        return content

# Issuing a JWT token upon user authentication
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        print(request.POST)
        try:
            print(request.COOKIES)

            response = super().post(request, *args, **kwargs)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            refresh = serializer.validated_data['refresh']
            access = serializer.validated_data['access']

            access_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
            refresh_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

            now = datetime.now()

            access_exp = now + access_lifetime
            refresh_exp = now + refresh_lifetime

            response.set_cookie(
                key='access_token',
                value=str(access),
                httponly=False,
                secure=True,
                samesite='None',
                max_age=access_lifetime,
            )

            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=False,
                secure=True,
                samesite='None',
                max_age=refresh_lifetime,
            )
            
            response.data = {'access_exp': access_exp, 'refresh_exp': refresh_exp}

            return response
        except Exception as e:
            print(f'Error: {self.__class__.__name__}: {e}')
            errors = errordetail_to_dict(e)
            if not errors:
                errors = str(e)
            return Response({'errors': errors}, status=400)
        
class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'No refresh token in cookies'}, status=401)

        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access = response.data['access']
            access_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']

            response.set_cookie(
                'access_token',
                access,
                max_age=access_lifetime,
                httponly=True,
                secure=True,
                samesite='None',
            )

            now = datetime.now()
            access_exp = now + access_lifetime
            response.data = {'access_exp': access_exp}
        return response

# User logout with adding a JWT refresh token to the blacklist
class LogoutAPIView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            print('refresh_token for logout', refresh_token)
            if not refresh_token:
                return Response({'error': 'No refresh token found'}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response({'message': 'Logged out successfully'}, status=200)
            response.delete_cookie('access_token', path='/', samesite='None')
            response.delete_cookie('refresh_token', path='/', samesite='None')
            return response
        except Exception as e:
            print(f'Logout error: {self.__class__.__name__}: {e}')
            return Response({'error': 'Invalid refresh token'}, status=400)
        
class PasswordResetRequestView(APIView):
    def post(self, request):
        try:
            serializer = PasswordResetRequestSerializer(data=request.data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({'message': 'A password reset link has been sent to your email'}, status=200)
        except Exception as e:
            print(f'Error: {self.__class__.__name__}: {e}')
            errors = errordetail_to_dict(e)
            if not errors:
                errors = str(e)
            print(errors)
            return Response({'errors': errors}, status=400)
        
class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password reset successfully'}, status=200)
        print(serializer.errors)
        return Response(serializer.errors, status=400)
