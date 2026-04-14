"use client";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

interface ForecastChartProps {
  data: Array<{ date: string; value: number; lower?: number; upper?: number }>;
  currentValue?: number;
}

export function ForecastChart({ data, currentValue }: ForecastChartProps) {
  const formatValue = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis tickFormatter={formatValue} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Value"]} />
        <Area type="monotone" dataKey="upper" stroke="none" fill="#dbeafe" fillOpacity={0.5} />
        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#forecastGrad)" />
        <Line type="monotone" dataKey="lower" stroke="#93c5fd" strokeWidth={1} strokeDasharray="4 4" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
