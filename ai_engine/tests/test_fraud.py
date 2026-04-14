"""Tests for fraud detection model."""
import pytest
from models.fraud_model import FraudModel, _generate_fraud_data


@pytest.fixture(scope="module")
def model():
    m = FraudModel()
    m.train(_generate_fraud_data(200))
    return m


def test_fraud_detection_returns_bool(model):
    result = model.predict({
        "price_change_pct": 150.0,
        "days_since_last_sale": 10,
        "ownership_changes_30d": 3,
        "price_vs_area_median_ratio": 3.5,
    })
    assert isinstance(result["is_fraud"], bool)
    assert 0 <= result["fraud_probability"] <= 1


def test_normal_record_not_fraud(model):
    result = model.predict({
        "price_change_pct": 5.0,
        "days_since_last_sale": 730,
        "ownership_changes_30d": 0,
        "price_vs_area_median_ratio": 1.0,
    })
    assert result["fraud_probability"] < 0.8
