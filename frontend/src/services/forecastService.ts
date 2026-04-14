import api from "./api";
import { PredictionRequest } from "@/types/land";
import { ForecastResponse } from "@/types/prediction";

export const forecastService = {
  async forecast(req: PredictionRequest): Promise<ForecastResponse> {
    const res = await api.post("/forecast/", req);
    return res.data;
  },
};
