from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, Dict, List, Any
from datetime import datetime


class PredictionRequest(BaseModel):
    land_id: int
    area_sqft: float
    location_score: float
    zone_type: str
    road_proximity_km: float
    infrastructure_score: float
    year_established: Optional[int] = None
    soil_type: Optional[str] = "loam"
    flood_risk: bool = False
    market_price: float
    ownership_changes: int = 0
    litigation_count: int = 0

    @field_validator("area_sqft")
    @classmethod
    def validate_area(cls, v: float) -> float:
        if not (100 <= v <= 100_000_000):
            raise ValueError("area_sqft must be between 100 and 100,000,000")
        return v

    @field_validator("market_price")
    @classmethod
    def validate_price(cls, v: float) -> float:
        if not (1000 <= v <= 10_000_000_000):
            raise ValueError("market_price must be between 1,000 and 10,000,000,000")
        return v

    @field_validator("location_score", "infrastructure_score")
    @classmethod
    def validate_score(cls, v: float) -> float:
        if not (0 <= v <= 100):
            raise ValueError("Score must be between 0 and 100")
        return v

    @field_validator("road_proximity_km")
    @classmethod
    def validate_proximity(cls, v: float) -> float:
        if v < 0:
            raise ValueError("road_proximity_km must be non-negative")
        return v

    @field_validator("year_established")
    @classmethod
    def validate_year(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not (1800 <= v <= 2100):
            raise ValueError("year_established must be between 1800 and 2100")
        return v

    @field_validator("ownership_changes", "litigation_count")
    @classmethod
    def validate_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Value must be non-negative")
        return v


class ValuationResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    land_id: int
    estimated_value: float
    confidence_score: float
    rf_prediction: float
    xgb_prediction: float
    ann_prediction: float
    shap_values: Dict[str, float]
    feature_contributions: List[Dict[str, Any]]
    model_version: str
    prediction_id: int


class DisputeResponse(BaseModel):
    land_id: int
    dispute_risk_label: str
    dispute_risk_score: float
    risk_factors: List[str]
    prediction_id: int


class FraudResponse(BaseModel):
    land_id: int
    is_anomaly: bool
    anomaly_score: float
    fraud_probability: float
    fraud_flags: List[str]
    prediction_id: int


class ForecastResponse(BaseModel):
    land_id: int
    current_value: float
    forecast_1yr: float
    forecast_3yr: float
    forecast_series: List[Dict[str, Any]]
    growth_rate_1yr: float
    growth_rate_3yr: float


class PredictionResponse(BaseModel):
    prediction_id: int
    land_id: int
    prediction_type: str
    result: Dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}
