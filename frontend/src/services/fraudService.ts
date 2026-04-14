import api from "./api";
import { PredictionRequest } from "@/types/land";
import { FraudResponse } from "@/types/prediction";

export const fraudService = {
  async detect(req: PredictionRequest): Promise<FraudResponse> {
    const res = await api.post("/fraud/detect", req);
    return res.data;
  },
};
