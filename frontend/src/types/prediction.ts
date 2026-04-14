export interface ValuationResponse {
  land_id: number;
  estimated_value: number;
  confidence_score: number;
  rf_prediction: number;
  xgb_prediction: number;
  ann_prediction: number;
  shap_values: Record<string, number>;
  feature_contributions: Array<{ feature: string; shap_value: number; impact: string }>;
  model_version: string;
  prediction_id: number;
}

export interface DisputeResponse {
  land_id: number;
  dispute_risk_label: string;
  dispute_risk_score: number;
  risk_factors: string[];
  prediction_id: number;
}

export interface FraudResponse {
  land_id: number;
  is_anomaly: boolean;
  anomaly_score: number;
  fraud_probability: number;
  fraud_flags: string[];
  prediction_id: number;
}

export interface ForecastResponse {
  land_id: number;
  current_value: number;
  forecast_1yr: number;
  forecast_3yr: number;
  forecast_series: Array<{ date: string; value: number; lower: number; upper: number }>;
  growth_rate_1yr: number;
  growth_rate_3yr: number;
}

export interface RecommendationResponse {
  land_id: number;
  recommendation: "BUY" | "HOLD" | "AVOID";
  score: number;
  color: string;
  reasoning: string;
  estimated_value: number;
  dispute_risk: string;
  fraud_detected: boolean;
}
