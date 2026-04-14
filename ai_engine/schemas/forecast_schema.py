from pydantic import BaseModel, Field
from typing import List, Optional


class ForecastInput(BaseModel):
    current_price: float = Field(..., gt=0)
    months_history: Optional[List[float]] = None


class ForecastOutput(BaseModel):
    forecast_1yr: float
    forecast_3yr: float
    growth_rate_1yr_pct: float
    growth_rate_3yr_pct: float
    trend_direction: str
    monthly_forecast: List[float]
