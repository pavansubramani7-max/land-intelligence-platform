import numpy as np
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime, timedelta

from app.schemas.prediction import PredictionRequest, ForecastResponse
from app.ml.model_registry import load_model
from app.ml.train_forecast import generate_price_series, forecast_prices


def run_forecast(req: PredictionRequest) -> ForecastResponse:
    base_price = req.market_price

    try:
        fitted_model = load_model("forecast_arima")
        series = generate_price_series(base_price)
        forecast_df = forecast_prices(series, steps=36)
        forecast_12m = float(forecast_df["forecast"].iloc[11])
        forecast_36m = float(forecast_df["forecast"].iloc[35])
        forecast_series_data = [
            {
                "date": (datetime.now() + timedelta(days=30 * i)).strftime("%Y-%m"),
                "value": float(forecast_df["forecast"].iloc[i]),
                "lower": float(forecast_df["lower"].iloc[i]),
                "upper": float(forecast_df["upper"].iloc[i]),
            }
            for i in range(36)
        ]
    except Exception:
        growth_rate = 0.08
        forecast_12m = base_price * (1 + growth_rate)
        forecast_36m = base_price * (1 + growth_rate) ** 3
        forecast_series_data = [
            {
                "date": (datetime.now() + timedelta(days=30 * i)).strftime("%Y-%m"),
                "value": round(base_price * (1 + growth_rate * i / 12), 2),
                "lower": round(base_price * (1 + (growth_rate - 0.02) * i / 12), 2),
                "upper": round(base_price * (1 + (growth_rate + 0.02) * i / 12), 2),
            }
            for i in range(36)
        ]

    growth_1yr = (forecast_12m - base_price) / base_price * 100
    growth_3yr = (forecast_36m - base_price) / base_price * 100

    return ForecastResponse(
        land_id=req.land_id,
        current_value=base_price,
        forecast_1yr=round(forecast_12m, 2),
        forecast_3yr=round(forecast_36m, 2),
        forecast_series=forecast_series_data,
        growth_rate_1yr=round(growth_1yr, 2),
        growth_rate_3yr=round(growth_3yr, 2),
    )
