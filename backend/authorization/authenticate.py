from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomAuthenticationBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):

        if hasattr(request, 'data'):
            print(request.data)
            username = request.data['email']

        print('РУЗУЛЬТАТ: ', username)

        if '@' in username:
            email = username
        else:
            print ('Incorrect email or user does not exist')
            return None

        try:
            user = get_user_model().objects.get(email=email)
            # print(user.__dict__)
            if user.password == password:
                return user
        except get_user_model().DoesNotExist:
            # print('User does not exists')
            return None

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token