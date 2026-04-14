"use client";
import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={clsx("input-field", error && "border-red-500/60", className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
