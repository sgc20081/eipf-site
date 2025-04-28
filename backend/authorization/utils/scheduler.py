from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management import call_command

def clear_blacklist():
    print("Cler JWTBlacklist...")
    call_command("flushexpiredtokens")  # Executing django command

scheduler = BackgroundScheduler()
scheduler.add_job(clear_blacklist, 'cron', hour=3, minute=30) # Start clearing the token blacklist every day at 3:30 am
scheduler.start()