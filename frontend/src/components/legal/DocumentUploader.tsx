"use client";
import React, { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function DocumentUploader({ onUpload, isLoading }: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={() => !isLoading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className="rounded-2xl p-8 text-center cursor-pointer transition-all"
      style={{
        border: `2px dashed ${isDragging ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.12)"}`,
        background: isDragging ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)",
        opacity: isLoading ? 0.5 : 1,
        cursor: isLoading ? "not-allowed" : "pointer",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.tiff"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        disabled={isLoading}
      />
      <Upload className="mx-auto mb-3 text-white/30" size={32} />
      {selectedFile ? (
        <div className="flex items-center justify-center gap-2">
          <FileText size={16} className="text-gold-400" />
          <span className="text-sm text-gold-400 font-medium">{selectedFile.name}</span>
        </div>
      ) : (
        <>
          <p className="text-white/60 font-medium">Drag & drop or click to upload</p>
          <p className="text-sm text-white/30 mt-1">PDF, JPG, PNG, TIFF · Max 10MB</p>
        </>
      )}
    </div>
  );
}
