"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import api from "@/services/api";

export default function AdminPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const [stats, setStats] = useState<any>(null);
  const [models, setModels] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== "admin") { router.replace("/dashboard"); return; }
    if (!user) return;
    api.get("/admin/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/admin/model-performance").then(r => setModels(r.data)).catch(() => {});
    api.get("/admin/users").then(r => setUsers(r.data)).catch(() => {});
  }, [user, router]);

  if (!user) return null;
  if (user.role !== "admin") return null;

  const userColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "is_active", header: "Active", render: (row: any) => row.is_active ? "✓" : "✗" },
  ];

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>
          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Users" value={stats.total_users} color="blue" />
              <StatCard title="Land Records" value={stats.total_land_records} color="green" />
              <StatCard title="Total Predictions" value={stats.total_predictions} color="yellow" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <Card title="Registered Users">
              <Table columns={userColumns} data={users} emptyMessage="No users found" />
            </Card>
            <Card title="Model Registry">
              {models ? (
                <div className="space-y-2">
                  {Object.entries(models.models || {}).map(([name, meta]: [string, any]) => (
                    <div key={name} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{name}</span>
                      <span className="text-xs text-gray-400">v{meta.version}</span>
                    </div>
                  ))}
                  {Object.keys(models.models || {}).length === 0 && (
                    <p className="text-sm text-gray-400">No models trained yet. Run training scripts first.</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Loading...</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
