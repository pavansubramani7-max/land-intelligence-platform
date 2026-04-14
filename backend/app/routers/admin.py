from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.models.user import User
from app.models.land import LandRecord
from app.models.prediction import PredictionLog
from app.ml.model_registry import list_models
from app.utils.security import get_current_user_id

router = APIRouter()


def require_admin(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/stats")
def get_stats(db: Session = Depends(get_db),
               user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    require_admin(user_id, db)
    total_users = db.query(User).count()
    total_lands = db.query(LandRecord).count()
    total_predictions = db.query(PredictionLog).count()
    valuation_count = db.query(PredictionLog).filter(PredictionLog.prediction_type == "valuation").count()
    fraud_count = db.query(PredictionLog).filter(PredictionLog.prediction_type == "fraud").count()
    dispute_count = db.query(PredictionLog).filter(PredictionLog.prediction_type == "dispute").count()

    return {
        "total_users": total_users,
        "total_land_records": total_lands,
        "total_predictions": total_predictions,
        "valuation_predictions": valuation_count,
        "fraud_detections": fraud_count,
        "dispute_assessments": dispute_count,
    }


@router.get("/model-performance")
def get_model_performance(db: Session = Depends(get_db),
                           user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    require_admin(user_id, db)
    models = list_models()
    return {"models": models, "total_models": len(models)}


@router.get("/users")
def list_users(db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user_id)):
    require_admin(user_id, db)
    users = db.query(User).limit(100).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "phone": u.phone,
              "role": u.role, "is_active": u.is_active, "created_at": str(u.created_at)} for u in users]
