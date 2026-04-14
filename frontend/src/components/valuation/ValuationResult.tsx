"use client";
import React from "react";
import { ValuationResponse } from "@/types/prediction";

interface ValuationResultProps {
  result: ValuationResponse;
}

export function ValuationResult({ result }: ValuationResultProps) {
  const confidence = Math.round(result.confidence_score * 100);

  return (
    <div className="space-y-4">
      {/* Main value */}
      <div className="text-center py-6 rounded-2xl"
        style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(232,196,106,0.06))", border: "1px solid rgba(201,168,76,0.25)" }}>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Estimated Value</p>
        <p className="text-4xl font-black gold-text">₹{result.estimated_value.toLocaleString("en-IN")}</p>
        <div className="mt-4 mx-auto w-56">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>Confidence</span>
            <span className="text-gold-400 font-semibold">{confidence}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${confidence}%`, background: "linear-gradient(90deg, #c9a84c, #e8c46a)" }}
            />
          </div>
        </div>
      </div>

      {/* Model breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Random Forest", value: result.rf_prediction },
          { label: "XGBoost", value: result.xgb_prediction },
          { label: "Neural Net", value: result.ann_prediction },
        ].map(({ label, value }) => (
          <div key={label} className="text-center p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-white/80 mt-1">
              ₹{value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/20 text-center">
        Model v{result.model_version} · Prediction #{result.prediction_id}
      </p>
    </div>
  );
}
