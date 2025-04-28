import json

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer, UserIBANConfirmSerializer

from transfers.models import Transfer
from transfers.serializers import TransferGETSerializer

# Create your views here.

class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = UserSerializer(request.user).data
        transfer_history = Transfer.objects.filter(sender=request.user) | Transfer.objects.filter(recipient=request.user)
        
        if (not transfer_history):
            return Response({'user': user}, status=200)
        
        transfer_history_serialize = TransferGETSerializer(transfer_history, many=True)
        transfer_history = json.dumps(transfer_history_serialize.data)
        # print(transfer_history)
        return Response({'user': user, 'transfer_history': transfer_history}, status=200)
    
class UserIBANConfirmAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserIBANConfirmSerializer

    def post(self, request):
        print(request.data['iban'])
        user = request.user
        user.iban = request.data['iban']
        user.save()
        return Response(status=200)
