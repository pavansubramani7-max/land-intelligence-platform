"use client";
import React from "react";

interface InvestmentBadgeProps {
  recommendation: "BUY" | "HOLD" | "AVOID";
  score: number;
  reasoning?: string;
}

const config = {
  BUY: {
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.3)",
    color: "#34d399",
    emoji: "✅",
    label: "Strong Buy Signal",
  },
  HOLD: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.3)",
    color: "#fbbf24",
    emoji: "⏸️",
    label: "Hold Position",
  },
  AVOID: {
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.3)",
    color: "#f87171",
    emoji: "🚫",
    label: "Avoid Investment",
  },
};

export function InvestmentBadge({ recommendation, score, reasoning }: InvestmentBadgeProps) {
  const c = config[recommendation];
  return (
    <div className="rounded-2xl p-6 text-center"
      style={{ background: c.bg, border: `2px solid ${c.border}` }}>
      <div className="text-4xl mb-3">{c.emoji}</div>
      <div className="text-3xl font-black mb-1" style={{ color: c.color }}>{recommendation}</div>
      <div className="text-sm mb-1" style={{ color: c.color }}>{c.label}</div>
      <div className="text-xs text-white/30">Score: {score.toFixed(1)} / 100</div>
      {reasoning && (
        <p className="text-sm text-white/50 mt-3 leading-relaxed">{reasoning}</p>
      )}
    </div>
  );
}
