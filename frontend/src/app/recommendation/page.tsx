"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LandInputForm } from "@/components/valuation/LandInputForm";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { PredictionRequest } from "@/types/land";
import { RecommendationResponse } from "@/types/prediction";
import api from "@/services/api";

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const REC_CONFIG = {
  BUY:   { bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.35)",  color: "#34d399", icon: "✅", label: "Strong Buy Signal",   desc: "Low risk, positive growth — ideal investment" },
  HOLD:  { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.35)",  color: "#fbbf24", icon: "⏸️", label: "Hold Position",        desc: "Moderate risk — monitor before committing" },
  AVOID: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.35)", color: "#f87171", icon: "🚫", label: "Avoid Investment",      desc: "High risk factors detected — not recommended" },
};

export default function RecommendationPage() {
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (data: PredictionRequest) => {
    setIsLoading(true);
    try {
      const res = await api.post("/recommend/", data);
      setResult(res.data);
      setToast({ message: "Analysis complete!", type: "success" });
    } catch {
      setToast({ message: "Analysis failed", type: "error" });
    } finally { setIsLoading(false); }
  };

  const cfg = result ? REC_CONFIG[result.recommendation] : null;

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">💡 Investment Recommendation</h1>
            <p className="text-white/30 text-sm mt-1">AI-powered BUY / HOLD / AVOID analysis for Bangalore properties</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Property Details">
              <LandInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              {result && cfg ? (
                <>
                  {/* Main recommendation */}
                  <div className="rounded-2xl p-8 text-center"
                    style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}>
                    <div className="text-5xl mb-3">{cfg.icon}</div>
                    <div className="text-4xl font-black mb-1" style={{ color: cfg.color }}>
                      {result.recommendation}
                    </div>
                    <p className="font-semibold mb-1" style={{ color: cfg.color }}>{cfg.label}</p>
                    <p className="text-white/40 text-sm">{cfg.desc}</p>

                    {/* Score bar */}
                    <div className="mt-5 mx-auto max-w-xs">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/40">Investment Score</span>
                        <span className="font-bold" style={{ color: cfg.color }}>{result.score.toFixed(1)}/100</span>
                      </div>
                      <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-3 rounded-full transition-all duration-700"
                          style={{ width: `${result.score}%`, background: cfg.color }} />
                      </div>
                    </div>
                  </div>

                  {/* Analysis summary */}
                  <Card title="Full Analysis Summary">
                    <div className="space-y-3">
                      {[
                        { label: "Estimated Value",  value: fmt(result.estimated_value), icon: "🏠" },
                        { label: "Dispute Risk",      value: result.dispute_risk.toUpperCase(), icon: "⚖️",
                          color: result.dispute_risk === "low" ? "#34d399" : result.dispute_risk === "medium" ? "#fbbf24" : "#f87171" },
                        { label: "Fraud Detected",   value: result.fraud_detected ? "⚠️ YES" : "✅ NO", icon: "🛡️",
                          color: result.fraud_detected ? "#f87171" : "#34d399" },
                        { label: "Investment Score", value: `${result.score.toFixed(1)} / 100`, icon: "📊" },
                      ].map(({ label, value, icon, color }) => (
                        <div key={label} className="flex justify-between items-center py-2.5 px-1"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <span className="text-sm text-white/50">{icon} {label}</span>
                          <span className="text-sm font-bold" style={{ color: color || "rgba(255,255,255,0.8)" }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    {result.reasoning && (
                      <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
                        <p className="text-xs text-gold-400 font-semibold mb-1">AI Reasoning</p>
                        <p className="text-sm text-white/60">{result.reasoning}</p>
                      </div>
                    )}
                  </Card>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 rounded-2xl gap-4"
                  style={{ border: "2px dashed rgba(201,168,76,0.15)" }}>
                  <span className="text-5xl">💡</span>
                  <p className="text-white/30 text-sm text-center">
                    Select a Bangalore area and run analysis<br />to get BUY / HOLD / AVOID recommendation
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
