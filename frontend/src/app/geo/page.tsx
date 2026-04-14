"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MapViewer } from "@/components/geo/MapViewer";
import { Card } from "@/components/ui/Card";
import { useGeo } from "@/hooks/useGeo";
import { MapPin, RefreshCw } from "lucide-react";

const BANGALORE_CENTER: [number, number] = [12.9716, 77.5946];

export default function GeoPage() {
  const { heatmapData, riskZones, isLoading, loadHeatmap, loadRiskZones } = useGeo();
  const [activeLayer, setActiveLayer] = useState<"heatmap" | "risk">("risk");

  useEffect(() => {
    loadHeatmap();
    loadRiskZones();
  }, []);

  const totalPoints = (heatmapData?.heatmap_data?.length || 0);
  const highRisk = riskZones?.high_risk?.length || 0;
  const medRisk  = riskZones?.medium_risk?.length || 0;
  const lowRisk  = riskZones?.low_risk?.length || 0;

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">🗺️ Geo Intelligence Map</h1>
              <p className="text-white/30 text-sm mt-1 flex items-center gap-1">
                <MapPin size={12} /> Bangalore property risk zones & heatmap
              </p>
            </div>
            <button onClick={() => { loadHeatmap(); loadRiskZones(); }}
              className="btn-secondary flex items-center gap-2 text-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Total Properties", value: totalPoints, color: "#c9a84c" },
              { label: "Low Risk",          value: lowRisk,    color: "#34d399" },
              { label: "Medium Risk",       value: medRisk,    color: "#fbbf24" },
              { label: "High Risk",         value: highRisk,   color: "#f87171" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: "rgba(17,17,24,0.8)", border: `1px solid ${color}33` }}>
                <p className="text-xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Layer toggle */}
          <div className="flex gap-2 mb-4">
            {(["risk", "heatmap"] as const).map(layer => (
              <button key={layer} onClick={() => setActiveLayer(layer)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeLayer === layer ? "gold-btn" : "btn-secondary"
                }`}>
                {layer === "risk" ? "🎯 Risk Zones" : "🔥 Value Heatmap"}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4">
            {[
              { color: "#34d399", label: "Low Risk" },
              { color: "#fbbf24", label: "Medium Risk" },
              { color: "#f87171", label: "High Risk" },
              { color: "#c9a84c", label: "High Value" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="text-xs text-white/50">{label}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <Card>
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-white/40 text-sm">Loading Bangalore map data...</p>
                </div>
              </div>
            ) : (
              <MapViewer
                heatmapData={activeLayer === "heatmap" ? (heatmapData?.heatmap_data || []) : []}
                riskZones={activeLayer === "risk" ? riskZones : undefined}
                center={BANGALORE_CENTER}
                zoom={11}
              />
            )}
          </Card>

          <p className="text-xs text-white/20 mt-2 text-center">
            Showing {totalPoints} Bangalore properties · Data from Land IQ database
          </p>
        </main>
      </div>
    </div>
  );
}
