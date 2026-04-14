from pydantic import BaseModel, Field
from typing import Optional, Dict


class ValuationInput(BaseModel):
    area_sqft: float = Field(..., gt=0, description="Area in square feet")
    land_type: str = Field(..., description="agricultural/residential/commercial/industrial")
    zone: str = Field(..., description="Zone A/B/C/D")
    infrastructure_score: int = Field(..., ge=1, le=10)
    near_water: bool = False
    near_highway: bool = False
    road_access: bool = True
    district: str = "Mumbai"
    location: Optional[Dict[str, float]] = None


class ValuationOutput(BaseModel):
    predicted_price: float
    confidence_score: float
    model_used: str
    shap_values: Optional[Dict[str, float]] = None
    breakdown: Optional[Dict[str, float]] = None
    recommendation: Optional[Dict] = None
