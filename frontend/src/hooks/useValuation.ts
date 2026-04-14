"use client";
import { useState, useCallback } from "react";
import { valuationService } from "@/services/valuationService";
import { PredictionRequest } from "@/types/land";
import { ValuationResponse } from "@/types/prediction";

export function useValuation() {
  const [result, setResult] = useState<ValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (req: PredictionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await valuationService.predict(req);
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Valuation failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, predict };
}
