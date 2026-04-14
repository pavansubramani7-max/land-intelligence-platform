from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class ZoneType(str, enum.Enum):
    residential = "residential"
    commercial = "commercial"
    agricultural = "agricultural"
    industrial = "industrial"


class LandRecord(Base):
    __tablename__ = "land_records"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    area_sqft = Column(Float, nullable=False)
    zone_type = Column(Enum(ZoneType), nullable=False)
    road_proximity_km = Column(Float, default=0.0)
    infrastructure_score = Column(Float, default=50.0)
    year_established = Column(Integer, nullable=True)
    soil_type = Column(String(50), nullable=True)
    flood_risk = Column(Boolean, default=False)
    market_price = Column(Float, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="land_records")
    ownership_history = relationship("OwnershipHistory", back_populates="land")
    predictions = relationship("PredictionLog", back_populates="land")
    documents = relationship("LegalDocument", back_populates="land")
