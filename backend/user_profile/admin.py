from django.contrib import admin, messages
from django.utils.translation import ngettext

from .models import Manager, PaymentsDivisionManager
from authorization.models import CustomUser
from transfers.models import Transfer

# Register your models here.

@admin.action(description='Enable the withdrawal button')
def withdraw_btn_on(modeladmin, request, queryset):
    updated = queryset.update(withdraw=True)
    modeladmin.message_user(
        request,
        ngettext(
            "%d user withdrawal button was successfully activated.",
            "%d users withdrawal button was successfully activated.",
            updated,
        )
        % updated,
        messages.SUCCESS,
    )

@admin.action(description='Disable the withdrawal button')
def withdraw_btn_off(modeladmin, request, queryset):
    updated = queryset.update(withdraw=False)
    modeladmin.message_user(
        request,
        ngettext(
            "%d user withdrawal button was successfully deactivated.",
            "%d users withdrawal button was successfully deactivated.",
            updated,
        )
        % updated,
        messages.SUCCESS,
    )

@admin.action(description='Make insurance \'True\'')
def insurance_on(modeladmin, request, queryset):
    updated = queryset.update(insurance=True)
    modeladmin.message_user(
        request,
        ngettext(
            "%d user insurance was successfully activated.",
            "%d users insurance was successfully activated.",
            updated,
        )
        % updated,
        messages.SUCCESS,
    )

@admin.action(description='Make insurance \'False\'')
def insurance_off(modeladmin, request, queryset):
    updated = queryset.update(insurance=False)
    modeladmin.message_user(
        request,
        ngettext(
            "%d user insurance was successfully deactivated.",
            "%d users insurance was successfully deactivated.",
            updated,
        )
        % updated,
        messages.SUCCESS,
    )


class CustomUserAdmin(admin.ModelAdmin):
    list_display = [
        'email',
        'id',
        'full_name',
        'password',
        'date_create',
        'date_update',
        'private_key',
        'balance',
        'iban',
        'withdraw',
        'insurance',
        'manager',
        'payments_division_manager',
        'permissions'
    ]
    fields = list_display
    readonly_fields = ['email', 'id', 'full_name', 'password', 'date_create', 'date_update', 'private_key']
    search_fields = ['email', 'id', 'full_name', 'private_key']
    actions = [withdraw_btn_on, withdraw_btn_off, insurance_on, insurance_off]

    def save_model(self, request, obj, form, change):
        old_obj = type(obj).objects.get(pk=obj.pk)
        transfer = Transfer()

        if obj.balance > old_obj.balance:
            transfer.ammount = obj.balance - old_obj.balance
            transfer.type = 'replenishment'
            transfer.recipient = obj
        elif obj.balance < old_obj.balance:
            transfer.ammount = old_obj.balance - obj.balance
            transfer.type = 'withdrawal'
            transfer.sender = obj
        elif obj.balance == old_obj.balance:
            return super().save_model(request, obj, form, change)

        transfer.save()
        return super().save_model(request, obj, form, change)

class ManagerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'id', 'license', 'date']
    fields = list_display
    readonly_fields = ['id', 'date']
    exclude = ['id', 'date']

class PaymentsDivisionManagerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'id', 'license', 'date']
    fields = list_display
    readonly_fields = ['id', 'date']
    exclude = ['id', 'date']


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Manager, ManagerAdmin)
admin.site.register(PaymentsDivisionManager, PaymentsDivisionManagerAdmin)