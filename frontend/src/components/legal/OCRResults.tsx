"use client";
import React from "react";

interface OCRResultsProps {
  extractedText: string;
  entities: Record<string, string[]>;
  mismatches: string[];
  integrityScore: number;
}

export function OCRResults({ extractedText, entities, mismatches, integrityScore }: OCRResultsProps) {
  const scoreColor = integrityScore >= 80 ? "#34d399" : integrityScore >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div className="space-y-4">
      {/* Integrity score */}
      <div className="flex items-center justify-between p-4 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <span className="text-sm font-semibold text-white/60">Document Integrity Score</span>
        <span className="text-2xl font-black" style={{ color: scoreColor }}>
          {integrityScore.toFixed(0)}<span className="text-sm font-normal text-white/30">/100</span>
        </span>
      </div>

      {/* Mismatches */}
      {mismatches.length > 0 && (
        <div className="p-4 rounded-xl"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}>
          <h4 className="font-semibold text-red-400 mb-2 text-sm">⚠️ Mismatches Found</h4>
          {mismatches.map((m, i) => (
            <p key={i} className="text-sm text-red-300 mt-1">{m}</p>
          ))}
        </div>
      )}

      {/* Entities */}
      <div>
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Extracted Entities</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(entities).map(([type, values]) =>
            values.length > 0 ? (
              <div key={type} className="p-3 rounded-xl"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
                <p className="text-[10px] font-bold text-gold-500 uppercase tracking-wider mb-1">{type}</p>
                {values.slice(0, 3).map((v, i) => (
                  <p key={i} className="text-sm text-white/60">{v}</p>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Text preview */}
      <div>
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Extracted Text</h4>
        <div className="p-3 rounded-xl max-h-40 overflow-y-auto"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-white/40 font-mono whitespace-pre-wrap leading-relaxed">
            {extractedText?.slice(0, 500)}...
          </p>
        </div>
      </div>
    </div>
  );
}
