"""Tests for forecast model."""
import pytest
from models.forecast_model import ForecastModel


@pytest.fixture(scope="module")
def model():
    m = ForecastModel()
    m.train()
    return m


def test_forecast_returns_future_prices(model):
    result = model.predict(1_000_000)
    assert result["forecast_1yr"] > 0
    assert result["forecast_3yr"] > 0
    assert result["trend_direction"] in ["upward", "downward", "stable"]


def test_forecast_growth_rate_type(model):
    result = model.predict(500_000)
    assert isinstance(result["growth_rate_1yr_pct"], float)
    assert isinstance(result["growth_rate_3yr_pct"], float)
