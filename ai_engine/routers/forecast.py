from fastapi import APIRouter, Request, HTTPException
from schemas.forecast_schema import ForecastInput, ForecastOutput

router = APIRouter(tags=["Forecast"])


@router.post("/forecast/predict", response_model=ForecastOutput)
def predict_forecast(payload: ForecastInput, request: Request):
    model = request.app.state.models.get("forecast")
    if not model:
        raise HTTPException(503, "Forecast model not loaded")
    return model.predict(payload.current_price, payload.months_history)
