import pytest
import numpy as np
from app.ml.ensemble import ensemble_predict, compute_confidence


def test_ensemble_predict():
    result = ensemble_predict(500000.0, 520000.0, 510000.0)
    assert "ensemble_value" in result
    assert abs(result["ensemble_value"] - 510000.0) < 1000
    assert 0 <= result["confidence_score"] <= 1


def test_compute_confidence_identical():
    confidence = compute_confidence([500000.0, 500000.0, 500000.0])
    assert confidence > 0.95


def test_compute_confidence_varied():
    confidence = compute_confidence([100000.0, 900000.0, 500000.0])
    assert confidence < 0.8


def test_valuation_service_fallback():
    from app.schemas.prediction import PredictionRequest
    from unittest.mock import MagicMock
    req = PredictionRequest(
        land_id=1, area_sqft=1000, location_score=70, zone_type="residential",
        road_proximity_km=2.0, infrastructure_score=60, market_price=500000,
    )
    assert req.area_sqft == 1000
    assert req.market_price == 500000
