"use client";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();
  const displayName = user?.name || user?.phone || user?.email || "User";

  return (
    <nav className="px-6 py-3.5 flex items-center justify-between sticky top-0 z-40"
      style={{
        background: "rgba(10,10,15,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
      }}>
      <div className="text-sm text-white/40">
        Welcome back,{" "}
        <span className="font-semibold text-white/80">{displayName}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative text-white/30 hover:text-gold-400 transition-colors p-2 rounded-xl hover:bg-gold-500/10">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c46a)" }}>
            <span className="text-dark-900 font-black text-[9px]">
              {displayName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-medium text-gold-400 capitalize">{user?.role ?? "—"}</span>
        </div>
      </div>
    </nav>
  );
}
