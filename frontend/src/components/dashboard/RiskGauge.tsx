"use client";
import React from "react";

interface RiskGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export function RiskGauge({ score, label, size = 120 }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 180 - 90;
  const color = clamped < 33 ? "#34d399" : clamped < 66 ? "#fbbf24" : "#f87171";
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  const polar = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const start = polar(-90);
  const end = polar(90);
  const needle = polar(angle);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 24}>
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${needle.x} ${needle.y}`}
          fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={needle.x} y2={needle.y}
          stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.8)" />
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>
          {clamped.toFixed(0)}
        </text>
      </svg>
      {label && <p className="text-xs text-white/30 mt-1">{label}</p>}
    </div>
  );
}
