import os
os.environ["DEBUG"] = "true"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db

# StaticPool ensures all connections share the same in-memory DB
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_register_user():
    response = client.post("/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "role": "viewer",
    })
    assert response.status_code == 201


def test_login_user():
    client.post("/auth/register", json={
        "name": "Login User",
        "email": "login@example.com",
        "password": "password123",
        "role": "viewer",
    })
    response = client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "password123",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_credentials():
    response = client.post("/auth/login", json={
        "email": "wrong@example.com",
        "password": "wrongpass",
    })
    assert response.status_code == 401
