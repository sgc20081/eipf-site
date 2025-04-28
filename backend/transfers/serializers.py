import decimal
import json

from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework.exceptions import ErrorDetail


from .models import Transfer
from user_profile.serializers import UserSerializer

User = get_user_model()

class TransferPOSTSerializer(serializers.ModelSerializer):
    private_key = serializers.CharField(write_only=True)
    
    class Meta:
        model = Transfer
        fields = ['private_key', 'ammount']
        # exclude = ('id')

    def validate(self, attrs):
        # print(attrs)
        # print(self.context['request'])
        sender = self.context['request'].user
        recipient = None
        # return super().validate(attrs)
    
        try:
            recipient = User.objects.get(private_key=attrs.get('private_key'))
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'private_key': [ErrorDetail('There is no user with such private key', code='invalid_recipient')]
                })

        transfer_ammount = decimal.Decimal(attrs.get('ammount'))
        sender_balance = decimal.Decimal(sender.balance)
        recipient_balance = decimal.Decimal(recipient.balance)
        
        if transfer_ammount > sender_balance:
            raise serializers.ValidationError({
                'ammount': [ErrorDetail('Not enough funds to transfer', code='insufficient_funds')]
                })
        
        attrs['sender_balance'] = sender_balance
        attrs['recipient_balance'] = recipient_balance
        attrs['transfer_ammount'] = transfer_ammount
        attrs['sender'] = sender
        attrs['recipient'] = recipient
        return attrs
    
    def create(self, validated_data):
        sender = validated_data['sender']
        recipient = validated_data['recipient']
        transfer_ammount = validated_data['transfer_ammount']
        sender_balance = validated_data['sender_balance']
        recipient_balance = validated_data['recipient_balance']

        sender.balance = sender_balance - transfer_ammount
        recipient.balance = recipient_balance + transfer_ammount

        sender.save()
        recipient.save()

        transfer = Transfer.objects.create(
            ammount = transfer_ammount, 
            type = 'transfer',
            sender = sender,
            recipient = recipient
        )

        return transfer

class TransferGETSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    recipient = UserSerializer()

    class Meta:
        model = Transfer
        fields = ['id', 'ammount', 'type', 'date', 'sender', 'recipient']