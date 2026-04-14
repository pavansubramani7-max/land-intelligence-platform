import api from "./api";

export const legalService = {
  async uploadDocument(landId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/legal/upload/${landId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async getDocuments(landId: number): Promise<any[]> {
    const res = await api.get(`/legal/documents/${landId}`);
    return res.data;
  },
};
