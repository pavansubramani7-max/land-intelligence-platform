"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RiskDistribution } from "@/components/charts/RiskDistribution";
import { TrendingUp, AlertTriangle, Shield, FileText, Users, BarChart2, ArrowUpRight, MapPin, Activity } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

const CARD_CONFIGS = [
  { key: "valuation_predictions", title: "Total Valuations",  icon: TrendingUp,    color: "#c9a84c", bg: "rgba(201,168,76,0.1)",  border: "rgba(201,168,76,0.2)",  href: "/valuation" },
  { key: "total_land_records",    title: "Land Records",      icon: FileText,      color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)",  href: "/geo" },
  { key: "fraud_detections",      title: "Fraud Alerts",      icon: Shield,        color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", href: "/fraud" },
  { key: "dispute_assessments",   title: "Dispute Cases",     icon: AlertTriangle, color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.2)",  href: "/dispute" },
  { key: "total_users",           title: "Registered Users",  icon: Users,         color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)", href: "/admin" },
  { key: "total_predictions",     title: "AI Predictions",    icon: BarChart2,     color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.2)",  href: "/reports" },
];

const RECENT_ACTIVITIES = [
  { id: 1, type: "Valuation",    location: "Koramangala, Bangalore",     value: "₹2.05 Cr",   status: "completed" as const, date: "2 min ago" },
  { id: 2, type: "Fraud Alert",  location: "Whitefield, Bangalore",      value: "High Risk",   status: "flagged"   as const, date: "15 min ago" },
  { id: 3, type: "Dispute Risk", location: "HSR Layout, Bangalore",      value: "Low Risk",    status: "completed" as const, date: "1 hr ago" },
  { id: 4, type: "Valuation",    location: "Indiranagar, Bangalore",     value: "₹3.20 Cr",   status: "completed" as const, date: "2 hrs ago" },
  { id: 5, type: "Forecast",     location: "Electronic City, Bangalore", value: "+15.3%",      status: "completed" as const, date: "3 hrs ago" },
  { id: 6, type: "Fraud Alert",  location: "Sarjapur Road, Bangalore",   value: "Medium Risk", status: "pending"   as const, date: "5 hrs ago" },
];

const RISK_DATA = [
  { name: "Low Risk",      value: 52 },
  { name: "Medium Risk",   value: 28 },
  { name: "High Risk",     value: 13 },
  { name: "Fraud Flagged", value: 7  },
];

const QUICK_ACTIONS = [
  { href: "/valuation",      icon: "🏠", label: "AI Valuation",      desc: "Get instant property value",    color: "rgba(201,168,76,0.15)",  border: "rgba(201,168,76,0.3)" },
  { href: "/dispute",        icon: "⚖️", label: "Dispute Risk",       desc: "Check legal risk score",        color: "rgba(251,146,60,0.1)",   border: "rgba(251,146,60,0.25)" },
  { href: "/fraud",          icon: "🛡️", label: "Fraud Detection",    desc: "Detect anomalies",              color: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)" },
  { href: "/forecast",       icon: "📈", label: "Price Forecast",     desc: "36-month ARIMA prediction",     color: "rgba(56,189,248,0.1)",   border: "rgba(56,189,248,0.25)" },
  { href: "/recommendation", icon: "💡", label: "Investment Advice",  desc: "BUY / HOLD / AVOID",            color: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)" },
  { href: "/market",         icon: "📊", label: "Live Rates",         desc: "Real-time Bangalore prices",    color: "rgba(129,140,248,0.1)",  border: "rgba(129,140,248,0.25)" },
  { href: "/geo",            icon: "🗺️", label: "Geo Map",            desc: "Risk zones & heatmap",          color: "rgba(201,168,76,0.08)",  border: "rgba(201,168,76,0.2)" },
  { href: "/reports",        icon: "📄", label: "Reports",            desc: "Download PDF & Excel",          color: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [liveMarket, setLiveMarket] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.get("/admin/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/market/prices").then(r => setLiveMarket(r.data.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-white/30 text-sm mt-1 flex items-center gap-1">
                <MapPin size={12} /> Bangalore Land Intelligence Platform
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/valuation">
                <button className="gold-btn px-5 py-2.5 rounded-xl text-sm font-bold">+ New Valuation</button>
              </Link>
              <Link href="/reports">
                <button className="btn-secondary text-sm">Download Report</button>
              </Link>
            </div>
          </div>

          {/* Stat Cards — all clickable */}
          <div className="grid grid-cols-3 gap-4">
            {CARD_CONFIGS.map(({ key, title, icon: Icon, color, bg, border, href }) => (
              <Link key={key} href={href}>
                <div className="rounded-2xl p-5 transition-all hover:scale-[1.03] cursor-pointer"
                  style={{ background: "rgba(17,17,24,0.8)", border: `1px solid ${border}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <ArrowUpRight size={14} style={{ color }} />
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{stats?.[key] ?? "—"}</p>
                  <p className="text-xs text-white/40">{title}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl p-5" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(201,168,76,0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Recent Activity</h3>
                <Link href="/reports" className="text-xs text-gold-400 hover:text-gold-300">View all →</Link>
              </div>
              <RecentActivity activities={RECENT_ACTIVITIES} />
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(201,168,76,0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Risk Distribution</h3>
                <Link href="/dispute" className="text-xs text-gold-400 hover:text-gold-300">Assess risk →</Link>
              </div>
              <RiskDistribution data={RISK_DATA} />
            </div>
          </div>

          {/* Live Market Prices */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(201,168,76,0.1)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
                <Activity size={14} className="text-emerald-400" />
                Live Bangalore Market Prices
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                </span>
              </h3>
              <Link href="/market" className="text-xs text-gold-400 hover:text-gold-300 font-semibold">
                View all 98 areas →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {(liveMarket.length > 0 ? liveMarket : [
                { area: "Indiranagar",     price_per_sqft: 28000, change_pct: 0.082, dispute_risk: "Low" },
                { area: "Koramangala",     price_per_sqft: 26000, change_pct: 0.075, dispute_risk: "Low" },
                { area: "Whitefield",      price_per_sqft: 14000, change_pct: 0.121, dispute_risk: "Low" },
                { area: "HSR Layout",      price_per_sqft: 22000, change_pct: 0.068, dispute_risk: "Low" },
                { area: "Electronic City", price_per_sqft: 9500,  change_pct: 0.153, dispute_risk: "Medium" },
                { area: "Devanahalli",     price_per_sqft: 8500,  change_pct: 0.187, dispute_risk: "Medium" },
                { area: "Sarjapur Road",   price_per_sqft: 12500, change_pct: 0.112, dispute_risk: "Low" },
                { area: "Hebbal",          price_per_sqft: 14000, change_pct: 0.094, dispute_risk: "Low" },
              ]).map((m: any) => (
                <Link key={m.area} href="/market">
                  <div className="rounded-xl p-3 transition-all hover:scale-[1.03] cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs font-bold text-white/80 mb-1 truncate">{m.area}</p>
                    <p className="text-sm font-black text-gold-400">₹{(m.price_per_sqft || 0).toLocaleString()}/sqft</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-semibold ${(m.change_pct || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {(m.change_pct || 0) >= 0 ? "+" : ""}{((m.change_pct || 0)).toFixed(2)}%
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400">
                        Low
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions — all 8 clickable */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-4">
              {QUICK_ACTIONS.map(({ href, icon, label, desc, color, border }) => (
                <Link key={href} href={href}>
                  <div className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.04]"
                    style={{ background: color, border: `1px solid ${border}` }}>
                    <span className="text-2xl">{icon}</span>
                    <p className="text-sm font-bold text-white mt-2">{label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
