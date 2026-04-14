from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import redis.asyncio as aioredis

from app.config import settings
from app.database import engine, Base
from app.middleware.rate_limiter import limiter
from app.middleware.audit_log import AuditLogMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.routers import (
    auth, land, valuation, dispute, fraud,
    forecast, legal, ownership, geo,
    recommendation, report, admin, feedback
)
from app.routers import live_prices, chatbot

redis_client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global redis_client
    Base.metadata.create_all(bind=engine)
    try:
        redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_client.ping()
        app.state.redis = redis_client
    except Exception:
        app.state.redis = None
    yield
    if redis_client:
        await redis_client.close()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuditLogMiddleware)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(land.router, prefix="/land", tags=["Land"])
app.include_router(valuation.router, prefix="/valuation", tags=["Valuation"])
app.include_router(dispute.router, prefix="/dispute", tags=["Dispute"])
app.include_router(fraud.router, prefix="/fraud", tags=["Fraud"])
app.include_router(forecast.router, prefix="/forecast", tags=["Forecast"])
app.include_router(legal.router, prefix="/legal", tags=["Legal"])
app.include_router(ownership.router, prefix="/ownership", tags=["Ownership"])
app.include_router(geo.router, prefix="/geo", tags=["Geo"])
app.include_router(recommendation.router, prefix="/recommend", tags=["Recommendation"])
app.include_router(report.router, prefix="/report", tags=["Report"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
app.include_router(live_prices.router, prefix="/market", tags=["Market"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION, "service": settings.APP_NAME}
