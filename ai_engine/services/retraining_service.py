"""Continuous learning / retraining service."""
import asyncio
from datetime import datetime
from config import settings


async def schedule_retraining(models: dict):
    """Periodically retrain models with new data."""
    interval = settings.RETRAIN_INTERVAL_HOURS * 3600
    while True:
        await asyncio.sleep(interval)
        print(f"[{datetime.utcnow()}] Retraining triggered...")
        # In production: fetch new labeled data from DB and call model.train()
        for name, model in models.items():
            try:
                model.load_or_train()
                print(f"  ✓ {name} retrained")
            except Exception as e:
                print(f"  ✗ {name} retrain failed: {e}")
