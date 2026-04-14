import pytest
from app.services.report_service import generate_pdf_report, generate_excel_report


SAMPLE_DATA = {
    "report_id": "TEST001",
    "land_id": 1,
    "property_address": "123 Test Street",
    "valuation": {
        "estimated_value": 750000,
        "confidence_score": 0.87,
        "rf_prediction": 740000,
        "xgb_prediction": 760000,
        "ann_prediction": 750000,
    },
    "dispute": {
        "dispute_risk_label": "low",
        "dispute_risk_score": 0.15,
        "risk_factors": [],
    },
    "fraud": {
        "is_anomaly": False,
        "anomaly_score": 0.05,
        "fraud_probability": 0.08,
        "fraud_flags": [],
    },
    "forecast": {
        "current_value": 750000,
        "forecast_1yr": 810000,
        "forecast_3yr": 945000,
        "growth_rate_1yr": 8.0,
        "growth_rate_3yr": 26.0,
    },
    "recommendation": {
        "recommendation": "BUY",
        "score": 72.5,
        "reasoning": "Low risk with positive growth",
    },
}


def test_generate_pdf():
    pdf_bytes = generate_pdf_report(SAMPLE_DATA)
    assert len(pdf_bytes) > 1000
    assert pdf_bytes[:4] == b"%PDF"


def test_generate_excel():
    excel_bytes = generate_excel_report(SAMPLE_DATA)
    assert len(excel_bytes) > 1000
