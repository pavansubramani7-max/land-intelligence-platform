import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from app.ml.model_registry import save_model
import warnings
warnings.filterwarnings("ignore")


def generate_price_series(base_price: float, n_periods: int = 60) -> pd.Series:
    np.random.seed(42)
    trend = np.linspace(0, base_price * 0.3, n_periods)
    seasonal = base_price * 0.05 * np.sin(np.linspace(0, 4 * np.pi, n_periods))
    noise = np.random.normal(0, base_price * 0.02, n_periods)
    prices = base_price + trend + seasonal + noise
    dates = pd.date_range(start="2019-01-01", periods=n_periods, freq="MS")
    return pd.Series(prices, index=dates)


def train_arima_model(series: pd.Series) -> ARIMA:
    model = ARIMA(series, order=(2, 1, 2))
    fitted = model.fit()
    return fitted


def forecast_prices(series: pd.Series, steps: int = 36) -> pd.DataFrame:
    fitted = train_arima_model(series)
    forecast = fitted.forecast(steps=steps)
    conf_int = fitted.get_forecast(steps=steps).conf_int()
    result = pd.DataFrame({
        "forecast": forecast.values,
        "lower": conf_int.iloc[:, 0].values,
        "upper": conf_int.iloc[:, 1].values,
    }, index=forecast.index)
    return result


def train_forecast_models(csv_path: str = "ml_pipelines/data/sample_land_data.csv") -> dict:
    df = pd.read_csv(csv_path)
    base_price = df["market_price"].median() if "market_price" in df.columns else 500000

    series = generate_price_series(base_price)
    fitted_model = train_arima_model(series)
    forecast_df = forecast_prices(series, steps=36)

    save_model(fitted_model, "forecast_arima", {
        "base_price": float(base_price),
        "order": [2, 1, 2],
        "n_training_periods": len(series),
    })

    print(f"ARIMA model trained. AIC: {fitted_model.aic:.2f}")
    print(f"12-month forecast: {forecast_df['forecast'].iloc[11]:.2f}")
    print(f"36-month forecast: {forecast_df['forecast'].iloc[35]:.2f}")

    return {
        "aic": float(fitted_model.aic),
        "forecast_12m": float(forecast_df["forecast"].iloc[11]),
        "forecast_36m": float(forecast_df["forecast"].iloc[35]),
    }


if __name__ == "__main__":
    train_forecast_models()
