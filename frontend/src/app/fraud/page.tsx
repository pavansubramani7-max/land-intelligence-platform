"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LandInputForm } from "@/components/valuation/LandInputForm";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { useFraud } from "@/hooks/useFraud";
import { PredictionRequest } from "@/types/land";
import { useState } from "react";
import { Shield, ShieldAlert, AlertCircle, CheckCircle } from "lucide-react";

export default function FraudPage() {
  const { result, isLoading, detect } = useFraud();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (data: PredictionRequest) => {
    try {
      await detect(data);
      setToast({ message: "Fraud analysis complete!", type: "success" });
    } catch {
      setToast({ message: "Analysis failed", type: "error" });
    }
  };

  const fraudPct = result ? Math.round(result.fraud_probability * 100) : 0;
  const isFraud = result?.is_anomaly || (result?.fraud_probability ?? 0) > 0.5;
  const riskColor = isFraud ? "#f87171" : fraudPct > 30 ? "#fbbf24" : "#34d399";

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">🛡️ Fraud Detection</h1>
            <p className="text-white/30 text-sm mt-1">IsolationForest + Random Forest anomaly detection for Bangalore properties</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Property Details">
              <LandInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              {result ? (
                <>
                  {/* Main result */}
                  <div className="rounded-2xl p-6 text-center"
                    style={{
                      background: isFraud ? "rgba(248,113,113,0.08)" : "rgba(52,211,153,0.08)",
                      border: `2px solid ${riskColor}`,
                    }}>
                    {isFraud
                      ? <ShieldAlert size={48} className="mx-auto mb-3" style={{ color: riskColor }} />
                      : <Shield size={48} className="mx-auto mb-3" style={{ color: riskColor }} />}
                    <p className="text-3xl font-black mb-1" style={{ color: riskColor }}>
                      {isFraud ? "⚠️ Fraud Detected" : "✅ No Fraud"}
                    </p>
                    <p className="text-white/40 text-sm mb-4">
                      {isFraud ? "Suspicious transaction patterns found" : "Transaction patterns appear normal"}
                    </p>

                    {/* Probability bar */}
                    <div className="mx-auto max-w-xs">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/40">Fraud Probability</span>
                        <span className="font-black text-lg" style={{ color: riskColor }}>{fraudPct}%</span>
                      </div>
                      <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-3 rounded-full transition-all duration-700"
                          style={{ width: `${fraudPct}%`, background: riskColor }} />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <Card title="Detection Details">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Anomaly Score",      value: result.anomaly_score.toFixed(4) },
                        { label: "Fraud Probability",  value: `${fraudPct}%` },
                        { label: "Anomaly Detected",   value: result.is_anomaly ? "Yes ⚠️" : "No ✅" },
                        { label: "Risk Level",         value: fraudPct > 50 ? "High" : fraudPct > 30 ? "Medium" : "Low" },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-3 rounded-xl text-center"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-bold text-white mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Fraud flags */}
                  {result.fraud_flags.length > 0 && (
                    <Card title="Fraud Indicators">
                      <div className="space-y-2">
                        {result.fraud_flags.map((flag, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                            style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)" }}>
                            <AlertCircle size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-orange-300">{flag}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 rounded-2xl gap-4"
                  style={{ border: "2px dashed rgba(201,168,76,0.15)" }}>
                  <span className="text-5xl">🛡️</span>
                  <p className="text-white/30 text-sm text-center">
                    Select a Bangalore area to detect<br />fraud and transaction anomalies
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
