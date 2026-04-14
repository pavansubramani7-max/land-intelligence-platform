import pytest
from app.schemas.prediction import PredictionRequest
from app.services.fraud_service import build_fraud_features, identify_fraud_flags


def make_request(**kwargs):
    defaults = dict(
        land_id=1, area_sqft=1000, location_score=70, zone_type="residential",
        road_proximity_km=2.0, infrastructure_score=60, market_price=500000,
        ownership_changes=1, litigation_count=0,
    )
    defaults.update(kwargs)
    return PredictionRequest(**defaults)


def test_fraud_features_shape():
    req = make_request()
    df = build_fraud_features(req)
    assert df.shape[0] == 1
    assert "price_change_pct" in df.columns


def test_fraud_flags_high_ownership():
    req = make_request(ownership_changes=10)
    flags = identify_fraud_flags(req, -0.2)
    assert any("ownership" in f.lower() for f in flags)


def test_fraud_flags_price_anomaly():
    req = make_request(market_price=10_000_000, area_sqft=100)
    flags = identify_fraud_flags(req, -0.3)
    assert len(flags) > 0
