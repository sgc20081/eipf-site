import random
import string
import uuid
import hashlib

from django.urls import reverse
from django.core.mail import send_mail
from django.contrib.auth import get_user_model, authenticate
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ErrorDetail

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password')

    def create(self, validated_data):

        def generate_id():
            while True:
                generated_id = f'CA-{''.join(random.choices(string.digits, k=10))}'
                user = User.objects.filter(id=generated_id)

                if (not user):
                    return generated_id
                
        generated_id = generate_id()
        unique_value = uuid.uuid4().hex
        private_key = hashlib.sha256(unique_value.encode()).hexdigest()[:35]
        private_key = (generated_id + private_key).lower().replace('-', '')
        password = validated_data.pop('password')
        validated_data['id'] = generated_id
        validated_data['private_key'] = private_key
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        print(user.__dict__)
        return user
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                [ErrorDetail("User with this email already exists", code="email_already_exists")]
            )
        return value

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'email': [ErrorDetail("Wrong password or user does not exist", code="user_not_exists")]
            })

        if not user.check_password(password):
            raise serializers.ValidationError({
                'email': [ErrorDetail("Wrong password or user does not exist", code="user_not_exists")]
            })

        # всё хорошо — передаём в стандартный `validate`
        data = super().validate(attrs)
        return data
        

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        print(attrs)
        if not User.objects.filter(email=attrs.get('email')).exists():
            raise serializers.ValidationError({
                'email': [ErrorDetail("User with this email do not exists", code="user_not_exists")]
            })
        data = super().validate(attrs)
        return data

    def save(self):
        request = self.context.get('request')
        origin = request.headers.get('X-Frontend-URL')

        if not origin:
            raise Exception('The request is missing the "X-Frontend-URL" header with the frontend URL')

        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Полный URL
        reset_url = f"{origin}/new-password?uid={uid}&token={token}"
        send_mail(
            subject="Сброс пароля",
            message=f"Перейдите по ссылке для сброса пароля: {reset_url}",
            from_email=None,
            recipient_list=[email],
        )


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        print(data)
        try:
            uid = urlsafe_base64_decode(data['uidb64']).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            raise serializers.ValidationError("Invalid UID.")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("The token is invalid or has expired.")

        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()