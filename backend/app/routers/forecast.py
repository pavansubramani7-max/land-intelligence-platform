from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.prediction import PredictionRequest, ForecastResponse
from app.services.forecast_service import run_forecast
from app.utils.security import get_current_user_id

router = APIRouter()


@router.post("/", response_model=ForecastResponse)
def forecast(req: PredictionRequest, db: Session = Depends(get_db),
              user_id: int = Depends(get_current_user_id)):
    return run_forecast(req)
