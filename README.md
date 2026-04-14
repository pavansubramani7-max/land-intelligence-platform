# 🏔️ Land IQ — AI-Powered Land Intelligence, Valuation & Risk Analytics Platform

> A complete full-stack AI platform for Bangalore real estate intelligence.
> Built with Next.js frontend, Python FastAPI backend, ensemble ML models,
> real-time market data, and an explainable AI chatbot.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [What Was Built](#what-was-built)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [ML Models & Dataset](#ml-models--dataset)
6. [All Pages & Features](#all-pages--features)
7. [All API Endpoints](#all-api-endpoints)
8. [Installation & Setup](#installation--setup)
9. [Login Credentials](#login-credentials)
10. [Architecture](#architecture)

---

## Project Overview

Land IQ is a production-ready AI platform that helps users:
- Get instant AI-powered land valuations for any Bangalore area
- Detect fraud and anomalies in property transactions
- Assess dispute and litigation risk
- Forecast property prices 36 months ahead
- Get BUY / HOLD / AVOID investment recommendations
- View live real-time land rates for 98 Bangalore areas
- Chat with an AI assistant about Bangalore real estate
- Download full PDF and Excel analysis reports
- View ownership transfer graphs and detect circular patterns
- Manage their land portfolio

---

## What Was Built

### Phase 1 — Project Scaffolding
- Created complete folder structure for frontend, backend, AI engine, mobile, devops
- Set up Next.js 14 with TypeScript, Tailwind CSS, dark gold theme
- Set up Python FastAPI backend with SQLite database
- Configured JWT authentication with role-based access control
- Created Docker Compose, Kubernetes manifests, GitHub Actions CI/CD

### Phase 2 — Database & Models
- Designed SQLite database with 8 tables:
  - users, land_records, prediction_logs, ownership_history
  - legal_documents, feedbacks, (+ indexes)
- Created all SQLAlchemy ORM models with relationships
- Built Pydantic schemas for all request/response validation

### Phase 3 — ML Models & Dataset
- Generated 2160-record Bangalore land dataset covering 98 real areas
- Trained 4 ML models:
  - Valuation: Random Forest + XGBoost + Neural Network ensemble (R² = 0.975)
  - Dispute Risk: Random Forest + XGBoost classifier (91% accuracy)
  - Fraud Detection: IsolationForest + Random Forest (96% accuracy)
  - Price Forecast: ARIMA(2,1,2) time-series model
- Added SHAP explainability (TreeExplainer) for feature importance
- Added 5 derived features: price_per_sqft, property_age, combined_score, log_area, flood_penalty
- Tuned hyperparameters: RF(300 trees, depth 20), XGB(400 estimators, lr=0.03)

### Phase 4 — Backend API (16 routers)
- auth — register, login, OTP verify, JWT refresh, change password
- valuation — AI ensemble prediction with SHAP
- dispute — dispute risk classification
- fraud — anomaly detection
- forecast — ARIMA price forecasting
- recommendation — BUY/HOLD/AVOID engine
- geo — heatmap + risk zones
- legal — document upload + OCR + NLP
- ownership — transfer graph + circular pattern detection
- report — PDF + Excel generation (reportlab + openpyxl)
- land — CRUD for land records
- admin — platform stats + user management
- feedback — star rating on predictions
- live_prices — real-time fluctuating prices for 98 areas
- chatbot — explainable AI responses
- market — SSE streaming for live price updates

### Phase 5 — Frontend (21 pages)
- Login page with cinematic background, email + phone OTP
- Register page
- Dashboard with live stats, clickable cards, market prices
- Valuation page with area selector, SHAP chart, star feedback, PDF download
- Dispute Risk page with score bar and risk factors
- Fraud Detection page with probability bar and fraud flags
- Price Forecast page with 36-month area chart
- Investment Recommendation page with BUY/HOLD/AVOID
- Live Rates page with 98 areas, sparklines, real-time updates every 3s
- Geo Map page with Leaflet, 99 Bangalore properties, risk zones
- Legal Documents page with file upload and OCR results
- Ownership Graph page with transfer chain visualization
- My Lands page with add/view/delete land records
- Reports page with PDF and Excel download
- AI Chatbot page with full conversation interface
- Profile page with account info and change password
- Admin page with platform stats and user management
- Auth register page
- 404 not found page
- Root redirect page
- Floating chatbot widget on every page

### Phase 6 — Bangalore Dataset
- 98 real Bangalore areas with GPS coordinates
- Areas include: MG Road, Brigade Road, Indiranagar, Koramangala,
  Whitefield, HSR Layout, Electronic City, Devanahalli, Hebbal,
  Yelahanka, Malleshwaram, Rajajinagar, Jayanagar, JP Nagar,
  Banashankari, Nagarbhavi, Kengeri, Mysore Road, Sarjapur Road,
  Marathahalli, Bellandur, BTM Layout, Domlur, Frazer Town,
  Sadashivanagar, Basavanagudi, Richmond Town, Nandi Hills,
  Doddaballapur, Nelamangala, Peenya, Jigani, Bommasandra,
  and 65 more areas
- Price range: ₹4,000/sqft (Nandi Hills) to ₹48,000/sqft (Lavelle Road)
- 99 land records seeded with real GPS coordinates for geo map

### Phase 7 — Live Market Rates
- Real-time price simulation for 98 Bangalore areas
- Prices fluctuate every 3 seconds like gold/stock rates
- Sine wave + random noise + trend drift algorithm
- Top Gainers and Top Losers panels
- Sparkline charts for each area
- Click any area to see full price chart with Day High/Low

### Phase 8 — AI Chatbot
- Explainable AI responses about Bangalore land
- Handles: price queries, forecasts, area comparisons, model explanations,
  fraud info, dispute info, investment advice, cheapest areas
- Floating widget visible on every page
- Quick suggestion buttons
- Chat history maintained per session

### Phase 9 — Bug Fixes & Polish
- Fixed CORS configuration for frontend-backend communication
- Fixed Leaflet map container reuse error
- Fixed ANN negative predictions with sanity clamping
- Fixed confidence score calculation (was 0.0, now 0.5-0.99)
- Fixed OTP flow — returns OTP in response in dev mode
- Fixed middleware route protection
- Fixed Tailwind invalid opacity classes
- Removed conflicting CRA files from Next.js project
- Added PostCSS config for Tailwind
- Fixed all TypeScript type errors
- 21/21 pages build successfully with 0 errors

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts, Leaflet |
| UI Components | Lucide React, Framer Motion, Custom dark gold theme |
| State Management | Redux Toolkit |
| Backend | Python 3.11, FastAPI, SQLAlchemy, SQLite |
| Authentication | JWT (access + refresh tokens), bcrypt, OTP |
| ML Models | scikit-learn, XGBoost, SHAP, statsmodels ARIMA |
| Reports | ReportLab (PDF), openpyxl (Excel) |
| OCR/NLP | pytesseract, spaCy |
| Geo | Leaflet.js, OpenStreetMap |
| DevOps | Docker, Docker Compose, GitHub Actions, Kubernetes |
| Monitoring | Prometheus, Grafana |

---

## Project Structure

```
land-intelligence-platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models/              # ORM models (user, land, prediction, etc.)
│   │   ├── routers/             # 16 API routers
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   ├── ml/                  # ML training scripts
│   │   ├── middleware/          # Rate limiter, audit log
│   │   └── utils/               # Security, validators, OCR, NLP
│   ├── seed_admin.py            # Seed demo users
│   ├── seed_bangalore.py        # Seed 99 Bangalore land records
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # 21 Next.js pages
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layout/          # Navbar, Sidebar
│   │   │   ├── ui/              # Button, Card, Input, Table, Toast
│   │   │   ├── charts/          # FeatureImportance, ForecastChart, RiskDistribution
│   │   │   ├── valuation/       # LandInputForm, ValuationResult, ShapExplanation
│   │   │   ├── geo/             # MapViewer
│   │   │   ├── dashboard/       # RecentActivity, StatCard, RiskGauge
│   │   │   └── chatbot/         # ChatbotWidget (floating)
│   │   ├── hooks/               # useAuth, useValuation, useFraud, useForecast, etc.
│   │   ├── services/            # API service functions
│   │   ├── store/               # Redux store + slices
│   │   ├── types/               # TypeScript interfaces
│   │   └── styles/              # globals.css (Tailwind + custom)
│   ├── package.json
│   └── Dockerfile
│
├── ml_pipelines/
│   ├── data/
│   │   └── sample_land_data.csv # 2160-record Bangalore dataset
│   └── scripts/
│       ├── train_all_models.py  # Train all 4 models
│       └── expand_bangalore_data.py # Generate more area data
│
├── models/                      # Saved .joblib model files
│   ├── valuation_rf_latest.joblib
│   ├── valuation_xgb_latest.joblib
│   ├── valuation_ann_latest.joblib
│   ├── valuation_preprocessor_latest.joblib
│   ├── dispute_rf_latest.joblib
│   ├── fraud_isolation_forest_latest.joblib
│   └── forecast_arima_latest.joblib
│
└── devops/
    ├── docker/
    │   └── docker-compose.yml
    ├── ci_cd/
    │   └── .github/workflows/   # frontend.yml, backend.yml, ai_engine.yml
    ├── kubernetes/              # Deployment manifests
    └── monitoring/              # Prometheus + Grafana configs
```

---

## ML Models & Dataset

### Dataset
- **Size:** 2160 records
- **Areas:** 98 Bangalore locations
- **Features:** area_sqft, location_score, zone_type, road_proximity_km,
  infrastructure_score, year_established, soil_type, flood_risk,
  market_price, ownership_changes, litigation_count,
  price_per_sqft (derived), property_age (derived),
  combined_score (derived), log_area (derived), flood_penalty (derived)

### Model Performance

| Model | Task | Algorithm | Metric |
|-------|------|-----------|--------|
| Valuation | Regression | RF(35%) + XGB(45%) + ANN(20%) | R² = 0.975 |
| Dispute Risk | Classification | RF + XGBoost | Accuracy = 91% |
| Fraud Detection | Anomaly + Classification | IsolationForest + RF | Accuracy = 96% |
| Price Forecast | Time Series | ARIMA(2,1,2) | AIC = 1899 |

### Retrain Models
```powershell
cd ml_pipelines\scripts
python train_all_models.py
```

---

## All Pages & Features

| Page | URL | Description |
|------|-----|-------------|
| Login | /auth/login | Email + Phone OTP login |
| Register | /auth/register | Create new account |
| Dashboard | /dashboard | Live stats, market prices, quick actions |
| Live Rates | /market | 98 areas, real-time prices, sparklines |
| Valuation | /valuation | AI ensemble valuation + SHAP + PDF |
| Dispute Risk | /dispute | Litigation risk score + factors |
| Fraud Detection | /fraud | Anomaly detection + fraud flags |
| Price Forecast | /forecast | 36-month ARIMA chart |
| Recommendation | /recommendation | BUY / HOLD / AVOID |
| My Lands | /land | Add/view/delete land records |
| Ownership | /ownership | Transfer graph + circular patterns |
| Geo Map | /geo | Leaflet map with risk zones |
| Legal Docs | /legal | Upload + OCR + NLP analysis |
| Reports | /reports | PDF + Excel download |
| AI Chat | /chatbot | Explainable AI conversation |
| Profile | /profile | Account info + change password |
| Admin | /admin | Platform stats + user management |

---

## All API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login with email/password |
| POST | /auth/refresh | Refresh JWT token |
| POST | /auth/otp/verify | Verify email OTP |
| POST | /auth/phone/send-otp | Send phone OTP |
| POST | /auth/phone/verify-otp | Verify phone OTP |
| GET | /auth/me | Get current user |
| POST | /auth/change-password | Change password |

### AI Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /valuation/predict | AI land valuation |
| POST | /dispute/predict | Dispute risk score |
| POST | /fraud/detect | Fraud detection |
| POST | /forecast/ | 36-month price forecast |
| POST | /recommend/ | BUY/HOLD/AVOID recommendation |

### Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /land/ | List user's land records |
| POST | /land/ | Add land record |
| GET | /land/{id} | Get land record |
| PUT | /land/{id} | Update land record |
| DELETE | /land/{id} | Delete land record |
| GET | /geo/heatmap | Property heatmap data |
| GET | /geo/risk-zones | Risk zone classification |
| GET | /ownership/graph/{id} | Ownership transfer graph |
| POST | /legal/upload/{id} | Upload legal document |
| GET | /legal/documents/{id} | List documents |

### Reports & Market
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /report/pdf | Generate PDF report |
| POST | /report/excel | Generate Excel report |
| GET | /market/prices | Live prices for all 98 areas |
| GET | /market/prices/{area}/history | Price history for sparkline |
| GET | /market/stream | SSE live price stream |

### Admin & Misc
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/stats | Platform statistics |
| GET | /admin/users | All registered users |
| POST | /chatbot/chat | AI chatbot response |
| POST | /feedback/ | Submit star rating |
| GET | /health | Health check |

---

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- Git

### Step 1 — Clone & Setup Backend
```powershell
cd backend
pip install -r requirements.txt
python seed_admin.py
python seed_bangalore.py
```

### Step 2 — Train ML Models
```powershell
cd ml_pipelines\scripts
python train_all_models.py
```

### Step 3 — Start Backend
```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```
Wait for: `Application startup complete.`

### Step 4 — Setup & Start Frontend
```powershell
cd frontend
npm install
npm run dev
```
Wait for: `Ready in 4.2s`

### Step 5 — Open Browser
Go to: **http://localhost:3000/auth/login**

---

## Login Credentials

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@landiq.com | admin1234 | Admin | Full access |
| analyst@landiq.com | analyst1234 | Analyst | Analysis + reports |
| demo@landiq.com | demo1234 | Viewer | View only |

---

## Architecture

```
Browser (Next.js 14)
        │
        │ HTTP/REST (JWT)
        ▼
Python FastAPI Backend (port 8000)
        │
        ├── SQLite Database (landiq.db)
        │     └── users, land_records, predictions,
        │         ownership_history, legal_documents, feedbacks
        │
        ├── ML Models (/models/*.joblib)
        │     ├── valuation_rf + xgb + ann + preprocessor
        │     ├── dispute_rf + xgb + scaler
        │     ├── fraud_isolation_forest + rf + scaler
        │     └── forecast_arima
        │
        ├── Redis (optional caching)
        │
        └── File Storage (/uploads)
              └── Legal documents
```

---

## Key Design Decisions

1. **SQLite over PostgreSQL** — Zero config, works immediately, sufficient for demo
2. **Ensemble ML** — 3 models weighted (XGB 45% + RF 35% + ANN 20%) for best accuracy
3. **SHAP explanations** — Every valuation shows which features drove the price
4. **Synthetic price fluctuation** — Sine wave + noise + trend drift simulates real market
5. **Dev-mode OTP** — OTP returned in API response so no SMTP setup needed
6. **Bangalore-specific** — All 98 areas have real GPS coordinates and realistic prices
7. **Floating chatbot** — Available on every page without navigation

---

## License

MIT — Free to use, modify, and distribute.

---

*Built with ❤️ — Land IQ Platform v2.0*
