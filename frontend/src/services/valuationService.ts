import api from "./api";
import { PredictionRequest } from "@/types/land";
import { ValuationResponse } from "@/types/prediction";

export const valuationService = {
  async predict(req: PredictionRequest): Promise<ValuationResponse> {
    const res = await api.post("/valuation/predict", req);
    return res.data;
  },
};
