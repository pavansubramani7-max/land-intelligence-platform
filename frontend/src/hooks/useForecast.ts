"use client";
import { useState, useCallback } from "react";
import { forecastService } from "@/services/forecastService";
import { PredictionRequest } from "@/types/land";
import { ForecastResponse } from "@/types/prediction";

export function useForecast() {
  const [result, setResult] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forecast = useCallback(async (req: PredictionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await forecastService.forecast(req);
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Forecast failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, forecast };
}
