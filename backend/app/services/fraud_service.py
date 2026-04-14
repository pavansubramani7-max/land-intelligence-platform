import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.schemas.prediction import PredictionRequest, FraudResponse
from app.ml.model_registry import load_model
from app.ml.train_fraud import FRAUD_FEATURES
from app.models.prediction import PredictionLog


def build_fraud_features(req: PredictionRequest) -> pd.DataFrame:
    price_change_pct = (req.market_price - req.area_sqft * 100) / (req.area_sqft * 100 + 1)
    data = {
        "price_change_pct": price_change_pct,
        "days_between_transfers": 365.0 / max(req.ownership_changes, 1),
        "ownership_count_90days": min(req.ownership_changes, 5),
        "price_vs_market_ratio": req.market_price / (req.area_sqft * 100 + 1),
    }
    return pd.DataFrame([data])


def identify_fraud_flags(req: PredictionRequest, anomaly_score: float) -> List[str]:
    flags = []
    if req.ownership_changes > 5:
        flags.append("Unusually high ownership changes")
    price_ratio = req.market_price / (req.area_sqft * 100 + 1)
    if price_ratio > 3.0:
        flags.append("Price significantly above market estimate")
    if price_ratio < 0.3:
        flags.append("Price significantly below market estimate")
    if anomaly_score < -0.1:
        flags.append("Statistical anomaly detected in transaction pattern")
    return flags


def run_fraud_detection(req: PredictionRequest, db: Session) -> FraudResponse:
    df = build_fraud_features(req)

    try:
        scaler = load_model("fraud_scaler")
        X_scaled = scaler.transform(df[FRAUD_FEATURES])
    except FileNotFoundError:
        X_scaled = df[FRAUD_FEATURES].fillna(0).values

    try:
        iso_forest = load_model("fraud_isolation_forest")
        anomaly_score = float(iso_forest.decision_function(X_scaled)[0])
        is_anomaly = iso_forest.predict(X_scaled)[0] == -1
    except FileNotFoundError:
        anomaly_score = -0.05
        is_anomaly = req.ownership_changes > 5

    try:
        rf_fraud = load_model("fraud_rf")
        fraud_proba = float(rf_fraud.predict_proba(X_scaled)[0][1])
    except FileNotFoundError:
        fraud_proba = 0.1 if not is_anomaly else 0.7

    fraud_flags = identify_fraud_flags(req, anomaly_score)

    log = PredictionLog(
        land_id=req.land_id,
        model_version="1.0",
        prediction_type="fraud",
        risk_score=fraud_proba,
        input_features=req.model_dump(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return FraudResponse(
        land_id=req.land_id,
        is_anomaly=bool(is_anomaly),
        anomaly_score=anomaly_score,
        fraud_probability=fraud_proba,
        fraud_flags=fraud_flags,
        prediction_id=log.id,
    )
