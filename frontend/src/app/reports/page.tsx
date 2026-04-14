"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { LandInputForm } from "@/components/valuation/LandInputForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { reportService } from "@/services/reportService";
import { PredictionRequest } from "@/types/land";
import { FileText, Table, CheckCircle } from "lucide-react";

export default function ReportsPage() {
  const [lastReq, setLastReq] = useState<PredictionRequest | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingXls, setLoadingXls] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const downloadPdf = async () => {
    if (!lastReq) return;
    setLoadingPdf(true);
    try {
      const blob = await reportService.downloadPdf(lastReq);
      reportService.triggerDownload(blob, `LandIQ_Report_${lastReq.land_id}.pdf`);
      setToast({ message: "PDF report downloaded!", type: "success" });
    } catch {
      setToast({ message: "PDF download failed", type: "error" });
    } finally { setLoadingPdf(false); }
  };

  const downloadExcel = async () => {
    if (!lastReq) return;
    setLoadingXls(true);
    try {
      const blob = await reportService.downloadExcel(lastReq);
      reportService.triggerDownload(blob, `LandIQ_Report_${lastReq.land_id}.xlsx`);
      setToast({ message: "Excel report downloaded!", type: "success" });
    } catch {
      setToast({ message: "Excel download failed", type: "error" });
    } finally { setLoadingXls(false); }
  };

  const PDF_SECTIONS = [
    "Property Details & Location",
    "AI Valuation (RF + XGB + ANN Ensemble)",
    "SHAP Feature Importance Chart",
    "Dispute Risk Assessment",
    "Fraud Detection Analysis",
    "36-Month Price Forecast",
    "Investment Recommendation (BUY/HOLD/AVOID)",
    "Legal Disclaimer",
  ];

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">📄 Generate Reports</h1>
            <p className="text-white/30 text-sm mt-1">Full AI analysis report — PDF & Excel for any Bangalore property</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Property Details">
              <LandInputForm onSubmit={(d) => setLastReq(d)} />
            </Card>

            <div className="space-y-4">
              {/* PDF Report */}
              <div className="rounded-2xl p-5"
                style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(248,113,113,0.15)" }}>
                    <FileText size={18} className="text-red-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">PDF Report</p>
                    <p className="text-xs text-white/40">Full analysis with charts & SHAP explanations</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-4">
                  {PDF_SECTIONS.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-white/50">{s}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={downloadPdf} isLoading={loadingPdf} disabled={!lastReq} className="w-full">
                  Download PDF Report
                </Button>
                {!lastReq && <p className="text-xs text-white/30 text-center mt-2">Fill the form first</p>}
              </div>

              {/* Excel Report */}
              <div className="rounded-2xl p-5"
                style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(52,211,153,0.15)" }}>
                    <Table size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Excel Report</p>
                    <p className="text-xs text-white/40">Tabular data — Valuation, Dispute, Forecast sheets</p>
                  </div>
                </div>
                <Button onClick={downloadExcel} isLoading={loadingXls} disabled={!lastReq} variant="secondary" className="w-full">
                  Download Excel Report
                </Button>
              </div>

              {/* Info box */}
              <div className="rounded-xl p-4"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
                <p className="text-xs font-bold text-gold-400 mb-2">📋 How to use</p>
                <ol className="text-xs text-white/40 space-y-1 list-decimal list-inside">
                  <li>Select a Bangalore area from the dropdown</li>
                  <li>Adjust area, price, and other details if needed</li>
                  <li>Click "Run AI Analysis" to save the data</li>
                  <li>Download PDF or Excel report</li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
