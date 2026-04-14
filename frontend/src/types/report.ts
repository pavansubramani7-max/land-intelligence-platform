export interface ReportRequest {
  land_id: number;
  include_valuation: boolean;
  include_dispute: boolean;
  include_fraud: boolean;
  include_forecast: boolean;
  include_shap: boolean;
  format: "pdf" | "excel";
}
