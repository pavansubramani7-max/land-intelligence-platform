import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib
import os

NUMERIC_FEATURES = [
    "area_sqft", "location_score", "road_proximity_km",
    "infrastructure_score", "year_established", "market_price",
    "ownership_changes", "litigation_count",
]
CATEGORICAL_FEATURES = ["zone_type", "soil_type"]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

# Extended features used in improved training
EXTENDED_NUMERIC = NUMERIC_FEATURES + [
    "price_per_sqft", "property_age", "combined_score", "log_area", "flood_penalty"
]
EXTENDED_ALL = EXTENDED_NUMERIC + CATEGORICAL_FEATURES


def build_preprocessor() -> ColumnTransformer:
    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])
    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    return ColumnTransformer([
        ("num", numeric_pipeline, NUMERIC_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
    ])


def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    if "year_established" in df.columns:
        df["year_established"] = df["year_established"].fillna(2010)
    if "soil_type" not in df.columns:
        df["soil_type"] = "loam"
    if "zone_type" not in df.columns:
        df["zone_type"] = "residential"
    if "ownership_changes" not in df.columns:
        df["ownership_changes"] = 0
    if "litigation_count" not in df.columns:
        df["litigation_count"] = 0
    if "flood_risk" not in df.columns:
        df["flood_risk"] = False
    # Derived features
    df["price_per_sqft"] = df["market_price"] / (df["area_sqft"] + 1)
    df["property_age"] = 2024 - df["year_established"].fillna(2010)
    df["combined_score"] = (df["location_score"] + df["infrastructure_score"]) / 2
    df["log_area"] = np.log1p(df["area_sqft"])
    df["flood_penalty"] = df["flood_risk"].astype(int) * 0.15
    return df


def save_preprocessor(preprocessor: ColumnTransformer, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(preprocessor, path)


def load_preprocessor(path: str) -> ColumnTransformer:
    return joblib.load(path)
