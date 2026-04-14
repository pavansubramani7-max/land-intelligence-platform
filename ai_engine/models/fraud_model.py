"""Fraud detection using IsolationForest + supervised RF."""
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler

from config import settings

MODEL_FILE = "fraud_model.joblib"


def _generate_fraud_data(n=800):
    rng = np.random.default_rng(13)
    df = pd.DataFrame({
        "price_change_pct": rng.uniform(-10, 200, n),
        "days_since_last_sale": rng.integers(1, 3650, n),
        "ownership_changes_30d": rng.integers(0, 5, n),
        "price_vs_area_median_ratio": rng.uniform(0.3, 4.0, n),
    })
    df["is_fraud"] = (
        (df["price_change_pct"] > 100)
        | (df["days_since_last_sale"] < 30)
        | (df["ownership_changes_30d"] > 2)
        | (df["price_vs_area_median_ratio"] > 3.0)
    ).astype(int)
    return df


class FraudModel:
    def __init__(self):
        self.iso = IsolationForest(contamination=0.1, random_state=42)
        self.clf = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self._path = settings.model_dir() / MODEL_FILE

    def _features(self, df):
        return df[settings.FRAUD_FEATURES].values.astype(float)

    def train(self, df: pd.DataFrame):
        X = self.scaler.fit_transform(self._features(df))
        self.iso.fit(X)
        self.clf.fit(X, df["is_fraud"].values)
        joblib.dump({"iso": self.iso, "clf": self.clf, "scaler": self.scaler}, self._path)

    def load_or_train(self):
        if self._path.exists():
            d = joblib.load(self._path)
            self.iso = d["iso"]; self.clf = d["clf"]; self.scaler = d["scaler"]
        else:
            self.train(_generate_fraud_data())

    def predict(self, features: dict) -> dict:
        df = pd.DataFrame([features])
        X = self.scaler.transform(self._features(df))

        iso_score = self.iso.decision_function(X)[0]
        iso_flag = self.iso.predict(X)[0] == -1
        clf_proba = self.clf.predict_proba(X)[0][1]
        is_fraud = bool(iso_flag or clf_proba > 0.5)

        fraud_type = "none"
        if features.get("price_change_pct", 0) > 100:
            fraud_type = "price_spike"
        elif features.get("days_since_last_sale", 9999) < 30:
            fraud_type = "rapid_resale"
        elif features.get("ownership_changes_30d", 0) > 2:
            fraud_type = "ownership_anomaly"

        return {
            "is_fraud": is_fraud,
            "anomaly_score": round(float(-iso_score), 4),
            "fraud_probability": round(float(clf_proba), 4),
            "fraud_type": fraud_type,
            "confidence": round(float(clf_proba if is_fraud else 1 - clf_proba), 4),
        }
