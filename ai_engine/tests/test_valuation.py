"""Tests for valuation model."""
import pytest
from models.valuation_model import ValuationModel, generate_synthetic_data


@pytest.fixture(scope="module")
def model():
    m = ValuationModel()
    df = generate_synthetic_data(200)
    m.train(df)
    return m


def test_predict_returns_price(model):
    result = model.predict({
        "area_sqft": 5000, "land_type": "residential", "zone": "A",
        "infrastructure_score": 7, "near_water": True,
        "near_highway": False, "road_access": True, "district": "Mumbai",
    })
    assert result["predicted_price"] > 0
    assert 0 <= result["confidence_score"] <= 1


def test_predict_commercial_higher_than_agricultural(model):
    base = {"area_sqft": 5000, "zone": "B", "infrastructure_score": 5,
            "near_water": False, "near_highway": False, "road_access": True, "district": "Pune"}
    commercial = model.predict({**base, "land_type": "commercial"})
    agricultural = model.predict({**base, "land_type": "agricultural"})
    assert commercial["predicted_price"] > agricultural["predicted_price"]
