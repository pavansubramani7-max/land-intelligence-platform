import pytest
from app.ml.train_forecast import generate_price_series, forecast_prices


def test_generate_price_series():
    series = generate_price_series(500000, n_periods=24)
    assert len(series) == 24
    assert series.mean() > 0


def test_forecast_prices():
    series = generate_price_series(500000, n_periods=36)
    forecast_df = forecast_prices(series, steps=12)
    assert len(forecast_df) == 12
    assert "forecast" in forecast_df.columns
    assert "lower" in forecast_df.columns
    assert "upper" in forecast_df.columns


def test_forecast_service():
    from app.schemas.prediction import PredictionRequest
    from app.services.forecast_service import run_forecast
    req = PredictionRequest(
        land_id=1, area_sqft=1000, location_score=70, zone_type="residential",
        road_proximity_km=2.0, infrastructure_score=60, market_price=500000,
    )
    result = run_forecast(req)
    assert result.forecast_1yr > 0
    assert result.forecast_3yr > result.forecast_1yr or result.forecast_3yr > 0
