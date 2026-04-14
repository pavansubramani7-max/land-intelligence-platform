"use client";
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({ variant = "primary", size = "md", isLoading, children, className, disabled, ...props }: ButtonProps) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };

  const base = "inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyle: Record<string, React.CSSProperties> = {
    primary:   { background: "linear-gradient(135deg, #c9a84c, #e8c46a)", color: "#0a0a0f" },
    secondary: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" },
    danger:    { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" },
    ghost:     { background: "transparent", color: "rgba(255,255,255,0.5)" },
  };

  return (
    <button
      className={clsx(base, sizes[size], className)}
      style={variantStyle[variant]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
