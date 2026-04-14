"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import { User, Lock, Shield, Activity } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setToast({ message: "Passwords do not match", type: "error" }); return;
    }
    if (pwForm.newPw.length < 8) {
      setToast({ message: "Password must be at least 8 characters", type: "error" }); return;
    }
    setPwLoading(true);
    try {
      await api.post("/auth/change-password", { current_password: pwForm.current, new_password: pwForm.newPw });
      setToast({ message: "Password changed successfully!", type: "success" });
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (e: any) {
      setToast({ message: e.response?.data?.detail || "Failed to change password", type: "error" });
    } finally { setPwLoading(false); }
  };

  const ROLE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    admin:    { color: "#f87171", bg: "rgba(248,113,113,0.15)", label: "Administrator" },
    analyst:  { color: "#c9a84c", bg: "rgba(201,168,76,0.15)",  label: "Analyst" },
    viewer:   { color: "#34d399", bg: "rgba(52,211,153,0.15)",  label: "Viewer" },
  };
  const roleCfg = ROLE_CONFIG[user?.role || "viewer"];

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">👤 My Profile</h1>
            <p className="text-white/30 text-sm mt-1">Manage your account settings</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Profile info */}
            <div className="space-y-4">
              <Card title="Account Information">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
                    style={{ background: "linear-gradient(135deg,#c9a84c,#e8c46a)", color: "#0a0a0f" }}>
                    {(user?.name || user?.email || "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{user?.name || "—"}</p>
                    <p className="text-sm text-white/40">{user?.email || user?.phone || "—"}</p>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold mt-1 inline-block"
                      style={{ background: roleCfg?.bg, color: roleCfg?.color }}>
                      {roleCfg?.label}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: User,     label: "Name",   value: user?.name || "—" },
                    { icon: Activity, label: "Email",  value: user?.email || "—" },
                    { icon: Shield,   label: "Role",   value: user?.role || "—" },
                    { icon: Activity, label: "Status", value: user?.is_active ? "Active ✅" : "Inactive" },
                    { icon: Activity, label: "Verified", value: user?.is_verified ? "Verified ✅" : "Unverified" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 px-1"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2 text-white/40 text-sm">
                        <Icon size={14} /> {label}
                      </div>
                      <span className="text-sm font-semibold text-white/80 capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Permissions */}
              <Card title="Permissions">
                <div className="space-y-2">
                  {[
                    { label: "View Valuations",    allowed: true },
                    { label: "Run AI Analysis",    allowed: true },
                    { label: "Download Reports",   allowed: true },
                    { label: "View Fraud Alerts",  allowed: ["admin","analyst"].includes(user?.role || "") },
                    { label: "Admin Dashboard",    allowed: user?.role === "admin" },
                    { label: "Manage Users",       allowed: user?.role === "admin" },
                  ].map(({ label, allowed }) => (
                    <div key={label} className="flex items-center justify-between py-2 px-1">
                      <span className="text-sm text-white/50">{label}</span>
                      <span className={`text-xs font-bold ${allowed ? "text-emerald-400" : "text-red-400"}`}>
                        {allowed ? "✅ Allowed" : "🚫 Restricted"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Change password */}
            <div className="space-y-4">
              <Card title="Change Password">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    { label: "Current Password", key: "current", placeholder: "Enter current password" },
                    { label: "New Password",      key: "newPw",   placeholder: "Min 8 characters" },
                    { label: "Confirm Password",  key: "confirm", placeholder: "Repeat new password" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
                      <input type="password" placeholder={placeholder}
                        value={(pwForm as any)[key]}
                        onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                        className="input-field" required />
                    </div>
                  ))}
                  <Button type="submit" isLoading={pwLoading} className="w-full">
                    <Lock size={14} className="mr-2" /> Change Password
                  </Button>
                </form>
              </Card>

              {/* Activity summary */}
              <Card title="Activity Summary">
                <div className="space-y-3">
                  {[
                    { label: "Valuations Run",    value: "—", icon: "🏠" },
                    { label: "Reports Downloaded", value: "—", icon: "📄" },
                    { label: "Fraud Checks",       value: "—", icon: "🛡️" },
                    { label: "Member Since",       value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "—", icon: "📅" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center justify-between py-2 px-1"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-sm text-white/50">{icon} {label}</span>
                      <span className="text-sm font-bold text-white/80">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
