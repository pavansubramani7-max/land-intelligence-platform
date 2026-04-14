import api from "./api";
import { PredictionRequest } from "@/types/land";
import { DisputeResponse } from "@/types/prediction";

export const disputeService = {
  async predict(req: PredictionRequest): Promise<DisputeResponse> {
    const res = await api.post("/dispute/predict", req);
    return res.data;
  },
};
