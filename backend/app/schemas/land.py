from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class ZoneType(str, Enum):
    residential = "residential"
    commercial = "commercial"
    agricultural = "agricultural"
    industrial = "industrial"


class LandInput(BaseModel):
    title: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_sqft: float
    zone_type: ZoneType
    road_proximity_km: float = 0.0
    infrastructure_score: float = 50.0
    year_established: Optional[int] = None
    soil_type: Optional[str] = None
    flood_risk: bool = False
    market_price: float

    @field_validator("area_sqft")
    @classmethod
    def area_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Area must be positive")
        return v

    @field_validator("market_price")
    @classmethod
    def price_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Price must be positive")
        return v

    @field_validator("infrastructure_score")
    @classmethod
    def score_range(cls, v: float) -> float:
        if not 0 <= v <= 100:
            raise ValueError("Infrastructure score must be between 0 and 100")
        return v


class LandOut(BaseModel):
    id: int
    title: str
    location: str
    latitude: Optional[float]
    longitude: Optional[float]
    area_sqft: float
    zone_type: ZoneType
    road_proximity_km: float
    infrastructure_score: float
    year_established: Optional[int]
    soil_type: Optional[str]
    flood_risk: bool
    market_price: float
    owner_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class LandUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    area_sqft: Optional[float] = None
    zone_type: Optional[ZoneType] = None
    road_proximity_km: Optional[float] = None
    infrastructure_score: Optional[float] = None
    market_price: Optional[float] = None
    flood_risk: Optional[bool] = None
