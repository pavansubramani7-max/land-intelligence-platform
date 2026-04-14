"""FastAPI AI Engine entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from routers import valuation, dispute, fraud, forecast, explainability, recommendation
from models.valuation_model import ValuationModel
from models.dispute_model import DisputeModel
from models.fraud_model import FraudModel
from models.forecast_model import ForecastModel

# Global model registry
models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load all ML models into memory on startup."""
    print("Loading ML models...")
    models["valuation"] = ValuationModel()
    models["valuation"].load_or_train()

    models["dispute"] = DisputeModel()
    models["dispute"].load_or_train()

    models["fraud"] = FraudModel()
    models["fraud"].load_or_train()

    models["forecast"] = ForecastModel()
    models["forecast"].load_or_train()

    app.state.models = models
    print("All models loaded.")
    yield
    models.clear()


app = FastAPI(
    title="Land Intelligence AI Engine",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(valuation.router, prefix="/api/v1")
app.include_router(dispute.router, prefix="/api/v1")
app.include_router(fraud.router, prefix="/api/v1")
app.include_router(forecast.router, prefix="/api/v1")
app.include_router(explainability.router, prefix="/api/v1")
app.include_router(recommendation.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": list(app.state.models.keys())}
