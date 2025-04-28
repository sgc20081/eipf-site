import threading
import time

from django.apps import AppConfig
from django.db import connection


class AuthorizationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authorization'

    def ready(self):
        from authorization.utils.scheduler import scheduler

        def wait_for_db():
            """Waiting for the database to be ready"""
            while True:
                try:
                    connection.ensure_connection()  # Checking the connection to the database
                    break  # If the connection is successful, exit the loop
                except Exception:
                    print("⏳ Waiting for database...")
                    time.sleep(1)  # Wait 1 second and try again

            from authorization.utils.scheduler import clear_blacklist
            clear_blacklist()
            print("✅ Blacklist clering completed!")

        # We start waiting for the database in a separate thread
        threading.Thread(target=wait_for_db).start()