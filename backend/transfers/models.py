from django.db import models

from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Transfer(models.Model):
    TRANSFER_TYPE = {
        ('replenishment', 'Replenishment'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer')
    }

    ammount = models.DecimalField(max_digits=20, decimal_places=2)
    type = models.CharField(max_length=20, choices=TRANSFER_TYPE)
    date = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name='sent_transfers'
    )
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name='received_transfers'
    )

    class Meta:
        ordering = ['-date']  # Ordering by date

    def __str__(self):
        return f"{self.type.capitalize()} of {self.amount} on {self.date.strftime('%Y-%m-%d')}"

    def is_user_to_user(self):
        return self.type == 'transfer' and self.sender and self.recipient

    def is_replenishment(self):
        return self.type == 'replenishment'

    def is_withdrawal(self):
        return self.type == 'withdrawal'