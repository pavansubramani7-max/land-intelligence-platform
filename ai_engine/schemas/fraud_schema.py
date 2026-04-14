from pydantic import BaseModel


class FraudInput(BaseModel):
    price_change_pct: float = 0.0
    days_since_last_sale: int = 365
    ownership_changes_30d: int = 0
    price_vs_area_median_ratio: float = 1.0


class FraudOutput(BaseModel):
    is_fraud: bool
    anomaly_score: float
    fraud_probability: float
    fraud_type: str
    confidence: float
