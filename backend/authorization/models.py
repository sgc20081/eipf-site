from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from user_profile.models import Manager, PaymentsDivisionManager
# Create your models here.

class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The user must have an email")
        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **extra_fields)
        print(user.__dict__)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):

    PERMISSIONS = [
        ('user', 'User'),
        ('admin', 'Admin')
    ]

    id = models.CharField(max_length=15, primary_key=True)
    full_name = models.CharField(max_length=60, null=True)
    email = models.EmailField(max_length=25, unique=True)
    password = models.CharField(max_length=15)
    date_create = models.DateTimeField(auto_now_add=True, null=True)
    date_update = models.DateTimeField(auto_now=True, null=True)
    balance = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, null=True)
    private_key = models.CharField(max_length=60, null=True)
    iban = models.CharField(max_length=35, null=True)
    withdraw = models.BooleanField(default=False, null=True)
    insurance = models.BooleanField(default=False, null=True)
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, null=True)
    payments_division_manager = models.ForeignKey(PaymentsDivisionManager, on_delete=models.CASCADE, null=True)
    permissions = models.CharField(max_length=10, choices=PERMISSIONS, default='user')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email