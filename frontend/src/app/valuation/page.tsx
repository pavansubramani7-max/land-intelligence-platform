"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LandInputForm } from "@/components/valuation/LandInputForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useValuation } from "@/hooks/useValuation";
import { PredictionRequest } from "@/types/land";
import { reportService } from "@/services/reportService";
import { FeatureImportance } from "@/components/charts/FeatureImportance";
import { Download } from "lucide-react";
import api from "@/services/api";

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ValuationPage() {
  const { result, isLoading, error, predict } = useValuation();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [lastReq, setLastReq] = useState<PredictionRequest | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const submitFeedback = async (rating: number, predId: number) => {
    setFeedback(rating);
    try {
      await api.post("/feedback/", { prediction_id: predId, user_rating: rating });
      setFeedbackSent(true);
    } catch {}
  };

  const handleSubmit = async (data: PredictionRequest) => {
    setLastReq(data);
    setFeedback(null);
    setFeedbackSent(false);
    try {
      await predict(data);
      setToast({ message: "Valuation completed!", type: "success" });
    } catch {
      setToast({ message: error || "Valuation failed", type: "error" });
    }
  };

  const handleDownload = async () => {
    if (!lastReq) return;
    setDownloading(true);
    try {
      const blob = await reportService.downloadPdf(lastReq);
      reportService.triggerDownload(blob, `valuation_${lastReq.land_id}.pdf`);
      setToast({ message: "PDF downloaded!", type: "success" });
    } catch {
      setToast({ message: "Download failed", type: "error" });
    } finally { setDownloading(false); }
  };

  const confidence = result ? Math.round(result.confidence_score * 100) : 0;
  const confColor = confidence >= 80 ? "#34d399" : confidence >= 60 ? "#fbbf24" : "#f87171";

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">🏠 AI Land Valuation</h1>
            <p className="text-white/30 text-sm mt-1">Ensemble model: Random Forest + XGBoost + Neural Network · R² = 0.975</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Property Details">
              <LandInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>

            <div className="space-y-4">
              {result ? (
                <>
                  {/* Main value */}
                  <div className="rounded-2xl p-6 text-center"
                    style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,196,106,0.05))", border: "1px solid rgba(201,168,76,0.3)" }}>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Estimated Market Value</p>
                    <p className="text-5xl font-black gold-text mb-1">{fmt(result.estimated_value)}</p>
                    <p className="text-white/40 text-sm">per sqft: {lastReq ? fmt(result.estimated_value / lastReq.area_sqft) : "—"}</p>
                    <div className="mt-4 mx-auto max-w-xs">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/40">Model Confidence</span>
                        <span className="font-bold" style={{ color: confColor }}>{confidence}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-2 rounded-full transition-all duration-700"
                          style={{ width: `${confidence}%`, background: confColor }} />
                      </div>
                    </div>
                  </div>

                  {/* Model breakdown */}
                  <Card title="Model Breakdown">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Random Forest", value: result.rf_prediction,  weight: "35%" },
                        { label: "XGBoost",       value: result.xgb_prediction, weight: "45%" },
                        { label: "Neural Net",    value: result.ann_prediction,  weight: "20%" },
                      ].map(({ label, value, weight }) => (
                        <div key={label} className="text-center p-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-black text-white mt-1">{fmt(value)}</p>
                          <p className="text-[10px] text-gold-500 mt-0.5">weight {weight}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* SHAP */}
                  {result.feature_contributions.length > 0 && (
                    <Card title="AI Explanation — What drives this value?">
                      <FeatureImportance data={result.feature_contributions} />
                      <p className="text-xs text-white/30 mt-2">Green = increases value · Red = decreases value</p>
                    </Card>
                  )}

                  {/* Star feedback */}
                  {!feedbackSent ? (
                    <div className="rounded-xl p-4 text-center"
                      style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
                      <p className="text-xs text-white/40 mb-3">Was this valuation accurate?</p>
                      <div className="flex justify-center gap-2">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => submitFeedback(star, result.prediction_id)}
                            className="text-2xl transition-transform hover:scale-125">
                            {feedback && star <= feedback ? "⭐" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl p-3 text-center"
                      style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                      <p className="text-sm text-emerald-400">✅ Thanks for your feedback!</p>
                    </div>
                  )}

                  {/* Download */}
                  <Button onClick={handleDownload} isLoading={downloading} variant="secondary" className="w-full">
                    <Download size={16} className="mr-2" /> Download Full PDF Report
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 rounded-2xl gap-4"
                  style={{ border: "2px dashed rgba(201,168,76,0.15)" }}>
                  <span className="text-5xl">🏠</span>
                  <p className="text-white/30 text-sm text-center">
                    Select a Bangalore area and click<br /><strong className="text-white/50">Run AI Analysis</strong>
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
