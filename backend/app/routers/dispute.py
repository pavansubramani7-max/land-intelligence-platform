from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.prediction import PredictionRequest, DisputeResponse
from app.services.dispute_service import run_dispute_prediction
from app.utils.security import get_current_user_id

router = APIRouter()


@router.post("/predict", response_model=DisputeResponse)
def predict_dispute(req: PredictionRequest, db: Session = Depends(get_db),
                     user_id: int = Depends(get_current_user_id)):
    return run_dispute_prediction(req, db)
