# ML Models Documentation

## 1. Valuation Model (Ensemble)

### Architecture
- **RandomForestRegressor**: 200 trees, max_depth=15
- **XGBRegressor**: 200 estimators, lr=0.05, max_depth=6
- **ANN (MLPRegressor)**: 3 layers (128→64→32 neurons, ReLU), early stopping, target-scaled
- **Ensemble**: Simple average of all 3 predictions

### Features
- area_sqft, location_score, zone_type, road_proximity_km
- infrastructure_score, year_established, soil_type
- flood_risk, market_price, ownership_changes, litigation_count

### Target
- actual_value (continuous, ₹)

### Expected Metrics (Bangalore synthetic dataset, 1000 records)
| Model | MAE | RMSE | R² |
|-------|-----|------|----|
| RandomForest | ~2.3M | ~6.2M | ~0.976 |
| XGBoost | ~3.1M | ~7.0M | ~0.970 |
| ANN | ~2.8M | ~4.2M | ~0.989 |
| Ensemble | ~2.0M | ~3.4M | ~0.993 |

> Note: MAE is in INR. Prices range from ₹3M–₹468M across Bangalore localities.

---

## 2. Dispute Risk Model

### Architecture
- **RandomForestClassifier**: 200 trees, max_depth=10
- **XGBClassifier**: 200 estimators, lr=0.05

### Features
- ownership_change_count, litigation_count
- survey_conflict, area_mismatch
- document_inconsistency_count, price_volatility

### Target
- dispute_risk: low (0), medium (1), high (2)

### Expected Metrics
- Accuracy: ~97%
- F1 (weighted): ~0.97

---

## 3. Fraud Detection Model

### Architecture
- **IsolationForest**: 200 estimators, contamination=0.05 (unsupervised)
- **RandomForestClassifier**: 200 trees, class_weight=balanced (supervised)

### Features
- price_change_pct, days_between_transfers
- ownership_count_90days, price_vs_market_ratio

### Target
- is_fraud: 0 (clean), 1 (fraud)

### Expected Metrics
- Precision: ~0.80
- Recall: ~0.75
- F1: ~0.77

> Note: The synthetic dataset generates very few fraud cases (~0.1%). For meaningful evaluation, increase the fraud rate in `generate_synthetic_data.py` by lowering the `fraud_score` threshold or raising `contamination` in IsolationForest.

---

## 4. Price Forecast Model (ARIMA)

### Architecture
- **ARIMA(2,1,2)**: Autoregressive Integrated Moving Average
- Trained on 60-month synthetic price series

### Output
- 36-month price forecast with confidence intervals
- Growth rate calculations (1yr, 3yr)

### Expected Metrics
- AIC: varies by property
- Forecast accuracy: ±8% for 12-month horizon

---

## SHAP Explainability

All tree-based models use `shap.TreeExplainer` for feature attribution.
- Positive SHAP values increase predicted value
- Negative SHAP values decrease predicted value
- Top 10 features shown in UI
