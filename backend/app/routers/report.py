import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.schemas.prediction import PredictionRequest
from app.services.report_service import generate_pdf_report, generate_excel_report
from app.services.valuation_service import run_valuation
from app.services.dispute_service import run_dispute_prediction
from app.services.fraud_service import run_fraud_detection
from app.services.forecast_service import run_forecast
from app.utils.security import get_current_user_id

router = APIRouter()


def gather_report_data(req: PredictionRequest, db: Session) -> Dict[str, Any]:
    valuation = run_valuation(req, db)
    dispute = run_dispute_prediction(req, db)
    fraud = run_fraud_detection(req, db)
    forecast = run_forecast(req)

    from app.services.recommendation_service import compute_recommendation
    growth_rate = (valuation.estimated_value - req.market_price) / (req.market_price + 1) * 100
    rec = compute_recommendation(
        valuation_score=valuation.confidence_score,
        dispute_score=dispute.dispute_risk_score,
        fraud_score=fraud.fraud_probability,
        growth_rate=growth_rate,
    )
    rec["land_id"] = req.land_id
    rec["estimated_value"] = valuation.estimated_value
    rec["dispute_risk"] = dispute.dispute_risk_label
    rec["fraud_detected"] = fraud.is_anomaly

    return {
        "report_id": str(uuid.uuid4())[:8].upper(),
        "land_id": req.land_id,
        "property_address": f"Land ID {req.land_id}",
        "valuation": valuation.model_dump(),
        "dispute": dispute.model_dump(),
        "fraud": fraud.model_dump(),
        "forecast": forecast.model_dump(),
        "recommendation": rec,
    }


@router.post("/pdf")
def download_pdf(req: PredictionRequest, db: Session = Depends(get_db),
                  user_id: int = Depends(get_current_user_id)):
    data = gather_report_data(req, db)
    pdf_bytes = generate_pdf_report(data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{data['report_id']}.pdf"},
    )


@router.post("/excel")
def download_excel(req: PredictionRequest, db: Session = Depends(get_db),
                    user_id: int = Depends(get_current_user_id)):
    data = gather_report_data(req, db)
    excel_bytes = generate_excel_report(data)
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=report_{data['report_id']}.xlsx"},
    )
