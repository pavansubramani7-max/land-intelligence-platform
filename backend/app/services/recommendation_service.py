from typing import Dict, Any
from sqlalchemy.orm import Session

from app.schemas.prediction import PredictionRequest
from app.services.valuation_service import run_valuation
from app.services.dispute_service import run_dispute_prediction
from app.services.fraud_service import run_fraud_detection


def compute_recommendation(valuation_score: float, dispute_score: float,
                             fraud_score: float, growth_rate: float) -> Dict[str, Any]:
    buy_score = 0.0
    buy_score += (1 - dispute_score) * 30
    buy_score += (1 - fraud_score) * 30
    buy_score += min(growth_rate / 20, 1.0) * 25
    buy_score += 15

    if buy_score >= 65:
        recommendation = "BUY"
        color = "green"
        reasoning = "Low risk profile with positive growth indicators"
    elif buy_score >= 40:
        recommendation = "HOLD"
        color = "yellow"
        reasoning = "Moderate risk — monitor before committing"
    else:
        recommendation = "AVOID"
        color = "red"
        reasoning = "High risk factors detected — not recommended"

    return {
        "recommendation": recommendation,
        "score": round(buy_score, 2),
        "color": color,
        "reasoning": reasoning,
        "breakdown": {
            "dispute_risk_contribution": round((1 - dispute_score) * 30, 2),
            "fraud_risk_contribution": round((1 - fraud_score) * 30, 2),
            "growth_contribution": round(min(growth_rate / 20, 1.0) * 25, 2),
        },
    }


def get_recommendation(req: PredictionRequest, db: Session) -> Dict[str, Any]:
    valuation = run_valuation(req, db)
    dispute = run_dispute_prediction(req, db)
    fraud = run_fraud_detection(req, db)

    growth_rate = (valuation.estimated_value - req.market_price) / (req.market_price + 1) * 100

    result = compute_recommendation(
        valuation_score=valuation.confidence_score,
        dispute_score=dispute.dispute_risk_score,
        fraud_score=fraud.fraud_probability,
        growth_rate=growth_rate,
    )
    result["land_id"] = req.land_id
    result["estimated_value"] = valuation.estimated_value
    result["dispute_risk"] = dispute.dispute_risk_label
    result["fraud_detected"] = fraud.is_anomaly
    return result
