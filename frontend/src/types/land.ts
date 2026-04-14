export interface LandRecord {
  id: number;
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  area_sqft: number;
  zone_type: "residential" | "commercial" | "agricultural" | "industrial";
  road_proximity_km: number;
  infrastructure_score: number;
  year_established?: number;
  soil_type?: string;
  flood_risk: boolean;
  market_price: number;
  owner_id: number;
  created_at: string;
}

export interface LandInput {
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  area_sqft: number;
  zone_type: string;
  road_proximity_km: number;
  infrastructure_score: number;
  year_established?: number;
  soil_type?: string;
  flood_risk: boolean;
  market_price: number;
}

export interface PredictionRequest {
  land_id: number;
  area_sqft: number;
  location_score: number;
  zone_type: string;
  road_proximity_km: number;
  infrastructure_score: number;
  year_established?: number;
  soil_type?: string;
  flood_risk: boolean;
  market_price: number;
  ownership_changes: number;
  litigation_count: number;
}
