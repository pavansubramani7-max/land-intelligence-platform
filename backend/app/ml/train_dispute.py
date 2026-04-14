import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from xgboost import XGBClassifier
from app.ml.model_registry import save_model


DISPUTE_FEATURES = [
    "ownership_change_count", "litigation_count", "survey_conflict",
    "area_mismatch", "document_inconsistency_count", "price_volatility",
]


def load_dispute_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    if "dispute_risk" not in df.columns:
        raise ValueError("Missing dispute_risk column")
    return df


def train_dispute_models(csv_path: str = "ml_pipelines/data/sample_land_data.csv") -> dict:
    df = load_dispute_data(csv_path)

    for col in DISPUTE_FEATURES:
        if col not in df.columns:
            if col in ("survey_conflict", "area_mismatch"):
                df[col] = np.random.randint(0, 2, len(df))
            elif col == "price_volatility":
                df[col] = np.random.uniform(0, 0.5, len(df))
            elif col == "document_inconsistency_count":
                df[col] = np.random.poisson(0.5, len(df))
            else:
                df[col] = 0

    le = LabelEncoder()
    y = le.fit_transform(df["dispute_risk"].astype(str))
    X = df[DISPUTE_FEATURES].fillna(0)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc = scaler.transform(X_test)

    rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
    rf.fit(X_train_sc, y_train)

    xgb = XGBClassifier(n_estimators=200, max_depth=5, learning_rate=0.05,
                         eval_metric="mlogloss", random_state=42)
    xgb.fit(X_train_sc, y_train)

    rf_pred = rf.predict(X_test_sc)
    xgb_pred = xgb.predict(X_test_sc)

    print("RandomForest Dispute Report:")
    print(classification_report(y_test, rf_pred, target_names=le.classes_))
    print("XGBoost Dispute Report:")
    print(classification_report(y_test, xgb_pred, target_names=le.classes_))

    save_model(rf, "dispute_rf", {"features": DISPUTE_FEATURES, "classes": list(le.classes_)})
    save_model(xgb, "dispute_xgb", {"features": DISPUTE_FEATURES, "classes": list(le.classes_)})
    save_model(scaler, "dispute_scaler", {"features": DISPUTE_FEATURES})
    save_model(le, "dispute_label_encoder", {"classes": list(le.classes_)})

    return {
        "rf_report": classification_report(y_test, rf_pred, output_dict=True),
        "xgb_report": classification_report(y_test, xgb_pred, output_dict=True),
    }


if __name__ == "__main__":
    train_dispute_models()
