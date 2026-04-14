"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, AlertTriangle, Shield,
  BarChart2, FileText, Map, Star, FileDown, Settings,
  LogOut, Activity, MessageCircle, Home, GitBranch, User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/dashboard",      label: "Dashboard",    icon: LayoutDashboard },
  { href: "/market",         label: "Live Rates",   icon: Activity,       live: true },
  { href: "/valuation",      label: "Valuation",    icon: TrendingUp },
  { href: "/dispute",        label: "Dispute Risk", icon: AlertTriangle },
  { href: "/fraud",          label: "Fraud",        icon: Shield },
  { href: "/forecast",       label: "Forecast",     icon: BarChart2 },
  { href: "/recommendation", label: "Recommend",    icon: Star },
  { href: "/land",           label: "My Lands",     icon: Home },
  { href: "/ownership",      label: "Ownership",    icon: GitBranch },
  { href: "/geo",            label: "Geo Map",      icon: Map },
  { href: "/legal",          label: "Legal Docs",   icon: FileText },
  { href: "/reports",        label: "Reports",      icon: FileDown },
  { href: "/chatbot",        label: "AI Chat",      icon: MessageCircle },
  { href: "/profile",        label: "Profile",      icon: User },
  { href: "/admin",          label: "Admin",        icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); router.push("/auth/login"); };
  const displayName = user?.name || user?.phone || user?.email || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside className="w-60 min-h-screen flex flex-col"
      style={{ background: "rgba(10,10,15,0.98)", borderRight: "1px solid rgba(201,168,76,0.12)" }}>

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c46a)" }}>
          <span className="text-dark-900 font-black text-xs">LI</span>
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">Land IQ</p>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.5)" }}>Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-0.5 px-2">
        {navItems.map(({ href, label, icon: Icon, live }: any) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group"
              style={active ? {
                background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,196,106,0.08))",
                border: "1px solid rgba(201,168,76,0.25)",
                color: "#e8c46a",
              } : {
                color: "rgba(255,255,255,0.4)",
                border: "1px solid transparent",
              }}>
              <Icon size={16} className={active ? "" : "group-hover:text-gold-400 transition-colors"} />
              <span className={active ? "font-semibold" : "group-hover:text-white/70 transition-colors"}>{label}</span>
              {live && !active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <Link href="/profile">
          <div className="flex items-center gap-2.5 mb-2 px-1 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(232,196,106,0.15))", border: "1px solid rgba(201,168,76,0.3)" }}>
              <span className="text-gold-400 font-bold text-xs">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{displayName}</p>
              <p className="text-[10px] capitalize" style={{ color: "rgba(201,168,76,0.6)" }}>{user?.role ?? "—"}</p>
            </div>
          </div>
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}
