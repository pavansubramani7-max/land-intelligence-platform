"""Settings loaded from environment variables."""
import os
from pathlib import Path

class Settings:
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./data/model_registry")
    RETRAIN_INTERVAL_HOURS: int = int(os.getenv("RETRAIN_INTERVAL_HOURS", 24))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))

    # Feature lists
    VALUATION_FEATURES = [
        "area_sqft", "land_type_encoded", "zone_encoded",
        "infrastructure_score", "near_water", "near_highway",
        "road_access", "district_encoded",
    ]
    DISPUTE_FEATURES = [
        "ownership_changes_count", "survey_conflict",
        "litigation_history_count", "boundary_disputes", "multiple_claimants",
    ]
    FRAUD_FEATURES = [
        "price_change_pct", "days_since_last_sale",
        "ownership_changes_30d", "price_vs_area_median_ratio",
    ]

    def model_dir(self) -> Path:
        p = Path(self.MODEL_PATH)
        p.mkdir(parents=True, exist_ok=True)
        return p


settings = Settings()
