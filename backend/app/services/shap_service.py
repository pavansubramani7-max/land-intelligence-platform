import numpy as np
from typing import Dict, Any, List
from app.ml.model_registry import load_model


def get_shap_explanation(model_name: str, X_processed: np.ndarray,
                          feature_names: List[str]) -> Dict[str, Any]:
    try:
        import shap
        model = load_model(model_name)
        explainer = shap.TreeExplainer(model)
        shap_vals = explainer.shap_values(X_processed)
        if isinstance(shap_vals, list):
            shap_vals = shap_vals[0]
        if shap_vals.ndim > 1:
            row_shap = shap_vals[0]
        else:
            row_shap = shap_vals

        shap_dict = {name: float(val) for name, val in zip(feature_names, row_shap)}
        contributions = sorted(
            [{"feature": k, "shap_value": v, "impact": "positive" if v > 0 else "negative"}
             for k, v in shap_dict.items()],
            key=lambda x: abs(x["shap_value"]),
            reverse=True,
        )[:10]

        return {"shap_values": shap_dict, "feature_contributions": contributions}
    except Exception:
        return {
            "shap_values": {name: 0.0 for name in feature_names},
            "feature_contributions": [],
        }
