# API Reference

Base URL: `http://localhost:8000`

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user (email+password) |
| POST | `/auth/login` | Login → JWT tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/otp/verify` | Verify email OTP |
| GET | `/auth/me` | Get current user profile (returns `name?`, `email?`, `phone?`) |
| POST | `/auth/phone/send-otp` | Send SMS OTP to phone number (rate-limited: 5/min) |
| POST | `/auth/phone/verify-otp` | Verify SMS OTP → JWT tokens (rate-limited: 10/min) |

## Land Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/land/` | Create land record |
| GET | `/land/` | List all land records |
| GET | `/land/{id}` | Get specific land record |
| PUT | `/land/{id}` | Update land record |
| DELETE | `/land/{id}` | Delete land record |

## AI/ML Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/valuation/predict` | Run ensemble valuation |
| POST | `/dispute/predict` | Predict dispute risk |
| POST | `/fraud/detect` | Detect fraud/anomaly |
| POST | `/forecast/` | Get 1yr & 3yr forecast |
| POST | `/recommend/` | Get Buy/Hold/Avoid recommendation |

## Legal & Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/legal/upload/{land_id}` | Upload and analyze document |
| GET | `/legal/documents/{land_id}` | List documents for land |

## Geo Intelligence

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/geo/heatmap` | Get heatmap data |
| GET | `/geo/risk-zones` | Get risk zone data |
| GET | `/geo/zone-values` | Get avg values by zone |
| GET | `/geo/proximity/{land_id}` | Get nearby properties |

## Ownership

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ownership/graph/{land_id}` | Get ownership graph |

## Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/report/pdf` | Download PDF report |
| POST | `/report/excel` | Download Excel report |

## Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Platform statistics |
| GET | `/admin/model-performance` | ML model metrics |
| GET | `/admin/users` | List all users |

## Feedback

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedback/` | Submit prediction feedback |
| GET | `/feedback/prediction/{id}` | Get feedback for prediction |

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
