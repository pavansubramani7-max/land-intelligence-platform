"use client";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: "blue" | "green" | "red" | "yellow";
}

const colorMap = {
  blue:   { accent: "#38bdf8", bg: "rgba(56,189,248,0.1)",   border: "rgba(56,189,248,0.2)" },
  green:  { accent: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.2)" },
  red:    { accent: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.2)" },
  yellow: { accent: "#c9a84c", bg: "rgba(201,168,76,0.1)",   border: "rgba(201,168,76,0.2)" },
};

export function StatCard({ title, value, subtitle, icon, trend, color = "blue" }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="rounded-2xl p-5 transition-all hover:scale-[1.02]"
      style={{ background: "rgba(17,17,24,0.8)", border: `1px solid ${c.border}` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-white/30 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-1 font-semibold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: c.bg, color: c.accent }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
