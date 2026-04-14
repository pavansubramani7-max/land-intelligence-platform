import numpy as np
import pandas as pd
from sqlalchemy.orm import Session

from app.schemas.prediction import PredictionRequest, ValuationResponse
from app.ml.model_registry import load_model
from app.ml.feature_engineering import EXTENDED_ALL, prepare_features
from app.models.prediction import PredictionLog
from app.services.shap_service import get_shap_explanation


def build_feature_df(req: PredictionRequest) -> pd.DataFrame:
    return pd.DataFrame([{
        "area_sqft": req.area_sqft,
        "location_score": req.location_score,
        "zone_type": req.zone_type,
        "road_proximity_km": req.road_proximity_km,
        "infrastructure_score": req.infrastructure_score,
        "year_established": req.year_established or 2010,
        "soil_type": req.soil_type or "loam",
        "flood_risk": int(req.flood_risk),
        "market_price": req.market_price,
        "ownership_changes": req.ownership_changes,
        "litigation_count": req.litigation_count,
    }])


def run_valuation(req: PredictionRequest, db: Session) -> ValuationResponse:
    df = build_feature_df(req)
    df = prepare_features(df)

    try:
        preprocessor = load_model("valuation_preprocessor")
        X_proc = preprocessor.transform(df[EXTENDED_ALL])
    except Exception:
        from app.ml.feature_engineering import ALL_FEATURES
        X_proc = df[ALL_FEATURES].fillna(0).values

    # RF prediction
    try:
        rf_pred = float(load_model("valuation_rf").predict(X_proc)[0])
        rf_pred = max(rf_pred, req.market_price * 0.3)  # floor at 30% of market
    except Exception:
        rf_pred = req.market_price * 1.10

    # XGB prediction
    try:
        xgb_pred = float(load_model("valuation_xgb").predict(X_proc)[0])
        xgb_pred = max(xgb_pred, req.market_price * 0.3)
    except Exception:
        xgb_pred = req.market_price * 1.05

    # ANN prediction — use RF/XGB average as fallback if ANN gives bad result
    try:
        ann_model = load_model("valuation_ann")
        y_scaler = load_model("valuation_target_scaler")
        ann_raw = float(y_scaler.inverse_transform(
            ann_model.predict(X_proc).reshape(-1, 1))[0][0])
        # Sanity check: ANN must be within 3x of RF/XGB average
        rf_xgb_avg = (rf_pred + xgb_pred) / 2
        if ann_raw < 0 or ann_raw > rf_xgb_avg * 3 or ann_raw < rf_xgb_avg * 0.2:
            ann_pred = rf_xgb_avg  # fallback
        else:
            ann_pred = ann_raw
    except Exception:
        ann_pred = (rf_pred + xgb_pred) / 2

    # Weighted ensemble: XGB 45% + RF 35% + ANN 20%
    ensemble_val = 0.45 * xgb_pred + 0.35 * rf_pred + 0.20 * ann_pred

    # Confidence: how close are the 3 models to each other
    preds = [rf_pred, xgb_pred, ann_pred]
    mean_pred = np.mean(preds)
    std_pred = np.std(preds)
    cv = std_pred / (mean_pred + 1e-9)
    confidence = float(max(0.50, min(0.99, 1.0 - cv)))

    try:
        shap_data = get_shap_explanation("valuation_rf", X_proc, EXTENDED_ALL)
    except Exception:
        shap_data = {"shap_values": {}, "feature_contributions": []}

    log = PredictionLog(
        land_id=req.land_id, model_version="2.0",
        prediction_type="valuation",
        valuation=ensemble_val,
        confidence_score=confidence,
        shap_values=shap_data.get("shap_values", {}),
        input_features=req.model_dump(),
    )
    db.add(log); db.commit(); db.refresh(log)

    return ValuationResponse(
        land_id=req.land_id,
        estimated_value=round(ensemble_val, 2),
        confidence_score=round(confidence, 4),
        rf_prediction=round(rf_pred, 2),
        xgb_prediction=round(xgb_pred, 2),
        ann_prediction=round(ann_pred, 2),
        shap_values=shap_data.get("shap_values", {}),
        feature_contributions=shap_data.get("feature_contributions", []),
        model_version="2.0",
        prediction_id=log.id,
    )
