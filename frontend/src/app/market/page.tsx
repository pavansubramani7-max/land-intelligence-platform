"use client";
import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import api from "@/services/api";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Minus, RefreshCw, Search } from "lucide-react";

interface AreaPrice {
  area: string;
  price_per_sqft: number;
  prev_price: number;
  open: number;
  high: number;
  low: number;
  change: number;
  change_pct: number;
  trend: "up" | "down";
  timestamp: number;
}

interface AreaHistory {
  [area: string]: Array<{ time: number; price: number }>;
}

const REFRESH_MS = 3000;

export default function MarketPage() {
  const [prices, setPrices] = useState<AreaPrice[]>([]);
  const [history, setHistory] = useState<AreaHistory>({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AreaPrice | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<Array<{ time: number; price: number }>>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<any>(null);

  const fetchPrices = async () => {
    try {
      const { data } = await api.get("/market/prices");
      setPrices(data);
      setLastUpdate(new Date());
      setLoading(false);

      // Update history for each area (keep last 60 points)
      setHistory(prev => {
        const next = { ...prev };
        data.forEach((p: AreaPrice) => {
          const arr = next[p.area] || [];
          arr.push({ time: p.timestamp, price: p.price_per_sqft });
          next[p.area] = arr.slice(-60);
        });
        return next;
      });
    } catch {}
  };

  const fetchAreaHistory = async (area: string) => {
    try {
      const { data } = await api.get(`/market/prices/${encodeURIComponent(area)}/history?points=60`);
      setSelectedHistory(data);
    } catch {}
  };

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (selected) fetchAreaHistory(selected.area);
  }, [selected?.area]);

  // Update selected area data when prices refresh
  useEffect(() => {
    if (selected) {
      const updated = prices.find(p => p.area === selected.area);
      if (updated) setSelected(updated);
    }
  }, [prices]);

  const filtered = prices.filter(p =>
    p.area.toLowerCase().includes(search.toLowerCase())
  );

  const gainers = [...prices].sort((a, b) => b.change_pct - a.change_pct).slice(0, 3);
  const losers  = [...prices].sort((a, b) => a.change_pct - b.change_pct).slice(0, 3);

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                📊 Live Bangalore Land Rates
                <span className="flex items-center gap-1 text-xs font-normal px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </h1>
              <p className="text-white/30 text-sm mt-1">
                {prices.length} areas · Updates every 3s
                {lastUpdate && ` · Last: ${lastUpdate.toLocaleTimeString()}`}
              </p>
            </div>
            <button onClick={fetchPrices} className="btn-secondary flex items-center gap-2 text-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Top movers */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-4" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <p className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider">🚀 Top Gainers</p>
              {gainers.map(p => (
                <div key={p.area} className="flex justify-between items-center py-1.5 cursor-pointer hover:opacity-80"
                  onClick={() => setSelected(p)}>
                  <span className="text-sm text-white/80">{p.area}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">₹{p.price_per_sqft.toLocaleString()}</span>
                    <span className="text-xs text-emerald-400 ml-2">+{p.change_pct.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-4" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <p className="text-xs font-bold text-red-400 mb-3 uppercase tracking-wider">📉 Top Losers</p>
              {losers.map(p => (
                <div key={p.area} className="flex justify-between items-center py-1.5 cursor-pointer hover:opacity-80"
                  onClick={() => setSelected(p)}>
                  <span className="text-sm text-white/80">{p.area}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">₹{p.price_per_sqft.toLocaleString()}</span>
                    <span className="text-xs text-red-400 ml-2">{p.change_pct.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected area detail chart */}
          {selected && (
            <div className="rounded-2xl p-5 mb-6"
              style={{ background: "rgba(17,17,24,0.9)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-white">{selected.area}</h2>
                  <p className="text-4xl font-black gold-text mt-1">
                    ₹{selected.price_per_sqft.toLocaleString()}<span className="text-lg text-white/40 font-normal">/sqft</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-sm font-bold flex items-center gap-1 ${selected.change_pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {selected.change_pct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {selected.change_pct >= 0 ? "+" : ""}{selected.change_pct.toFixed(3)}%
                    </span>
                    <span className="text-xs text-white/30">H: ₹{selected.high.toLocaleString()} · L: ₹{selected.low.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-xl">✕</button>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={[...( history[selected.area] || []), ...selectedHistory].slice(-60)}>
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    formatter={(v: number) => [`₹${v.toLocaleString()}/sqft`, "Price"]}
                    contentStyle={{ background: "#111118", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#fff" }}
                  />
                  <Line
                    type="monotone" dataKey="price" dot={false} strokeWidth={2}
                    stroke={selected.change_pct >= 0 ? "#34d399" : "#f87171"}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search area..."
              className="input-field pl-9"
            />
          </div>

          {/* All areas table */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.1)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(201,168,76,0.08)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                  {["Area", "Price/sqft", "Change", "High", "Low", "Trend"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">Loading live prices...</td></tr>
                ) : filtered.map((p, i) => (
                  <tr key={p.area}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer transition-colors hover:bg-white/3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: selected?.area === p.area ? "rgba(201,168,76,0.06)" : undefined }}>
                    <td className="px-4 py-3 font-semibold text-white/90">{p.area}</td>
                    <td className="px-4 py-3 font-black text-white">₹{p.price_per_sqft.toLocaleString()}</td>
                    <td className={`px-4 py-3 font-bold ${p.change_pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {p.change_pct >= 0 ? "+" : ""}{p.change_pct.toFixed(3)}%
                    </td>
                    <td className="px-4 py-3 text-white/50">₹{p.high.toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/50">₹{p.low.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {/* Sparkline */}
                      <div style={{ width: 80, height: 30 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={history[p.area] || []}>
                            <Line type="monotone" dataKey="price" dot={false} strokeWidth={1.5}
                              stroke={p.change_pct >= 0 ? "#34d399" : "#f87171"}
                              isAnimationActive={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
