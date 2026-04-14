"use client";
import React from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({ columns, data, emptyMessage = "No data" }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-white/30 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-white/3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-white/70 text-sm">
                    {col.render ? col.render(row) : row[col.key as string]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
