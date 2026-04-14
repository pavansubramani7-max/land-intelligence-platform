"use client";
import { useState, useCallback } from "react";
import { geoService } from "@/services/geoService";

export function useGeo() {
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [riskZones, setRiskZones] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHeatmap = useCallback(async (zoneType?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await geoService.getHeatmap(zoneType);
      setHeatmapData(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load heatmap");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRiskZones = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await geoService.getRiskZones();
      setRiskZones(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load risk zones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { heatmapData, riskZones, isLoading, error, loadHeatmap, loadRiskZones };
}
