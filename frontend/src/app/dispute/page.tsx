"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LandInputForm } from "@/components/valuation/LandInputForm";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { useDispute } from "@/hooks/useDispute";
import { PredictionRequest } from "@/types/land";
import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const RISK_CONFIG: Record<string, { color: string; bg: string; border: string; icon: any; label: string }> = {
  low:      { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.3)",  icon: CheckCircle,   label: "Low Risk" },
  medium:   { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.3)",  icon: AlertCircle,   label: "Medium Risk" },
  high:     { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)", icon: AlertTriangle, label: "High Risk" },
  critical: { color: "#c084fc", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.3)", icon: XCircle,       label: "Critical Risk" },
};

export default function DisputePage() {
  const { result, isLoading, predict } = useDispute();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (data: PredictionRequest) => {
    try {
      await predict(data);
      setToast({ message: "Risk assessment complete!", type: "success" });
    } catch {
      setToast({ message: "Assessment failed", type: "error" });
    }
  };

  const cfg = result ? (RISK_CONFIG[result.dispute_risk_label] || RISK_CONFIG.medium) : null;
  // Score comes as 0-1 probability, convert to 0-100
  const scorePercent = result ? Math.round(result.dispute_risk_score * 100) : 0;

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">⚖️ Dispute Risk Assessment</h1>
            <p className="text-white/30 text-sm mt-1">AI-powered legal dispute probability for Bangalore properties</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Property Details">
              <LandInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              {result && cfg ? (
                <>
                  {/* Risk badge */}
                  <div className="rounded-2xl p-6 text-center"
                    style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}>
                    <cfg.icon size={40} className="mx-auto mb-3" style={{ color: cfg.color }} />
                    <p className="text-3xl font-black mb-1" style={{ color: cfg.color }}>
                      {cfg.label}
                    </p>
                    <p className="text-white/40 text-sm mb-4">Dispute Probability Score</p>

                    {/* Score bar */}
                    <div className="mx-auto max-w-xs">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/40">Risk Level</span>
                        <span className="font-black text-lg" style={{ color: cfg.color }}>{scorePercent}%</span>
                      </div>
                      <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-3 rounded-full transition-all duration-700"
                          style={{ width: `${scorePercent}%`, background: cfg.color }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-white/20 mt-1">
                        <span>Safe</span><span>Moderate</span><span>Risky</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk factors */}
                  <Card title="Risk Factors Detected">
                    {result.risk_factors.length > 0 ? (
                      <div className="space-y-2">
                        {result.risk_factors.map((f, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                            style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
                            <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-300">{f}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 rounded-xl"
                        style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                        <CheckCircle size={14} className="text-emerald-400" />
                        <p className="text-sm text-emerald-300">No significant risk factors detected</p>
                      </div>
                    )}
                  </Card>

                  {/* What this means */}
                  <div className="rounded-xl p-4"
                    style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
                    <p className="text-xs font-bold text-gold-400 mb-2">📋 What this means</p>
                    <p className="text-xs text-white/50">
                      {result.dispute_risk_label === "low"
                        ? "This property has a clean legal history. Low probability of ownership disputes or litigation."
                        : result.dispute_risk_label === "medium"
                        ? "Some risk indicators present. Recommend legal due diligence before purchase."
                        : "High dispute risk detected. Multiple ownership changes or litigation history found. Consult a lawyer."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 rounded-2xl gap-4"
                  style={{ border: "2px dashed rgba(201,168,76,0.15)" }}>
                  <span className="text-5xl">⚖️</span>
                  <p className="text-white/30 text-sm text-center">
                    Select a Bangalore area to assess<br />dispute and litigation risk
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
