"""Ensemble valuation model: RandomForest + XGBoost + Keras ANN."""
import numpy as np
import pandas as pd
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from xgboost import XGBRegressor

from config import settings

WEIGHTS = {"rf": 0.35, "xgb": 0.45, "ann": 0.20}
MODEL_FILE = "valuation_ensemble.joblib"


def generate_synthetic_data(n=1000) -> pd.DataFrame:
    """Generate realistic synthetic land valuation data."""
    rng = np.random.default_rng(42)
    land_types = ["agricultural", "residential", "commercial", "industrial"]
    zones = ["A", "B", "C", "D"]
    districts = ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad"]

    df = pd.DataFrame({
        "area_sqft": rng.integers(500, 50000, n),
        "land_type": rng.choice(land_types, n),
        "zone": rng.choice(zones, n),
        "infrastructure_score": rng.integers(1, 10, n),
        "near_water": rng.integers(0, 2, n),
        "near_highway": rng.integers(0, 2, n),
        "road_access": rng.integers(0, 2, n),
        "district": rng.choice(districts, n),
    })

    # Realistic price formula
    base = df["area_sqft"] * rng.uniform(800, 5000, n)
    zone_mult = {"A": 2.0, "B": 1.5, "C": 1.0, "D": 0.7}
    type_mult = {"commercial": 2.5, "industrial": 1.8, "residential": 1.3, "agricultural": 0.6}
    df["price"] = (
        base
        * df["zone"].map(zone_mult)
        * df["land_type"].map(type_mult)
        * (1 + df["infrastructure_score"] * 0.05)
        * (1 + df["near_water"] * 0.1)
        * (1 + df["near_highway"] * 0.08)
    )
    return df


class ValuationModel:
    def __init__(self):
        self.rf = RandomForestRegressor(n_estimators=100, random_state=42)
        self.xgb = XGBRegressor(n_estimators=100, random_state=42, verbosity=0)
        self.scaler = StandardScaler()
        self.le_land_type = LabelEncoder()
        self.le_zone = LabelEncoder()
        self.le_district = LabelEncoder()
        self.ann = None
        self._model_path = settings.model_dir() / MODEL_FILE
        self._trained = False

    def _build_ann(self, input_dim: int):
        from tensorflow import keras
        model = keras.Sequential([
            keras.layers.Dense(128, activation="relu", input_shape=(input_dim,)),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(64, activation="relu"),
            keras.layers.Dense(1),
        ])
        model.compile(optimizer="adam", loss="mse")
        return model

    def _encode(self, df: pd.DataFrame) -> np.ndarray:
        df = df.copy()
        df["land_type_encoded"] = self.le_land_type.transform(df["land_type"])
        df["zone_encoded"] = self.le_zone.transform(df["zone"])
        df["district_encoded"] = self.le_district.transform(df["district"])
        features = settings.VALUATION_FEATURES
        return df[features].values.astype(float)

    def train(self, df: pd.DataFrame):
        self.le_land_type.fit(df["land_type"])
        self.le_zone.fit(df["zone"])
        self.le_district.fit(df["district"])

        X = self._encode(df)
        y = df["price"].values
        X_scaled = self.scaler.fit_transform(X)

        self.rf.fit(X_scaled, y)
        self.xgb.fit(X_scaled, y)

        self.ann = self._build_ann(X_scaled.shape[1])
        self.ann.fit(X_scaled, y, epochs=20, batch_size=32, verbose=0)

        self._trained = True
        joblib.dump({
            "rf": self.rf, "xgb": self.xgb, "scaler": self.scaler,
            "le_land_type": self.le_land_type, "le_zone": self.le_zone,
            "le_district": self.le_district,
        }, self._model_path)
        self.ann.save(str(settings.model_dir() / "valuation_ann.keras"))

    def load_or_train(self):
        if self._model_path.exists():
            data = joblib.load(self._model_path)
            self.rf = data["rf"]; self.xgb = data["xgb"]
            self.scaler = data["scaler"]; self.le_land_type = data["le_land_type"]
            self.le_zone = data["le_zone"]; self.le_district = data["le_district"]
            ann_path = settings.model_dir() / "valuation_ann.keras"
            if ann_path.exists():
                from tensorflow import keras
                self.ann = keras.models.load_model(str(ann_path))
            self._trained = True
        else:
            df = generate_synthetic_data(1000)
            self.train(df)

    def predict(self, features: dict) -> dict:
        df = pd.DataFrame([features])
        for col in ["land_type", "zone", "district"]:
            if col not in df.columns:
                df[col] = "residential" if col == "land_type" else ("A" if col == "zone" else "Mumbai")
        X = self._encode(df)
        X_scaled = self.scaler.transform(X)

        p_rf = self.rf.predict(X_scaled)[0]
        p_xgb = self.xgb.predict(X_scaled)[0]
        p_ann = self.ann.predict(X_scaled, verbose=0)[0][0] if self.ann else p_rf

        ensemble = WEIGHTS["rf"] * p_rf + WEIGHTS["xgb"] * p_xgb + WEIGHTS["ann"] * p_ann
        preds = [p_rf, p_xgb, p_ann]
        confidence = max(0.0, 1.0 - (np.std(preds) / (np.mean(preds) + 1e-9)))

        return {
            "predicted_price": round(float(ensemble), 2),
            "confidence_score": round(float(confidence), 4),
            "model_used": "RF+XGB+ANN Ensemble",
            "breakdown": {"rf": round(float(p_rf), 2), "xgb": round(float(p_xgb), 2), "ann": round(float(p_ann), 2)},
        }
