# Setup Guide

## Prerequisites

- Docker & Docker Compose v2+
- Python 3.10+
- Node.js 20+
- Flutter 3.x (for mobile only)
- PostgreSQL 15 (or use Docker)
- Redis 7 (or use Docker)

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/land-intelligence-platform.git
cd land-intelligence-platform

# 2. Configure environment
cp devops/docker/.env.example devops/docker/.env
# Edit devops/docker/.env — set POSTGRES_PASSWORD, SECRET_KEY, GRAFANA_PASSWORD

# 3. Start all services
cd devops/docker
docker-compose up -d

# 4. Access the platform
# Frontend:   http://localhost:3000
# Backend API: http://localhost:8000
# API Docs:   http://localhost:8000/docs
# Grafana:    http://localhost:3001  (login with GRAFANA_PASSWORD from .env)
# Prometheus: http://localhost:9090
```

---

## Manual Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Generate training data and train ML models
cd ../ml_pipelines/scripts
python generate_synthetic_data.py
python train_all_models.py

# Start the server
cd ../../backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Manual Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev

# Build for production
npm run build && npm start
```

---

## Mobile Setup (Flutter)

```bash
cd mobile

# Get dependencies
flutter pub get

# Run on Android emulator (default)
flutter run

# Run on iOS simulator
flutter run --dart-define=API_BASE_URL=http://127.0.0.1:8000

# Run on physical device (replace with your machine's LAN IP)
flutter run --dart-define=API_BASE_URL=http://192.168.1.x:8000

# Build release APK
flutter build apk --release
```

---

## Training ML Models

```bash
# From the repo root:
python ml_pipelines/scripts/generate_synthetic_data.py
python ml_pipelines/scripts/train_all_models.py
python ml_pipelines/scripts/evaluate_models.py
```

Models are saved to `backend/models/` as `<name>_latest.joblib`.

---

## Running Tests

```bash
cd backend
pytest tests/ -v --cov=app
# Expected: 25 passed
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://landuser:...@localhost:5432/landdb |
| REDIS_URL | Redis connection string | redis://localhost:6379 |
| SECRET_KEY | JWT signing key | **must be set in production** |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiry | 30 |
| MODELS_DIR | ML models directory | models |
| UPLOAD_DIR | File uploads directory | uploads |
| GRAFANA_PASSWORD | Grafana admin password | **must be set** |
| NEXT_PUBLIC_API_URL | Backend URL for browser | http://localhost:8000 |

> ⚠️ Never commit `.env` files. Use `.env.example` as a template.
