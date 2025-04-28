from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'full_name',
            'balance',
            'private_key',
            'permissions',
            'iban',
            'withdraw',
            'insurance',
        )

class UserIBANConfirmSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('iban')