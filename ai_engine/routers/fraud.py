from fastapi import APIRouter, Request, HTTPException
from schemas.fraud_schema import FraudInput, FraudOutput

router = APIRouter(tags=["Fraud"])


@router.post("/fraud/detect", response_model=FraudOutput)
def detect_fraud(payload: FraudInput, request: Request):
    model = request.app.state.models.get("fraud")
    if not model:
        raise HTTPException(503, "Fraud model not loaded")
    return model.predict(payload.model_dump())
