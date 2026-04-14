import numpy as np
from typing import List, Dict, Any


def average_ensemble(predictions: List[float]) -> float:
    return float(np.mean(predictions))


def weighted_ensemble(predictions: List[float], weights: List[float]) -> float:
    weights_arr = np.array(weights)
    weights_arr = weights_arr / weights_arr.sum()
    return float(np.dot(predictions, weights_arr))


def stacking_ensemble(base_predictions: np.ndarray, meta_model: Any) -> np.ndarray:
    return meta_model.predict(base_predictions)


def compute_confidence(predictions: List[float]) -> float:
    if len(predictions) < 2:
        return 0.9
    mean = np.mean(predictions)
    std = np.std(predictions)
    cv = std / (abs(mean) + 1e-8)
    confidence = max(0.0, min(1.0, 1.0 - cv))
    return round(float(confidence), 4)


def ensemble_predict(rf_pred: float, xgb_pred: float, ann_pred: float) -> Dict[str, float]:
    preds = [rf_pred, xgb_pred, ann_pred]
    ensemble_val = average_ensemble(preds)
    confidence = compute_confidence(preds)
    return {
        "rf_prediction": rf_pred,
        "xgb_prediction": xgb_pred,
        "ann_prediction": ann_pred,
        "ensemble_value": ensemble_val,
        "confidence_score": confidence,
    }
