"use client";
import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className, title }: CardProps) {
  return (
    <div className={clsx("rounded-2xl p-6", className)}
      style={{ background: "rgba(17,17,24,0.8)", border: "1px solid rgba(201,168,76,0.12)" }}>
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: "rgba(255,255,255,0.4)" }}>{title}</h3>
      )}
      {children}
    </div>
  );
}
