from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.prediction import PredictionRequest, ValuationResponse
from app.services.valuation_service import run_valuation
from app.utils.security import get_current_user_id

router = APIRouter()


@router.post("/predict", response_model=ValuationResponse)
def predict_valuation(req: PredictionRequest, db: Session = Depends(get_db),
                       user_id: int = Depends(get_current_user_id)):
    return run_valuation(req, db)
