"use client";
import React from "react";
import clsx from "clsx";

type BadgeVariant = "green" | "red" | "yellow" | "blue" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  "badge-green",
  red:    "badge-red",
  yellow: "badge-yellow",
  blue:   "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  gray:   "bg-white/10 text-white/50 border border-white/10",
};

export function Badge({ variant = "gray", children, className }: BadgeProps) {
  return (
    <span className={clsx("text-xs font-semibold px-2.5 py-0.5 rounded-full", variantClasses[variant], className)}>
      {children}
    </span>
  );
}
