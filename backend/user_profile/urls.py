from django.urls import path

from .views import ProfileAPIView, UserIBANConfirmAPIView

urlpatterns = [
    path('', ProfileAPIView.as_view()),
    path('iban-confirm/', UserIBANConfirmAPIView.as_view()),
]