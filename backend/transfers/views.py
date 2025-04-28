import decimal
import json

from django.shortcuts import render
from django.contrib.auth import get_user_model

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView

from .models import Transfer
from .serializers import TransferPOSTSerializer, TransferGETSerializer

from utils.utils import errordetail_to_dict

# Create your views here.

User = get_user_model()

class TransferAPIView(CreateAPIView):
    queryset = Transfer.objects.all()
    serializer_class = TransferPOSTSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        try:
            content = super().create(request, *args, **kwargs)
        except Exception as e:
            print(e)
            errors = errordetail_to_dict(e)         
            return Response({'errors': errors}, status=400)
        return content

class TransfersHistoryAPIView(APIView):
    pass