import api from "./api";
import { PredictionRequest } from "@/types/land";

export const reportService = {
  async downloadPdf(req: PredictionRequest): Promise<Blob> {
    const res = await api.post("/report/pdf", req, { responseType: "blob" });
    return res.data;
  },

  async downloadExcel(req: PredictionRequest): Promise<Blob> {
    const res = await api.post("/report/excel", req, { responseType: "blob" });
    return res.data;
  },

  triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
