"""Valuation prediction router."""
from fastapi import APIRouter, Request, HTTPException
from schemas.valuation_schema import ValuationInput, ValuationOutput
from services.shap_service import SHAPService
from config import settings

router = APIRouter(tags=["Valuation"])


@router.post("/valuation/predict", response_model=ValuationOutput)
def predict_valuation(payload: ValuationInput, request: Request):
    model = request.app.state.models.get("valuation")
    if not model:
        raise HTTPException(503, "Valuation model not loaded")

    features = payload.model_dump()
    result = model.predict(features)

    # SHAP explanation
    shap_values = {}
    try:
        import numpy as np
        from models.valuation_model import ValuationModel
        import pandas as pd
        df = pd.DataFrame([features])
        for col in ["land_type", "zone", "district"]:
            if col not in df.columns:
                df[col] = "residential" if col == "land_type" else ("A" if col == "zone" else "Mumbai")
        X = model._encode(df)
        X_scaled = model.scaler.transform(X)
        svc = SHAPService(model.rf, settings.VALUATION_FEATURES)
        shap_out = svc.explain(X_scaled)
        shap_values = {item["feature"]: item["shap_value"] for item in shap_out["top_features"]}
    except Exception:
        pass

    # Recommendation
    confidence = result["confidence_score"]
    action = "BUY" if confidence > 0.8 else ("HOLD" if confidence > 0.5 else "AVOID")
    recommendation = {"action": action, "score": round(confidence * 100, 1), "reason": f"Model confidence {confidence:.0%}"}

    return ValuationOutput(
        predicted_price=result["predicted_price"],
        confidence_score=result["confidence_score"],
        model_used=result["model_used"],
        shap_values=shap_values,
        breakdown=result["breakdown"],
        recommendation=recommendation,
    )
