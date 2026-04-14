import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.schemas.prediction import PredictionRequest, DisputeResponse
from app.ml.model_registry import load_model
from app.ml.train_dispute import DISPUTE_FEATURES
from app.models.prediction import PredictionLog


def build_dispute_features(req: PredictionRequest) -> pd.DataFrame:
    data = {
        "ownership_change_count": req.ownership_changes,
        "litigation_count": req.litigation_count,
        "survey_conflict": 0,
        "area_mismatch": 0,
        "document_inconsistency_count": 0,
        "price_volatility": abs(req.market_price - req.area_sqft * 100) / (req.market_price + 1),
    }
    return pd.DataFrame([data])


def assess_risk_factors(req: PredictionRequest, risk_label: str) -> List[str]:
    factors = []
    if req.ownership_changes > 3:
        factors.append("High number of ownership changes")
    if req.litigation_count > 0:
        factors.append(f"{req.litigation_count} active litigation(s)")
    if req.flood_risk:
        factors.append("Property in flood risk zone")
    if risk_label == "high":
        factors.append("Multiple risk indicators detected")
    return factors


def run_dispute_prediction(req: PredictionRequest, db: Session) -> DisputeResponse:
    df = build_dispute_features(req)

    try:
        scaler = load_model("dispute_scaler")
        X_scaled = scaler.transform(df[DISPUTE_FEATURES])
    except FileNotFoundError:
        X_scaled = df[DISPUTE_FEATURES].fillna(0).values

    try:
        rf_model = load_model("dispute_rf")
        le = load_model("dispute_label_encoder")
        proba = rf_model.predict_proba(X_scaled)[0]
        pred_class = rf_model.predict(X_scaled)[0]
        risk_label = le.inverse_transform([pred_class])[0]
        risk_score = float(max(proba))
    except FileNotFoundError:
        risk_score = min(1.0, req.ownership_changes * 0.1 + req.litigation_count * 0.2)
        risk_label = "high" if risk_score > 0.6 else "medium" if risk_score > 0.3 else "low"

    risk_factors = assess_risk_factors(req, risk_label)

    log = PredictionLog(
        land_id=req.land_id,
        model_version="1.0",
        prediction_type="dispute",
        risk_score=risk_score,
        input_features=req.model_dump(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return DisputeResponse(
        land_id=req.land_id,
        dispute_risk_label=risk_label,
        dispute_risk_score=risk_score,
        risk_factors=risk_factors,
        prediction_id=log.id,
    )
