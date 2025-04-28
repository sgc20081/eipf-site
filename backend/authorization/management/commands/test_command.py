from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Test_command"

    def handle(self, *args, **kwargs):
        self.stdout.write('Test command runing')