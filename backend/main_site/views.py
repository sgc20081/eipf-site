from django.views.generic.base import TemplateView

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import AccessToken
from datetime import datetime

# Create your views here.

# class IndexPageAPIView(TemplateView):
#     template_name='index.html'

# class ProtectedAPIView(APIView):
#     permission_classes = [IsAuthenticated]  # Only authorized users

#     def get(self, request):
#         token = request.headers['Authorization'].replace('Bearer ', '')
#         token = AccessToken(token)
#         user = request.user  # Django has already verified the access token
#         return Response({'message': f'Hello, {user.email}!'})