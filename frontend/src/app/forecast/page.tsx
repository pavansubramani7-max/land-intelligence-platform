"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LandInputForm } from "@/components/valuation/LandInputForm";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { useForecast } from "@/hooks/useForecast";
import { PredictionRequest } from "@/types/land";
import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ForecastPage() {
  const { result, isLoading, forecast } = useForecast();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  const handleSubmit = async (data: PredictionRequest) => {
    setCurrentPrice(data.market_price);
    try {
      await forecast(data);
      setToast({ message: "Forecast generated!", type: "success" });
    } catch {
      setToast({ message: "Forecast failed", type: "error" });
    }
  };

  const trendIcon = result?.forecast_series?.length
    ? (result.growth_rate_1yr > 5 ? <TrendingUp size={16} className="text-emerald-400" />
      : result.growth_rate_1yr < -5 ? <TrendingDown size={16} className="text-red-400" />
      : <Minus size={16} className="text-amber-400" />)
    : null;

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">📈 Price Forecast</h1>
            <p className="text-white/30 text-sm mt-1">ARIMA time-series model · 36-month Bangalore property forecast</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Property Details">
              <LandInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              {result ? (
                <>
                  {/* Forecast cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Current Value",  value: fmt(result.current_value),  growth: null },
                      { label: "1-Year Forecast", value: fmt(result.forecast_1yr),  growth: result.growth_rate_1yr },
                      { label: "3-Year Forecast", value: fmt(result.forecast_3yr),  growth: result.growth_rate_3yr },
                    ].map(({ label, value, growth }) => (
                      <div key={label} className="text-center p-4 rounded-2xl"
                        style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(201,168,76,0.15)" }}>
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-lg font-black text-white">{value}</p>
                        {growth !== null && (
                          <p className={`text-xs font-bold mt-1 flex items-center justify-center gap-1 ${growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {growth >= 0 ? "▲" : "▼"} {Math.abs(growth).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <Card title="36-Month Price Forecast">
                    <ForecastChart data={result.forecast_series} currentValue={result.current_value} />
                  </Card>

                  {/* Insight */}
                  <div className="rounded-xl p-4 flex items-start gap-3"
                    style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <span className="text-xl mt-0.5">{trendIcon}</span>
                    <div>
                      <p className="text-sm font-bold text-gold-400">Market Insight</p>
                      <p className="text-xs text-white/50 mt-1">
                        {result.growth_rate_3yr > 15
                          ? "Strong appreciation expected. Bangalore's infrastructure growth is driving demand in this zone."
                          : result.growth_rate_3yr > 5
                          ? "Moderate growth expected. Stable market with consistent demand."
                          : "Flat or declining trend. Consider other areas for better returns."}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 rounded-2xl gap-4"
                  style={{ border: "2px dashed rgba(201,168,76,0.15)" }}>
                  <span className="text-5xl">📈</span>
                  <p className="text-white/30 text-sm text-center">
                    Select a Bangalore area to see<br />36-month price forecast
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
