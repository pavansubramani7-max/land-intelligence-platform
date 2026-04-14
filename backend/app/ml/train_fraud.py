import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from app.ml.model_registry import save_model


FRAUD_FEATURES = [
    "price_change_pct", "days_between_transfers",
    "ownership_count_90days", "price_vs_market_ratio",
]


def generate_fraud_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    if "price_change_pct" not in df.columns:
        df["price_change_pct"] = np.random.normal(0.05, 0.3, len(df))
    if "days_between_transfers" not in df.columns:
        df["days_between_transfers"] = np.random.exponential(365, len(df))
    if "ownership_count_90days" not in df.columns:
        df["ownership_count_90days"] = np.random.poisson(0.3, len(df))
    if "price_vs_market_ratio" not in df.columns:
        df["price_vs_market_ratio"] = np.random.normal(1.0, 0.2, len(df))
    return df


def train_fraud_models(csv_path: str = "ml_pipelines/data/sample_land_data.csv") -> dict:
    df = pd.read_csv(csv_path)
    df = generate_fraud_features(df)

    X = df[FRAUD_FEATURES].fillna(0)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    iso_forest = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
    iso_forest.fit(X_scaled)
    anomaly_scores = iso_forest.decision_function(X_scaled)
    anomaly_labels = iso_forest.predict(X_scaled)

    if "is_fraud" in df.columns:
        y = df["is_fraud"].astype(int).values
    else:
        y = (anomaly_labels == -1).astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    rf_fraud = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42,
                                       class_weight="balanced", n_jobs=-1)
    rf_fraud.fit(X_train, y_train)
    rf_pred = rf_fraud.predict(X_test)

    print("Fraud Detection Report:")
    print(classification_report(y_test, rf_pred))

    save_model(iso_forest, "fraud_isolation_forest", {"features": FRAUD_FEATURES, "contamination": 0.05})
    save_model(rf_fraud, "fraud_rf", {"features": FRAUD_FEATURES})
    save_model(scaler, "fraud_scaler", {"features": FRAUD_FEATURES})

    return {
        "isolation_forest_anomaly_rate": float((anomaly_labels == -1).mean()),
        "rf_report": classification_report(y_test, rf_pred, output_dict=True),
    }


if __name__ == "__main__":
    train_fraud_models()
