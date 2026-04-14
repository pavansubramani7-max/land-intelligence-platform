"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DocumentUploader } from "@/components/legal/DocumentUploader";
import { OCRResults } from "@/components/legal/OCRResults";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { legalService } from "@/services/legalService";

export default function LegalPage() {
  const [landId, setLandId] = useState("1");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await legalService.uploadDocument(parseInt(landId), file);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Legal Document Analysis</h1>
          <div className="grid grid-cols-2 gap-6">
            <Card title="Upload Document">
              <div className="mb-4">
                <Input label="Land ID" type="number" value={landId}
                  onChange={(e) => setLandId(e.target.value)} />
              </div>
              <DocumentUploader onUpload={handleUpload} isLoading={isLoading} />
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </Card>
            <div>
              {result && (
                <Card title="Analysis Results">
                  <OCRResults
                    extractedText={result.extracted_text}
                    entities={result.entities}
                    mismatches={result.mismatches}
                    integrityScore={result.integrity_score}
                  />
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
