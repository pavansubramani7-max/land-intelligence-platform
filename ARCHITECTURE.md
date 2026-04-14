# System Architecture — Land Intelligence Platform

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  React.js Frontend (Port 3000)  │  React Native Mobile App      │
└──────────────────┬──────────────────────────────────────────────┘
                   │ REST API (JWT)
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│              Node.js + Express Backend (Port 5000)               │
│  Auth │ Valuation │ Risk │ Fraud │ Forecast │ Legal │ Ownership  │
│  Geo  │ Report    │ Admin                                        │
└──────────────────┬──────────────────────────────────────────────┘
         ┌─────────┼──────────┐
         ▼         ▼          ▼
     MongoDB    Redis      Python FastAPI AI Engine (Port 8000)
    (Port 27017) (Port 6379)  │
                              ├── Valuation: RF + XGBoost + ANN Ensemble
                              ├── Dispute:   RandomForestClassifier
                              ├── Fraud:     IsolationForest + RF
                              ├── Forecast:  ARIMA
                              └── SHAP:      TreeExplainer
```

## Component Responsibilities

### Frontend (React.js)
- JWT auth with context + localStorage
- 14 pages covering all features
- react-leaflet for geo maps
- recharts for SHAP and forecast charts
- MUI components for UI

### Backend (Node.js + Express)
- REST API with JWT middleware
- RBAC: user / analyst / admin roles
- Proxies AI requests to Python service
- PDF report generation (pdfkit)
- Redis caching for expensive queries
- Multer for legal document uploads
- Winston structured logging

### AI Engine (Python FastAPI)
- Models loaded at startup from disk (or trained on synthetic data)
- Valuation: weighted ensemble (RF 35% + XGB 45% + ANN 20%)
- SHAP explanations via TreeExplainer
- ARIMA price forecasting
- BUY/HOLD/AVOID recommendation logic

### Mobile (React Native + Expo)
- Bottom tab navigation
- GPS location via expo-location
- react-native-maps for geo view
- AsyncStorage for JWT persistence

### DevOps
- Docker Compose for local dev (single command)
- Multi-stage Dockerfiles
- GitHub Actions CI/CD → ECR → ECS
- Kubernetes manifests for production
- Prometheus + Grafana monitoring
- Nginx reverse proxy

## Data Flow: Valuation Request

1. User fills ValuationForm → POST /api/valuation/predict
2. Backend validates JWT + Joi schema
3. Backend upserts LandRecord in MongoDB
4. Backend calls aiService.predictValuation() → POST /api/v1/valuation/predict
5. AI Engine encodes features → runs RF + XGB + ANN → weighted average
6. SHAP TreeExplainer generates feature attributions
7. Recommendation engine returns BUY/HOLD/AVOID
8. Backend saves ValuationResult to MongoDB
9. Response returned to frontend with price + SHAP + recommendation
10. Frontend renders ValuationResult + SHAPChart

## Security
- Passwords: bcrypt (12 rounds)
- Auth: JWT (access 7d + refresh token)
- Rate limiting: 20 req/15min on auth, 100 req/15min on API
- Helmet.js security headers
- CORS restricted to frontend origin
- Input validation: Joi (backend) + Pydantic (AI engine)
- Audit logging on all mutating requests
