"use client";
import { useState, useCallback } from "react";
import { fraudService } from "@/services/fraudService";
import { PredictionRequest } from "@/types/land";
import { FraudResponse } from "@/types/prediction";

export function useFraud() {
  const [result, setResult] = useState<FraudResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async (req: PredictionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fraudService.detect(req);
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Fraud detection failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, detect };
}
