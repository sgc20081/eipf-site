from django.db import models

# Create your models here.

class Manager(models.Model):
    full_name = models.CharField(max_length=20)
    license = models.ImageField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class PaymentsDivisionManager(models.Model):
    full_name = models.CharField(max_length=20)
    license = models.ImageField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.full_name