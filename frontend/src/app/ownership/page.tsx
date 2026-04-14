"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import api from "@/services/api";
import { GitBranch, AlertTriangle, CheckCircle, Search } from "lucide-react";

interface OwnershipData {
  land_id: number;
  graph: { nodes: any[]; edges: any[] };
  circular_patterns: any[];
  suspicious_transfers: any[];
  risk_score: number;
  total_owners: number;
  total_transfers: number;
}

export default function OwnershipPage() {
  const [landId, setLandId] = useState("1");
  const [data, setData] = useState<OwnershipData | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(`/ownership/graph/${landId}`);
      setData(res);
      setToast({ message: "Ownership graph loaded!", type: "success" });
    } catch {
      setToast({ message: "No ownership data found for this Land ID", type: "error" });
    } finally { setLoading(false); }
  };

  const riskColor = data
    ? data.risk_score >= 60 ? "#f87171" : data.risk_score >= 30 ? "#fbbf24" : "#34d399"
    : "#34d399";

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">🔗 Ownership Graph</h1>
            <p className="text-white/30 text-sm mt-1">Track ownership transfer history and detect circular patterns</p>
          </div>

          {/* Search */}
          <Card title="Search Land Record">
            <div className="flex gap-3">
              <input
                value={landId}
                onChange={e => setLandId(e.target.value)}
                placeholder="Enter Land ID (e.g. 1, 2, 3...)"
                className="input-field flex-1"
              />
              <button onClick={fetchGraph} disabled={loading}
                className="gold-btn px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                <Search size={16} />
                {loading ? "Loading..." : "Load Graph"}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-2">Try Land IDs: 1, 2, 3 ... 102</p>
          </Card>

          {data && (
            <div className="mt-6 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Total Owners",     value: data.total_owners,     color: "#c9a84c" },
                  { label: "Total Transfers",  value: data.total_transfers,  color: "#38bdf8" },
                  { label: "Circular Patterns",value: data.circular_patterns.length, color: data.circular_patterns.length > 0 ? "#f87171" : "#34d399" },
                  { label: "Risk Score",       value: `${data.risk_score.toFixed(0)}%`, color: riskColor },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-2xl p-4 text-center"
                    style={{ background: "rgba(17,17,24,0.8)", border: `1px solid ${color}33` }}>
                    <p className="text-2xl font-black" style={{ color }}>{value}</p>
                    <p className="text-xs text-white/40 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Transfer chain */}
              <Card title="Ownership Transfer Chain">
                {data.graph.edges.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl"
                    style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <CheckCircle size={16} className="text-emerald-400" />
                    <p className="text-sm text-emerald-300">No transfer history found — original owner</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.graph.edges.map((edge: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                          {edge.source}
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                          <span className="text-xs text-white/30">{edge.transfer_date || "Transfer"}</span>
                          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                        </div>
                        <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                          {edge.target}
                        </div>
                        {edge.days_between < 90 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}>
                            ⚠️ {edge.days_between}d
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Suspicious transfers */}
              {data.suspicious_transfers.length > 0 && (
                <Card title="⚠️ Suspicious Transfers Detected">
                  <div className="space-y-2">
                    {data.suspicious_transfers.map((t: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                        style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-300">
                          Transfer from <strong>{t.from_owner}</strong> to <strong>{t.to_owner}</strong> in only <strong>{t.days_between} days</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Circular patterns */}
              {data.circular_patterns.length > 0 && (
                <Card title="🔴 Circular Ownership Patterns">
                  <div className="space-y-2">
                    {data.circular_patterns.map((cycle: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl"
                        style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
                        <p className="text-sm text-red-300">
                          Cycle detected: {Array.isArray(cycle) ? cycle.join(" → ") : cycle}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
