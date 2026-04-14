import pytest
from app.schemas.prediction import PredictionRequest


def make_request(**kwargs):
    defaults = dict(
        land_id=1, area_sqft=1000, location_score=70, zone_type="residential",
        road_proximity_km=2.0, infrastructure_score=60, market_price=500000,
        ownership_changes=1, litigation_count=0,
    )
    defaults.update(kwargs)
    return PredictionRequest(**defaults)


def test_dispute_low_risk():
    req = make_request(ownership_changes=0, litigation_count=0)
    from app.services.dispute_service import build_dispute_features
    df = build_dispute_features(req)
    assert df["ownership_change_count"].iloc[0] == 0


def test_dispute_high_risk_factors():
    req = make_request(ownership_changes=10, litigation_count=3)
    from app.services.dispute_service import assess_risk_factors
    factors = assess_risk_factors(req, "high")
    assert len(factors) > 0
    assert any("ownership" in f.lower() for f in factors)
