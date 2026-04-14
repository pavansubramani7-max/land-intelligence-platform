"use client";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className={clsx("fixed bottom-4 right-4 z-50 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3", colors[type])}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
    </div>
  );
}
