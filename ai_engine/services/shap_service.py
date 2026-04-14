"""SHAP explanations for tree-based models."""
import shap
import numpy as np
from config import settings


class SHAPService:
    def __init__(self, model, feature_names: list):
        self.explainer = shap.TreeExplainer(model)
        self.feature_names = feature_names

    def explain(self, X: np.ndarray) -> dict:
        """Return top-5 SHAP feature contributions."""
        shap_values = self.explainer.shap_values(X)
        if isinstance(shap_values, list):
            shap_values = shap_values[0]
        vals = shap_values[0] if shap_values.ndim > 1 else shap_values
        pairs = sorted(zip(self.feature_names, vals.tolist()), key=lambda x: abs(x[1]), reverse=True)
        top5 = pairs[:5]
        return {
            "top_features": [{"feature": k, "shap_value": round(v, 4), "direction": "positive" if v > 0 else "negative"} for k, v in top5],
            "confidence_index": round(float(np.abs(vals).sum()), 4),
            "data_completeness_score": 1.0,
        }
