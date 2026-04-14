from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.prediction import PredictionRequest, FraudResponse
from app.services.fraud_service import run_fraud_detection
from app.utils.security import get_current_user_id

router = APIRouter()


@router.post("/detect", response_model=FraudResponse)
def detect_fraud(req: PredictionRequest, db: Session = Depends(get_db),
                  user_id: int = Depends(get_current_user_id)):
    return run_fraud_detection(req, db)
