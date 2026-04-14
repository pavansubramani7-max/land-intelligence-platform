"use client";
import React from "react";
import { Badge } from "@/components/ui/Badge";

interface Activity {
  id: number;
  type: string;
  location: string;
  value: string;
  status: "completed" | "pending" | "flagged";
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const statusVariant = {
    completed: "green" as const,
    pending: "yellow" as const,
    flagged: "red" as const,
  };

  return (
    <div className="space-y-2">
      {activities.map((a) => (
        <div key={a.id}
          className="flex items-center justify-between py-2.5 px-1"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p className="text-sm font-semibold text-white/80">{a.type}</p>
            <p className="text-xs text-white/30 mt-0.5">{a.location} · {a.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white/60">{a.value}</span>
            <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
