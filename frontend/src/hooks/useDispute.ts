"use client";
import { useState, useCallback } from "react";
import { disputeService } from "@/services/disputeService";
import { PredictionRequest } from "@/types/land";
import { DisputeResponse } from "@/types/prediction";

export function useDispute() {
  const [result, setResult] = useState<DisputeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (req: PredictionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await disputeService.predict(req);
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Dispute prediction failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, predict };
}
