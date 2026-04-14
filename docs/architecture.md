# System Architecture

## Overview

The Land Intelligence Platform is a microservices-based system with the following layers:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  Web Browser (Next.js 14)  │  Mobile App (Flutter 3)        │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                   FASTAPI BACKEND (Port 8000)                │
│  Auth │ Land │ Valuation │ Dispute │ Fraud │ Forecast        │
│  Legal │ Geo │ Ownership │ Report │ Admin │ Feedback         │
│  Rate Limiter │ CORS │ Audit Log Middleware                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  PostgreSQL 15        Redis 7           ML Models
  (Port 5432)        (Port 6379)     (joblib + statsmodels)
```

## ML Pipeline Architecture

```
Raw Data (CSV — 1000 Bangalore land records)
     │
     ▼
Feature Engineering
(OneHotEncoder + StandardScaler via ColumnTransformer)
     │
     ├──► RandomForest Regressor  (R² ~0.976)
     ├──► XGBoost Regressor       (R² ~0.970)
     └──► ANN (MLPRegressor)      (R² ~0.989, target-scaled)
              │
              ▼
         Ensemble Average          (R² ~0.993)
              │
              ▼
         SHAP TreeExplainer
              │
              ▼
         Prediction + Feature Attribution
```

## Data Flow

1. User submits land data via frontend form or mobile app
2. Frontend calls FastAPI endpoint with JWT auth
3. FastAPI validates input with Pydantic schemas
4. Service layer runs feature engineering (`prepare_features`)
5. ML models generate predictions (with `FileNotFoundError` fallback to market_price heuristics)
6. SHAP generates feature attributions for tree models
7. Results stored in `prediction_logs` table (PostgreSQL)
8. Response optionally cached in Redis
9. Frontend displays results with charts and SHAP explanation

## Monitoring Stack

- **Prometheus** scrapes `/metrics` from FastAPI backend, `postgres-exporter:9187`, and `redis-exporter:9121`
- **Grafana** visualises metrics on port 3001
- Exporters (`prometheuscommunity/postgres-exporter`, `oliver006/redis_exporter`) run as Docker services

## CI/CD Pipeline

```
Push to main
     │
     ├──► Backend CI  (lint → pytest → docker build → ECR push)
     └──► Frontend CI (lint → next build → docker build → ECR push)
              │ (both must succeed)
              ▼
         Deploy workflow
         (ECS update-service → wait services-stable)
```
