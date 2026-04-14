from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    land_id = Column(Integer, ForeignKey("land_records.id"), nullable=False)
    model_version = Column(String(50), nullable=False)
    prediction_type = Column(String(50), nullable=False)
    valuation = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)
    shap_values = Column(JSON, nullable=True)
    input_features = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    land = relationship("LandRecord", back_populates="predictions")
    feedbacks = relationship("Feedback", back_populates="prediction")
