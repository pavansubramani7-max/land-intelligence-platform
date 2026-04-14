import api from "./api";

export const geoService = {
  async getHeatmap(zoneType?: string): Promise<any> {
    const params = zoneType ? { zone_type: zoneType } : {};
    const res = await api.get("/geo/heatmap", { params });
    return res.data;
  },

  async getRiskZones(): Promise<any> {
    const res = await api.get("/geo/risk-zones");
    return res.data;
  },

  async getZoneValues(): Promise<Record<string, number>> {
    const res = await api.get("/geo/zone-values");
    return res.data;
  },
};
