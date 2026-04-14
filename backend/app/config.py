import os
from pydantic_settings import BaseSettings
from pydantic import ConfigDict, field_validator
from functools import lru_cache


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env")

    APP_NAME: str = "Land Intelligence Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql://landuser:landpass@localhost:5432/landdb"
    REDIS_URL: str = "redis://localhost:6379"

    SECRET_KEY: str = "super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    OTP_EXPIRE_MINUTES: int = 10
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    MODELS_DIR: str = "models"
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8080"]

    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v):
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.strip().lower() in ("1", "true", "yes")
        return False


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
