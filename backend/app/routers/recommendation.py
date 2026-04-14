from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.schemas.prediction import PredictionRequest
from app.services.recommendation_service import get_recommendation
from app.utils.security import get_current_user_id

router = APIRouter()


@router.post("/")
def recommend(req: PredictionRequest, db: Session = Depends(get_db),
               user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    return get_recommendation(req, db)
