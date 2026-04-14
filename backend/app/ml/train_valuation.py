import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
from app.ml.feature_engineering import build_preprocessor, prepare_features, ALL_FEATURES, NUMERIC_FEATURES, CATEGORICAL_FEATURES
from app.ml.model_registry import save_model


def load_training_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    required = ["area_sqft", "location_score", "zone_type", "road_proximity_km",
                "market_price", "infrastructure_score", "year_established",
                "soil_type", "flood_risk", "actual_value"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"Missing column: {col}")
    return df


def engineer_extra_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived features that improve model accuracy."""
    df = df.copy()
    # Price per sqft
    df["price_per_sqft"] = df["market_price"] / (df["area_sqft"] + 1)
    # Property age
    df["property_age"] = 2024 - df["year_established"].fillna(2010)
    # Combined score
    df["combined_score"] = (df["location_score"] + df["infrastructure_score"]) / 2
    # Log area (handles skew)
    df["log_area"] = np.log1p(df["area_sqft"])
    # Flood penalty
    df["flood_penalty"] = df["flood_risk"].astype(int) * 0.15
    return df


EXTENDED_NUMERIC = NUMERIC_FEATURES + ["price_per_sqft", "property_age", "combined_score", "log_area", "flood_penalty"]
EXTENDED_ALL = EXTENDED_NUMERIC + CATEGORICAL_FEATURES


def build_extended_preprocessor():
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.impute import SimpleImputer
    from sklearn.preprocessing import OneHotEncoder
    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])
    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    return ColumnTransformer([
        ("num", numeric_pipeline, EXTENDED_NUMERIC),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
    ])


def train_valuation_models(csv_path: str = "ml_pipelines/data/sample_land_data.csv") -> dict:
    df = load_training_data(csv_path)
    df = prepare_features(df)
    df = engineer_extra_features(df)

    if "ownership_changes" not in df.columns:
        df["ownership_changes"] = 0
    if "litigation_count" not in df.columns:
        df["litigation_count"] = 0

    X = df[EXTENDED_ALL]
    y = df["actual_value"].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preprocessor = build_extended_preprocessor()
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)

    # Random Forest — tuned
    rf = RandomForestRegressor(
        n_estimators=300, max_depth=20, min_samples_split=3,
        min_samples_leaf=1, max_features="sqrt",
        random_state=42, n_jobs=-1
    )
    rf.fit(X_train_proc, y_train)
    rf_pred = rf.predict(X_test_proc)

    # XGBoost — tuned
    xgb = XGBRegressor(
        n_estimators=400, max_depth=7, learning_rate=0.03,
        subsample=0.85, colsample_bytree=0.85,
        min_child_weight=3, gamma=0.1,
        reg_alpha=0.1, reg_lambda=1.0,
        random_state=42, verbosity=0
    )
    xgb.fit(X_train_proc, y_train,
            eval_set=[(X_test_proc, y_test)],
            verbose=False)
    xgb_pred = xgb.predict(X_test_proc)

    # ANN — deeper network
    y_scaler = StandardScaler()
    y_train_scaled = y_scaler.fit_transform(y_train.reshape(-1, 1)).ravel()
    ann = MLPRegressor(
        hidden_layer_sizes=(256, 128, 64, 32),
        activation="relu", solver="adam",
        learning_rate_init=0.001, max_iter=800,
        random_state=42, early_stopping=True,
        validation_fraction=0.1, n_iter_no_change=30,
        batch_size=64
    )
    ann.fit(X_train_proc, y_train_scaled)
    ann_pred = y_scaler.inverse_transform(ann.predict(X_test_proc).reshape(-1, 1)).ravel()

    # Weighted ensemble: XGB best, then RF, then ANN
    ensemble_pred = 0.45 * xgb_pred + 0.35 * rf_pred + 0.20 * ann_pred

    metrics = {}
    for name, pred in [("rf", rf_pred), ("xgb", xgb_pred), ("ann", ann_pred), ("ensemble", ensemble_pred)]:
        metrics[name] = {
            "mae": float(mean_absolute_error(y_test, pred)),
            "rmse": float(np.sqrt(mean_squared_error(y_test, pred))),
            "r2": float(r2_score(y_test, pred)),
        }

    # Cross-val score on RF
    cv_scores = cross_val_score(rf, X_train_proc, y_train, cv=5, scoring="r2")
    metrics["rf"]["cv_r2_mean"] = float(cv_scores.mean())
    metrics["rf"]["cv_r2_std"] = float(cv_scores.std())

    feature_names = (
        EXTENDED_NUMERIC +
        list(preprocessor.named_transformers_["cat"]["encoder"].get_feature_names_out(CATEGORICAL_FEATURES))
    )

    save_model(rf, "valuation_rf", {"metrics": metrics["rf"], "features": feature_names})
    save_model(xgb, "valuation_xgb", {"metrics": metrics["xgb"], "features": feature_names})
    save_model(preprocessor, "valuation_preprocessor", {"features": EXTENDED_ALL})
    save_model(ann, "valuation_ann", {"metrics": metrics["ann"]})
    save_model(y_scaler, "valuation_target_scaler", {})

    print("Training complete. Metrics:")
    for model_name, m in metrics.items():
        print(f"  {model_name}: MAE={m['mae']:,.0f}  R2={m['r2']:.4f}")

    return metrics


if __name__ == "__main__":
    train_valuation_models()
