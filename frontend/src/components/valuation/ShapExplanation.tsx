"use client";
import React from "react";
import { FeatureImportance } from "@/components/charts/FeatureImportance";

interface ShapExplanationProps {
  contributions: Array<{ feature: string; shap_value: number; impact: string }>;
}

export function ShapExplanation({ contributions }: ShapExplanationProps) {
  if (!contributions.length) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Feature Impact (SHAP)</h4>
      <FeatureImportance data={contributions} />
      <p className="text-xs text-gray-400 mt-2">
        Green bars increase value, red bars decrease value
      </p>
    </div>
  );
}
