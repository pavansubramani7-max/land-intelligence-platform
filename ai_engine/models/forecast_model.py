"""Price forecast model using ARIMA."""
import numpy as np
import joblib
from statsmodels.tsa.arima.model import ARIMA

from config import settings

MODEL_FILE = "forecast_model.joblib"


def _generate_price_series(n=60):
    """Generate synthetic monthly price series."""
    rng = np.random.default_rng(99)
    trend = np.linspace(1_000_000, 1_800_000, n)
    noise = rng.normal(0, 30_000, n)
    return trend + noise


class ForecastModel:
    def __init__(self):
        self._arima_params = (2, 1, 2)
        self._base_series = None
        self._path = settings.model_dir() / MODEL_FILE

    def train(self, series: np.ndarray = None):
        if series is None:
            series = _generate_price_series()
        self._base_series = series
        joblib.dump({"base_series": self._base_series}, self._path)

    def load_or_train(self):
        if self._path.exists():
            d = joblib.load(self._path)
            self._base_series = d["base_series"]
        else:
            self.train()

    def predict(self, current_price: float, months_history: list = None) -> dict:
        series = np.array(months_history) if months_history else self._base_series.copy()
        # Scale series to current price
        if series[-1] != 0:
            series = series * (current_price / series[-1])

        try:
            model = ARIMA(series, order=self._arima_params)
            fit = model.fit()
            forecast_36 = fit.forecast(steps=36)
            forecast_12 = forecast_36[:12]

            f1yr = float(np.mean(forecast_12[-3:]))
            f3yr = float(np.mean(forecast_36[-3:]))
            growth_1yr = round((f1yr - current_price) / current_price * 100, 2)
            growth_3yr = round((f3yr - current_price) / current_price * 100, 2)
            trend = "upward" if growth_3yr > 5 else ("downward" if growth_3yr < -5 else "stable")

            return {
                "forecast_1yr": round(f1yr, 2),
                "forecast_3yr": round(f3yr, 2),
                "growth_rate_1yr_pct": growth_1yr,
                "growth_rate_3yr_pct": growth_3yr,
                "trend_direction": trend,
                "monthly_forecast": [round(float(v), 2) for v in forecast_36],
            }
        except Exception as e:
            growth = 0.08
            return {
                "forecast_1yr": round(current_price * (1 + growth), 2),
                "forecast_3yr": round(current_price * (1 + growth * 3), 2),
                "growth_rate_1yr_pct": round(growth * 100, 2),
                "growth_rate_3yr_pct": round(growth * 3 * 100, 2),
                "trend_direction": "stable",
                "monthly_forecast": [],
            }
