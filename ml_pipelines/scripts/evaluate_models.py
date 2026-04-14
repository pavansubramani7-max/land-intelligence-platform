import sys
import os
import json
import numpy as np
import pandas as pd
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, classification_report
from app.ml.model_registry import load_model, list_models
from app.ml.feature_engineering import ALL_FEATURES, prepare_features

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_land_data.csv')


def evaluate_valuation(df: pd.DataFrame):
    print("\n--- Valuation Model Evaluation ---")
    try:
        preprocessor = load_model("valuation_preprocessor")
        rf = load_model("valuation_rf")
        xgb = load_model("valuation_xgb")

        if "ownership_changes" not in df.columns:
            df["ownership_changes"] = 0
        if "litigation_count" not in df.columns:
            df["litigation_count"] = 0
        if "location_score" not in df.columns:
            df["location_score"] = df["infrastructure_score"]

        df = prepare_features(df)
        X = preprocessor.transform(df[ALL_FEATURES])
        y = df["actual_value"].values

        for name, model in [("RandomForest", rf), ("XGBoost", xgb)]:
            pred = model.predict(X)
            print(f"  {name}: MAE={mean_absolute_error(y, pred):,.0f}, "
                  f"RMSE={np.sqrt(mean_squared_error(y, pred)):,.0f}, "
                  f"R²={r2_score(y, pred):.4f}")
    except FileNotFoundError:
        print("  Models not found. Run train_all_models.py first.")


def evaluate_dispute(df: pd.DataFrame):
    print("\n--- Dispute Risk Model Evaluation ---")
    try:
        from app.ml.train_dispute import DISPUTE_FEATURES
        scaler = load_model("dispute_scaler")
        rf = load_model("dispute_rf")
        le = load_model("dispute_label_encoder")

        for col in DISPUTE_FEATURES:
            if col not in df.columns:
                df[col] = 0

        X = scaler.transform(df[DISPUTE_FEATURES].fillna(0))
        y = le.transform(df["dispute_risk"].astype(str))
        pred = rf.predict(X)
        print(classification_report(y, pred, target_names=le.classes_))
    except FileNotFoundError:
        print("  Models not found. Run train_all_models.py first.")


def evaluate_fraud(df: pd.DataFrame):
    print("\n--- Fraud Detection Model Evaluation ---")
    try:
        from app.ml.train_fraud import FRAUD_FEATURES
        scaler = load_model("fraud_scaler")
        rf = load_model("fraud_rf")

        for col in FRAUD_FEATURES:
            if col not in df.columns:
                df[col] = 0

        X = scaler.transform(df[FRAUD_FEATURES].fillna(0))
        y = df["is_fraud"].astype(int).values
        pred = rf.predict(X)
        print(classification_report(y, pred, target_names=["Clean", "Fraud"]))
    except FileNotFoundError:
        print("  Models not found. Run train_all_models.py first.")


def main():
    print("=" * 60)
    print("MODEL EVALUATION REPORT")
    print("=" * 60)

    if not os.path.exists(DATA_PATH):
        print("Data file not found.")
        return

    df = pd.read_csv(DATA_PATH)
    print(f"Dataset: {len(df)} records")

    evaluate_valuation(df.copy())
    evaluate_dispute(df.copy())
    evaluate_fraud(df.copy())

    print("\n--- Registered Models ---")
    models = list_models()
    for name, meta in models.items():
        print(f"  {name}: version={meta.get('version', 'N/A')}")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
