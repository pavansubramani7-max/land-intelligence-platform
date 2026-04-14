from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("prediction_logs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    actual_value = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    prediction = relationship("PredictionLog", back_populates="feedbacks")
    user = relationship("User", back_populates="feedbacks")
