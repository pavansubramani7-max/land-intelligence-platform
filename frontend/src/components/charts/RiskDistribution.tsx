"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RiskDistributionProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

export function RiskDistribution({ data }: RiskDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
          paddingAngle={3} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => [`${v}`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
