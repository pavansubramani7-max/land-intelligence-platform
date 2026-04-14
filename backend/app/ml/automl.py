from typing import Dict, Any, Optional
import numpy as np
from app.ml.model_registry import load_model
from app.ml.feature_engineering import ALL_FEATURES, NUMERIC_FEATURES, CATEGORICAL_FEATURES
import pandas as pd


def get_automl_best_model(X_train: np.ndarray, y_train: np.ndarray,
                           task: str = "regression") -> Any:
    """Simple AutoML using cross-validated model selection."""
    from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
    from sklearn.model_selection import cross_val_score
    from sklearn.linear_model import Ridge, LogisticRegression

    if task == "regression":
        candidates = [
            ("rf", RandomForestRegressor(n_estimators=100, random_state=42)),
            ("gbm", GradientBoostingRegressor(n_estimators=100, random_state=42)),
            ("ridge", Ridge()),
        ]
        scoring = "neg_mean_absolute_error"
    else:
        candidates = [
            ("rf", RandomForestClassifier(n_estimators=100, random_state=42)),
            ("gbm", GradientBoostingClassifier(n_estimators=100, random_state=42)),
            ("lr", LogisticRegression(max_iter=500)),
        ]
        scoring = "f1_weighted"

    best_score = -np.inf
    best_model = None
    best_name = ""

    for name, model in candidates:
        scores = cross_val_score(model, X_train, y_train, cv=3, scoring=scoring)
        mean_score = scores.mean()
        if mean_score > best_score:
            best_score = mean_score
            best_model = model
            best_name = name

    best_model.fit(X_train, y_train)
    print(f"AutoML selected: {best_name} with score {best_score:.4f}")
    return best_model
