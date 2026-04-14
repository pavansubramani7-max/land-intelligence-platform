"use client";
import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface AnomalyAlertProps {
  isAnomaly: boolean;
  fraudProbability: number;
  flags: string[];
  anomalyScore: number;
}

export function AnomalyAlert({ isAnomaly, fraudProbability, flags, anomalyScore }: AnomalyAlertProps) {
  if (!isAnomaly && fraudProbability < 0.3) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl"
        style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)" }}>
        <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
        <div>
          <p className="font-semibold text-emerald-400">No Fraud Detected</p>
          <p className="text-sm text-white/40 mt-0.5">Transaction patterns appear normal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-xl"
        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}>
        <AlertTriangle className="text-red-400 flex-shrink-0" size={24} />
        <div>
          <p className="font-semibold text-red-400">
            {isAnomaly ? "Anomaly Detected" : "Elevated Fraud Risk"}
          </p>
          <p className="text-sm text-white/40 mt-0.5">
            Fraud probability: {(fraudProbability * 100).toFixed(1)}% · Score: {anomalyScore.toFixed(4)}
          </p>
        </div>
      </div>
      {flags.map((flag, i) => (
        <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
          style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
          <AlertCircle size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-300">{flag}</p>
        </div>
      ))}
    </div>
  );
}
