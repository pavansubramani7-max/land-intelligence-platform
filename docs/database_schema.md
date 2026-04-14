# Database Schema

## Tables

### users
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| name | VARCHAR(100) NULL | Full name (null for phone-only users) |
| email | VARCHAR(255) UNIQUE NULL | Email address (null for phone-only users) |
| phone | VARCHAR(20) UNIQUE NULL | Phone number (null for email-only users) |
| hashed_password | VARCHAR(255) | bcrypt hash |
| role | ENUM | admin/analyst/viewer |
| is_active | BOOLEAN | Account status |
| is_verified | BOOLEAN | Email/phone verified |
| otp_code | VARCHAR(6) NULL | OTP for verification |
| otp_expires_at | DATETIME NULL | OTP expiry |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### land_records
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| title | VARCHAR(200) | Property title |
| location | VARCHAR(255) | City/address |
| latitude | FLOAT | GPS latitude |
| longitude | FLOAT | GPS longitude |
| area_sqft | FLOAT | Area in sqft |
| zone_type | ENUM | residential/commercial/agricultural/industrial |
| road_proximity_km | FLOAT | Distance to road |
| infrastructure_score | FLOAT | 0-100 score |
| year_established | INTEGER | Year registered |
| soil_type | VARCHAR(50) | Soil classification |
| flood_risk | BOOLEAN | Flood zone flag |
| market_price | FLOAT | Current price |
| owner_id | INTEGER FK | References users.id |

### ownership_history
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| land_id | INTEGER FK | References land_records.id |
| owner_name | VARCHAR(200) | Owner full name |
| owner_id_number | VARCHAR(100) | ID document number |
| transfer_date | DATE | Transfer date |
| transfer_price | INTEGER | Sale price |
| transfer_type | VARCHAR(50) | sale/gift/inheritance |

### prediction_logs
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| land_id | INTEGER FK | References land_records.id |
| model_version | VARCHAR(50) | Model version used |
| prediction_type | VARCHAR(50) | valuation/dispute/fraud |
| valuation | FLOAT | Predicted value |
| risk_score | FLOAT | Risk probability |
| confidence_score | FLOAT | Model confidence |
| shap_values | JSON | SHAP explanation |
| input_features | JSON | Input data snapshot |

### legal_documents
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| land_id | INTEGER FK | References land_records.id |
| file_name | VARCHAR(255) | Original filename |
| file_path | VARCHAR(500) | Storage path |
| file_type | VARCHAR(50) | MIME type |
| ocr_text | TEXT | Extracted text |
| integrity_score | FLOAT | 0-100 integrity score |
| extracted_entities | TEXT | JSON entities |

### feedbacks
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| prediction_id | INTEGER FK | References prediction_logs.id |
| user_id | INTEGER FK | References users.id |
| user_rating | INTEGER | 1-5 rating |
| comment | TEXT | User comment |
| actual_value | FLOAT | Actual observed value |
