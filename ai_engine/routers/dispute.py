from fastapi import APIRouter, Request, HTTPException
from schemas.dispute_schema import DisputeInput, DisputeOutput

router = APIRouter(tags=["Dispute"])


@router.post("/dispute/predict", response_model=DisputeOutput)
def predict_dispute(payload: DisputeInput, request: Request):
    model = request.app.state.models.get("dispute")
    if not model:
        raise HTTPException(503, "Dispute model not loaded")
    return model.predict(payload.model_dump())
