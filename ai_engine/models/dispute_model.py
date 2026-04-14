"""Dispute risk classifier using RandomForest."""
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

from config import settings

MODEL_FILE = "dispute_model.joblib"
RISK_THRESHOLDS = {"Low": 30, "Medium": 60, "High": 80}


def _generate_dispute_data(n=800):
    rng = np.random.default_rng(7)
    df = pd.DataFrame({
        "ownership_changes_count": rng.integers(0, 15, n),
        "survey_conflict": rng.integers(0, 2, n),
        "litigation_history_count": rng.integers(0, 8, n),
        "boundary_disputes": rng.integers(0, 2, n),
        "multiple_claimants": rng.integers(0, 2, n),
    })
    score = (
        df["ownership_changes_count"] * 5
        + df["survey_conflict"] * 20
        + df["litigation_history_count"] * 8
        + df["boundary_disputes"] * 15
        + df["multiple_claimants"] * 12
    )
    df["label"] = (score > 40).astype(int)
    return df


class DisputeModel:
    def __init__(self):
        self.clf = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self._path = settings.model_dir() / MODEL_FILE

    def _features(self, df):
        return df[settings.DISPUTE_FEATURES].values.astype(float)

    def train(self, df: pd.DataFrame):
        X = self.scaler.fit_transform(self._features(df))
        self.clf.fit(X, df["label"].values)
        joblib.dump({"clf": self.clf, "scaler": self.scaler}, self._path)

    def load_or_train(self):
        if self._path.exists():
            d = joblib.load(self._path)
            self.clf = d["clf"]; self.scaler = d["scaler"]
        else:
            self.train(_generate_dispute_data())

    def predict(self, features: dict) -> dict:
        df = pd.DataFrame([features])
        X = self.scaler.transform(self._features(df))
        proba = self.clf.predict_proba(X)[0][1]
        risk_score = round(proba * 100, 1)

        if risk_score < 30:
            category = "Low"
        elif risk_score < 60:
            category = "Medium"
        elif risk_score < 80:
            category = "High"
        else:
            category = "Critical"

        factors = []
        if features.get("survey_conflict"): factors.append("Survey conflict detected")
        if features.get("litigation_history_count", 0) > 2: factors.append("Multiple litigation records")
        if features.get("ownership_changes_count", 0) > 5: factors.append("Frequent ownership changes")
        if features.get("boundary_disputes"): factors.append("Boundary dispute on record")
        if features.get("multiple_claimants"): factors.append("Multiple claimants exist")

        return {"risk_score": risk_score, "risk_category": category, "factors": factors}
