"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import api from "@/services/api";
import { Plus, MapPin, Home, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface LandRecord {
  id: number;
  title: string;
  location: string;
  area_sqft: number;
  zone_type: string;
  market_price: number;
  infrastructure_score: number;
  flood_risk: boolean;
  created_at: string;
}

const ZONE_COLORS: Record<string, string> = {
  residential: "#34d399", commercial: "#c9a84c",
  agricultural: "#fb923c", industrial: "#818cf8",
};

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`;
  return `₹${n.toLocaleString()}`;
}

export default function LandPage() {
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({
    title: "", location: "", area_sqft: "", zone_type: "residential",
    road_proximity_km: "1.0", infrastructure_score: "75",
    year_established: "2015", soil_type: "loam",
    flood_risk: false, market_price: "",
    latitude: "", longitude: "",
  });

  const fetchLands = async () => {
    try {
      const { data } = await api.get("/land/");
      setLands(data);
    } catch { setLands([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLands(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/land/", {
        ...form,
        area_sqft: Number(form.area_sqft),
        road_proximity_km: Number(form.road_proximity_km),
        infrastructure_score: Number(form.infrastructure_score),
        year_established: Number(form.year_established),
        market_price: Number(form.market_price),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      setToast({ message: "Land record added!", type: "success" });
      setShowForm(false);
      fetchLands();
    } catch (e: any) {
      setToast({ message: e.response?.data?.detail || "Failed to add", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this land record?")) return;
    try {
      await api.delete(`/land/${id}`);
      setToast({ message: "Deleted successfully", type: "success" });
      fetchLands();
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">🏠 Land Records</h1>
              <p className="text-white/30 text-sm mt-1">Manage your Bangalore property portfolio</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
              <Plus size={16} /> Add Land Record
            </button>
          </div>

          {/* Add form */}
          {showForm && (
            <Card title="Add New Land Record" className="mb-6">
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Title", key: "title", type: "text", placeholder: "e.g. Koramangala Plot" },
                    { label: "Location", key: "location", type: "text", placeholder: "e.g. Koramangala, Bangalore" },
                    { label: "Area (sqft)", key: "area_sqft", type: "number", placeholder: "e.g. 2400" },
                    { label: "Market Price (₹)", key: "market_price", type: "number", placeholder: "e.g. 4800000" },
                    { label: "Infrastructure Score", key: "infrastructure_score", type: "number", placeholder: "0-100" },
                    { label: "Road Proximity (km)", key: "road_proximity_km", type: "number", placeholder: "e.g. 0.5" },
                    { label: "Year Established", key: "year_established", type: "number", placeholder: "e.g. 2015" },
                    { label: "Latitude (optional)", key: "latitude", type: "number", placeholder: "e.g. 12.9352" },
                    { label: "Longitude (optional)", key: "longitude", type: "number", placeholder: "e.g. 77.6245" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
                      <input type={type} placeholder={placeholder} value={(form as any)[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="input-field" required={!["latitude","longitude"].includes(key)} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Zone Type</label>
                    <select className="input-field" value={form.zone_type} onChange={e => setForm({ ...form, zone_type: e.target.value })}>
                      {["residential","commercial","agricultural","industrial"].map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Soil Type</label>
                    <select className="input-field" value={form.soil_type} onChange={e => setForm({ ...form, soil_type: e.target.value })}>
                      {["loam","clay","sandy","rocky","alluvial","red laterite","black cotton"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.flood_risk} onChange={e => setForm({ ...form, flood_risk: e.target.checked })} className="w-4 h-4 accent-gold-500" />
                  <span className="text-sm text-white/50">Flood Risk Zone</span>
                </label>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Add Record</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}

          {/* Land records grid */}
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lands.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 rounded-2xl gap-4"
              style={{ border: "2px dashed rgba(201,168,76,0.15)" }}>
              <Home size={40} className="text-white/20" />
              <p className="text-white/30">No land records yet. Add your first property!</p>
              <button onClick={() => setShowForm(true)} className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold">
                + Add Land Record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {lands.map(land => (
                <div key={land.id} className="rounded-2xl p-5 transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-white">{land.title}</p>
                      <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {land.location}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold capitalize"
                      style={{ background: `${ZONE_COLORS[land.zone_type]}22`, color: ZONE_COLORS[land.zone_type] }}>
                      {land.zone_type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-[10px] text-white/30">Area</p>
                      <p className="text-sm font-bold text-white">{land.area_sqft.toLocaleString()} sqft</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-[10px] text-white/30">Market Price</p>
                      <p className="text-sm font-bold text-gold-400">{fmt(land.market_price)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/valuation`} className="flex-1">
                      <button className="w-full text-xs py-2 rounded-xl font-semibold transition-all"
                        style={{ background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)" }}>
                        <Eye size={12} className="inline mr-1" /> Valuate
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(land.id)}
                      className="px-3 py-2 rounded-xl text-xs transition-all"
                      style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
