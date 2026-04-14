from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models.feedback import Feedback
from app.utils.security import get_current_user_id

router = APIRouter()


class FeedbackCreate(BaseModel):
    prediction_id: int
    user_rating: int
    comment: Optional[str] = None
    actual_value: Optional[float] = None


@router.post("/", status_code=201)
def submit_feedback(body: FeedbackCreate, db: Session = Depends(get_db),
                     user_id: int = Depends(get_current_user_id)):
    feedback = Feedback(
        prediction_id=body.prediction_id,
        user_id=user_id,
        user_rating=body.user_rating,
        comment=body.comment,
        actual_value=body.actual_value,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return {"id": feedback.id, "message": "Feedback submitted"}


@router.get("/prediction/{prediction_id}")
def get_feedback(prediction_id: int, db: Session = Depends(get_db),
                  user_id: int = Depends(get_current_user_id)):
    feedbacks = db.query(Feedback).filter(Feedback.prediction_id == prediction_id).all()
    return [{"id": f.id, "rating": f.user_rating, "comment": f.comment,
              "actual_value": f.actual_value} for f in feedbacks]
