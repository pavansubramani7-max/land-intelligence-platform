from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List
from services.shap_service import SHAPService
from config import settings
import numpy as np

router = APIRouter(tags=["Explainability"])


class ExplainInput(BaseModel):
    feature_values: List[float]


@router.post("/explainability/shap")
def get_shap(payload: ExplainInput, request: Request):
    model = request.app.state.models.get("valuation")
    if not model:
        raise HTTPException(503, "Model not loaded")
    X = np.array([payload.feature_values])
    X_scaled = model.scaler.transform(X)
    svc = SHAPService(model.rf, settings.VALUATION_FEATURES)
    return svc.explain(X_scaled)
