import numpy as np
import pandas as pd
from scipy import stats
from typing import Dict, Tuple


def compute_psi(expected: np.ndarray, actual: np.ndarray, buckets: int = 10) -> float:
    """Population Stability Index."""
    breakpoints = np.percentile(expected, np.linspace(0, 100, buckets + 1))
    breakpoints[0] = -np.inf
    breakpoints[-1] = np.inf

    expected_counts = np.histogram(expected, bins=breakpoints)[0]
    actual_counts = np.histogram(actual, bins=breakpoints)[0]

    expected_pct = expected_counts / len(expected) + 1e-8
    actual_pct = actual_counts / len(actual) + 1e-8

    psi = np.sum((actual_pct - expected_pct) * np.log(actual_pct / expected_pct))
    return float(psi)


def compute_ks_test(reference: np.ndarray, current: np.ndarray) -> Tuple[float, float]:
    stat, p_value = stats.ks_2samp(reference, current)
    return float(stat), float(p_value)


def detect_drift(reference_data: pd.DataFrame, current_data: pd.DataFrame,
                 features: list, psi_threshold: float = 0.2) -> Dict:
    results = {}
    drift_detected = False

    for feature in features:
        if feature not in reference_data.columns or feature not in current_data.columns:
            continue
        ref = reference_data[feature].dropna().values
        cur = current_data[feature].dropna().values

        if len(ref) == 0 or len(cur) == 0:
            continue

        psi = compute_psi(ref, cur)
        ks_stat, ks_p = compute_ks_test(ref, cur)

        feature_drift = psi > psi_threshold or ks_p < 0.05
        if feature_drift:
            drift_detected = True

        results[feature] = {
            "psi": psi,
            "ks_statistic": ks_stat,
            "ks_p_value": ks_p,
            "drift_detected": feature_drift,
        }

    return {"drift_detected": drift_detected, "feature_results": results}
