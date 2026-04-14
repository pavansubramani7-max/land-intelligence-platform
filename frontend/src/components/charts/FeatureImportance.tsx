"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface FeatureImportanceProps {
  data: Array<{ feature: string; shap_value: number; impact: string }>;
}

export function FeatureImportance({ data }: FeatureImportanceProps) {
  const sorted = [...data].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value)).slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 80, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} tickLine={false} width={80} />
        <Tooltip formatter={(v: number) => [v.toFixed(4), "SHAP Value"]} />
        <Bar dataKey="shap_value" radius={[0, 4, 4, 0]}>
          {sorted.map((entry, i) => (
            <Cell key={i} fill={entry.impact === "positive" ? "#22c55e" : "#ef4444"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
