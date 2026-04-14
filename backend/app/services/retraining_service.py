import pandas as pd
from typing import Dict, Any
from app.ml.drift_detector import detect_drift
from app.ml.train_valuation import train_valuation_models
from app.ml.train_dispute import train_dispute_models
from app.ml.train_fraud import train_fraud_models
from app.ml.feature_engineering import ALL_FEATURES
from app.utils.logger import logger


def check_and_retrain(reference_csv: str, current_data: pd.DataFrame,
                       force: bool = False) -> Dict[str, Any]:
    try:
        reference_df = pd.read_csv(reference_csv)
        numeric_features = [f for f in ALL_FEATURES if f not in ("zone_type", "soil_type")]
        drift_result = detect_drift(reference_df, current_data, numeric_features)
    except Exception as e:
        logger.error(f"Drift detection failed: {e}")
        drift_result = {"drift_detected": False}

    retrained = []
    if drift_result.get("drift_detected") or force:
        logger.info("Drift detected or forced retraining. Starting retraining...")
        try:
            train_valuation_models(reference_csv)
            retrained.append("valuation")
        except Exception as e:
            logger.error(f"Valuation retraining failed: {e}")

        try:
            train_dispute_models(reference_csv)
            retrained.append("dispute")
        except Exception as e:
            logger.error(f"Dispute retraining failed: {e}")

        try:
            train_fraud_models(reference_csv)
            retrained.append("fraud")
        except Exception as e:
            logger.error(f"Fraud retraining failed: {e}")

    return {
        "drift_detected": drift_result.get("drift_detected", False),
        "models_retrained": retrained,
        "drift_details": drift_result.get("feature_results", {}),
    }
