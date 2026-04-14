"""Investment recommendation engine."""
from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["Recommendation"])


class RecommendInput(BaseModel):
    risk_score: float = 50.0
    forecast_growth_pct: float = 5.0
    confidence_score: float = 0.7
    land_id: str = ""


class RecommendOutput(BaseModel):
    action: str
    confidence: float
    risk_score: float
    opportunity_score: float
    reasons: List[str]


@router.post("/recommendation", response_model=RecommendOutput)
def recommend(payload: RecommendInput, request: Request):
    risk = payload.risk_score
    growth = payload.forecast_growth_pct
    conf = payload.confidence_score

    reasons = []
    opportunity_score = round((growth / 20) * 100, 1)

    if risk < 30 and growth > 10:
        action = "BUY"
        reasons.append("Low dispute risk")
        reasons.append(f"Strong forecast growth of {growth:.1f}%")
    elif risk < 50:
        action = "HOLD"
        reasons.append("Moderate risk level")
        reasons.append("Monitor market trends before investing")
    else:
        action = "AVOID"
        reasons.append(f"High risk score: {risk:.0f}")
        reasons.append("Significant dispute or fraud indicators present")

    if conf < 0.5:
        reasons.append("Low model confidence — gather more data")

    return RecommendOutput(
        action=action,
        confidence=round(conf, 4),
        risk_score=risk,
        opportunity_score=min(opportunity_score, 100.0),
        reasons=reasons,
    )
