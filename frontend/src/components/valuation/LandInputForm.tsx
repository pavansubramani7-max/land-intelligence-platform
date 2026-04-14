"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PredictionRequest } from "@/types/land";

interface LandInputFormProps {
  onSubmit: (data: PredictionRequest) => void;
  isLoading?: boolean;
  landId?: number;
}

// 98 Bangalore areas with realistic pre-filled data
const BANGALORE_AREAS: Record<string, Partial<PredictionRequest>> = {
  "MG Road":              { area_sqft: 1200, market_price: 28000000, location_score: 95, zone_type: "commercial",   road_proximity_km: 0.1, infrastructure_score: 95 },
  "Brigade Road":         { area_sqft: 900,  market_price: 25000000, location_score: 94, zone_type: "commercial",   road_proximity_km: 0.1, infrastructure_score: 94 },
  "Lavelle Road":         { area_sqft: 1500, market_price: 32000000, location_score: 96, zone_type: "commercial",   road_proximity_km: 0.2, infrastructure_score: 96 },
  "Indiranagar":          { area_sqft: 2000, market_price: 22000000, location_score: 91, zone_type: "residential",  road_proximity_km: 0.5, infrastructure_score: 90 },
  "Koramangala":          { area_sqft: 2400, market_price: 20000000, location_score: 89, zone_type: "residential",  road_proximity_km: 0.6, infrastructure_score: 88 },
  "HSR Layout":           { area_sqft: 2200, market_price: 18000000, location_score: 86, zone_type: "residential",  road_proximity_km: 0.8, infrastructure_score: 85 },
  "Jayanagar":            { area_sqft: 1800, market_price: 19000000, location_score: 88, zone_type: "residential",  road_proximity_km: 0.7, infrastructure_score: 87 },
  "Malleshwaram":         { area_sqft: 1600, market_price: 18500000, location_score: 87, zone_type: "residential",  road_proximity_km: 0.5, infrastructure_score: 86 },
  "Sadashivanagar":       { area_sqft: 3000, market_price: 24000000, location_score: 90, zone_type: "residential",  road_proximity_km: 0.4, infrastructure_score: 89 },
  "Basavanagudi":         { area_sqft: 1700, market_price: 17000000, location_score: 87, zone_type: "residential",  road_proximity_km: 0.6, infrastructure_score: 86 },
  "Richmond Town":        { area_sqft: 1400, market_price: 21000000, location_score: 91, zone_type: "residential",  road_proximity_km: 0.3, infrastructure_score: 90 },
  "Frazer Town":          { area_sqft: 1500, market_price: 16000000, location_score: 85, zone_type: "residential",  road_proximity_km: 0.5, infrastructure_score: 84 },
  "Whitefield":           { area_sqft: 2800, market_price: 14000000, location_score: 83, zone_type: "residential",  road_proximity_km: 1.2, infrastructure_score: 82 },
  "Marathahalli":         { area_sqft: 2000, market_price: 12000000, location_score: 81, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 80 },
  "Bellandur":            { area_sqft: 2200, market_price: 13000000, location_score: 80, zone_type: "residential",  road_proximity_km: 1.2, infrastructure_score: 79 },
  "Sarjapur Road":        { area_sqft: 2500, market_price: 12500000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 78 },
  "BTM Layout":           { area_sqft: 1800, market_price: 14000000, location_score: 84, zone_type: "residential",  road_proximity_km: 0.9, infrastructure_score: 83 },
  "JP Nagar":             { area_sqft: 2000, market_price: 15000000, location_score: 85, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 85 },
  "Banashankari":         { area_sqft: 1900, market_price: 13500000, location_score: 83, zone_type: "residential",  road_proximity_km: 1.1, infrastructure_score: 82 },
  "Rajajinagar":          { area_sqft: 1700, market_price: 15500000, location_score: 85, zone_type: "residential",  road_proximity_km: 0.8, infrastructure_score: 84 },
  "Hebbal":               { area_sqft: 2200, market_price: 14000000, location_score: 82, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 81 },
  "Yelahanka":            { area_sqft: 2500, market_price: 10000000, location_score: 75, zone_type: "residential",  road_proximity_km: 2.0, infrastructure_score: 74 },
  "Nagawara":             { area_sqft: 2000, market_price: 12000000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.2, infrastructure_score: 78 },
  "Hennur":               { area_sqft: 2200, market_price: 11000000, location_score: 77, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 76 },
  "Thanisandra":          { area_sqft: 2400, market_price: 10500000, location_score: 75, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 74 },
  "Kalyan Nagar":         { area_sqft: 1800, market_price: 13000000, location_score: 81, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 80 },
  "RT Nagar":             { area_sqft: 1600, market_price: 13500000, location_score: 82, zone_type: "residential",  road_proximity_km: 0.9, infrastructure_score: 81 },
  "Domlur":               { area_sqft: 1500, market_price: 16000000, location_score: 86, zone_type: "residential",  road_proximity_km: 0.7, infrastructure_score: 85 },
  "Brookefield":          { area_sqft: 2600, market_price: 13000000, location_score: 81, zone_type: "residential",  road_proximity_km: 1.3, infrastructure_score: 80 },
  "Mahadevapura":         { area_sqft: 2400, market_price: 12000000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 78 },
  "KR Puram":             { area_sqft: 2000, market_price: 10500000, location_score: 75, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 74 },
  "Banaswadi":            { area_sqft: 1800, market_price: 12000000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.2, infrastructure_score: 78 },
  "Horamavu":             { area_sqft: 2000, market_price: 11000000, location_score: 76, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 75 },
  "Varthur":              { area_sqft: 2500, market_price: 10000000, location_score: 73, zone_type: "residential",  road_proximity_km: 2.0, infrastructure_score: 72 },
  "Kadugodi":             { area_sqft: 2800, market_price: 9000000,  location_score: 71, zone_type: "residential",  road_proximity_km: 2.5, infrastructure_score: 70 },
  "Electronic City":      { area_sqft: 2400, market_price: 9500000,  location_score: 73, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 72 },
  "Devanahalli":          { area_sqft: 3000, market_price: 8500000,  location_score: 71, zone_type: "residential",  road_proximity_km: 2.5, infrastructure_score: 70 },
  "Hoskote":              { area_sqft: 3500, market_price: 7000000,  location_score: 66, zone_type: "residential",  road_proximity_km: 3.0, infrastructure_score: 65 },
  "Kengeri":              { area_sqft: 2200, market_price: 9000000,  location_score: 72, zone_type: "residential",  road_proximity_km: 2.0, infrastructure_score: 71 },
  "Mysore Road":          { area_sqft: 2000, market_price: 9500000,  location_score: 74, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 73 },
  "Nagarbhavi":           { area_sqft: 1800, market_price: 11000000, location_score: 77, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 76 },
  "Tumkur Road":          { area_sqft: 2000, market_price: 8500000,  location_score: 69, zone_type: "residential",  road_proximity_km: 2.5, infrastructure_score: 68 },
  "Bannerghatta Road":    { area_sqft: 2200, market_price: 12000000, location_score: 80, zone_type: "residential",  road_proximity_km: 1.2, infrastructure_score: 79 },
  "Old Madras Road":      { area_sqft: 2000, market_price: 11000000, location_score: 76, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 75 },
  "Peenya":               { area_sqft: 3000, market_price: 8000000,  location_score: 69, zone_type: "industrial",   road_proximity_km: 2.0, infrastructure_score: 68 },
  "Yeshwanthpur":         { area_sqft: 2000, market_price: 12000000, location_score: 80, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 79 },
  "Vijayanagar":          { area_sqft: 1800, market_price: 13000000, location_score: 83, zone_type: "residential",  road_proximity_km: 0.9, infrastructure_score: 82 },
  "Rajarajeshwari Nagar": { area_sqft: 2200, market_price: 10000000, location_score: 75, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 74 },
  "Girinagar":            { area_sqft: 1700, market_price: 12500000, location_score: 80, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 79 },
  "Padmanabhanagar":      { area_sqft: 1900, market_price: 12000000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.1, infrastructure_score: 78 },
  "Kumaraswamy Layout":   { area_sqft: 1800, market_price: 11500000, location_score: 78, zone_type: "residential",  road_proximity_km: 1.2, infrastructure_score: 77 },
  "Uttarahalli":          { area_sqft: 2000, market_price: 9500000,  location_score: 72, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 71 },
  "Subramanyapura":       { area_sqft: 2000, market_price: 10000000, location_score: 73, zone_type: "residential",  road_proximity_km: 1.6, infrastructure_score: 72 },
  "Jigani":               { area_sqft: 5000, market_price: 7000000,  location_score: 63, zone_type: "industrial",   road_proximity_km: 3.0, infrastructure_score: 62 },
  "Bommasandra":          { area_sqft: 4000, market_price: 7500000,  location_score: 65, zone_type: "industrial",   road_proximity_km: 2.5, infrastructure_score: 64 },
  "Chandapura":           { area_sqft: 3000, market_price: 7500000,  location_score: 65, zone_type: "residential",  road_proximity_km: 2.5, infrastructure_score: 64 },
  "Begur":                { area_sqft: 2500, market_price: 9000000,  location_score: 73, zone_type: "residential",  road_proximity_km: 2.0, infrastructure_score: 72 },
  "Hulimavu":             { area_sqft: 2200, market_price: 9500000,  location_score: 74, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 73 },
  "Haralur":              { area_sqft: 2400, market_price: 10000000, location_score: 75, zone_type: "residential",  road_proximity_km: 1.7, infrastructure_score: 74 },
  "Carmelaram":           { area_sqft: 2600, market_price: 9000000,  location_score: 72, zone_type: "residential",  road_proximity_km: 2.2, infrastructure_score: 71 },
  "Bommanahalli":         { area_sqft: 2000, market_price: 10500000, location_score: 76, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 75 },
  "Ejipura":              { area_sqft: 1500, market_price: 15000000, location_score: 85, zone_type: "residential",  road_proximity_km: 0.7, infrastructure_score: 84 },
  "CV Raman Nagar":       { area_sqft: 1800, market_price: 13000000, location_score: 81, zone_type: "residential",  road_proximity_km: 0.9, infrastructure_score: 80 },
  "HBR Layout":           { area_sqft: 1900, market_price: 12500000, location_score: 80, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 79 },
  "Kammanahalli":         { area_sqft: 1800, market_price: 12000000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.1, infrastructure_score: 78 },
  "Ramamurthy Nagar":     { area_sqft: 2000, market_price: 10500000, location_score: 75, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 74 },
  "Sanjaynagar":          { area_sqft: 1700, market_price: 13000000, location_score: 81, zone_type: "residential",  road_proximity_km: 0.9, infrastructure_score: 80 },
  "Mathikere":            { area_sqft: 1800, market_price: 12000000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 78 },
  "Jalahalli":            { area_sqft: 2000, market_price: 10500000, location_score: 75, zone_type: "residential",  road_proximity_km: 1.5, infrastructure_score: 74 },
  "Dollars Colony":       { area_sqft: 2200, market_price: 13500000, location_score: 83, zone_type: "residential",  road_proximity_km: 0.8, infrastructure_score: 82 },
  "Shivajinagar":         { area_sqft: 1200, market_price: 17000000, location_score: 86, zone_type: "commercial",   road_proximity_km: 0.3, infrastructure_score: 85 },
  "Cunningham Road":      { area_sqft: 1400, market_price: 20000000, location_score: 91, zone_type: "commercial",   road_proximity_km: 0.2, infrastructure_score: 90 },
  "Lalbagh Road":         { area_sqft: 1600, market_price: 17000000, location_score: 87, zone_type: "residential",  road_proximity_km: 0.5, infrastructure_score: 86 },
  "Wilson Garden":        { area_sqft: 1500, market_price: 15000000, location_score: 85, zone_type: "residential",  road_proximity_km: 0.6, infrastructure_score: 84 },
  "Shanthinagar":         { area_sqft: 1400, market_price: 16000000, location_score: 86, zone_type: "residential",  road_proximity_km: 0.5, infrastructure_score: 85 },
  "Langford Town":        { area_sqft: 1600, market_price: 18000000, location_score: 89, zone_type: "residential",  road_proximity_km: 0.4, infrastructure_score: 88 },
  "Nandi Hills":          { area_sqft: 10000,market_price: 7000000,  location_score: 61, zone_type: "agricultural", road_proximity_km: 5.0, infrastructure_score: 60 },
  "Doddaballapur":        { area_sqft: 5000, market_price: 6500000,  location_score: 59, zone_type: "agricultural", road_proximity_km: 4.0, infrastructure_score: 58 },
  "Nelamangala":          { area_sqft: 5000, market_price: 6000000,  location_score: 56, zone_type: "agricultural", road_proximity_km: 4.5, infrastructure_score: 55 },
  "Magadi Road":          { area_sqft: 2500, market_price: 8500000,  location_score: 69, zone_type: "residential",  road_proximity_km: 2.0, infrastructure_score: 68 },
  "Bagalur":              { area_sqft: 4000, market_price: 6500000,  location_score: 61, zone_type: "agricultural", road_proximity_km: 4.0, infrastructure_score: 60 },
  "Attibele":             { area_sqft: 4000, market_price: 6000000,  location_score: 59, zone_type: "agricultural", road_proximity_km: 4.5, infrastructure_score: 58 },
  "Anekal":               { area_sqft: 5000, market_price: 5500000,  location_score: 56, zone_type: "agricultural", road_proximity_km: 5.0, infrastructure_score: 55 },
  "Budigere":             { area_sqft: 4000, market_price: 7500000,  location_score: 64, zone_type: "residential",  road_proximity_km: 3.0, infrastructure_score: 63 },
  "Virgonagar":           { area_sqft: 2500, market_price: 9000000,  location_score: 72, zone_type: "residential",  road_proximity_km: 2.0, infrastructure_score: 71 },
  "Dasarahalli":          { area_sqft: 2500, market_price: 7500000,  location_score: 67, zone_type: "residential",  road_proximity_km: 2.5, infrastructure_score: 66 },
  "Hebbagodi":            { area_sqft: 3000, market_price: 7500000,  location_score: 66, zone_type: "industrial",   road_proximity_km: 2.8, infrastructure_score: 65 },
  "Akshayanagar":         { area_sqft: 2200, market_price: 9000000,  location_score: 72, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 71 },
  "Hongasandra":          { area_sqft: 2000, market_price: 9500000,  location_score: 73, zone_type: "residential",  road_proximity_km: 1.7, infrastructure_score: 72 },
  "Arekere":              { area_sqft: 2200, market_price: 9000000,  location_score: 72, zone_type: "residential",  road_proximity_km: 1.8, infrastructure_score: 71 },
  "Bilekahalli":          { area_sqft: 2000, market_price: 9500000,  location_score: 73, zone_type: "residential",  road_proximity_km: 1.7, infrastructure_score: 72 },
  "Gottigere":            { area_sqft: 2200, market_price: 9000000,  location_score: 71, zone_type: "residential",  road_proximity_km: 2.0, infrastructure_score: 70 },
  "Mysore Bank Colony":   { area_sqft: 1800, market_price: 12500000, location_score: 79, zone_type: "residential",  road_proximity_km: 1.1, infrastructure_score: 78 },
  "Dollars Layout":       { area_sqft: 1900, market_price: 12000000, location_score: 80, zone_type: "residential",  road_proximity_km: 1.0, infrastructure_score: 79 },
  "Bannerghatta":         { area_sqft: 3000, market_price: 8000000,  location_score: 69, zone_type: "residential",  road_proximity_km: 2.5, infrastructure_score: 68 },
  "Palace Orchards":      { area_sqft: 2500, market_price: 15000000, location_score: 85, zone_type: "residential",  road_proximity_km: 0.7, infrastructure_score: 84 },
  "Kathriguppe":          { area_sqft: 1800, market_price: 11500000, location_score: 77, zone_type: "residential",  road_proximity_km: 1.3, infrastructure_score: 76 },
  "Vivek Nagar":          { area_sqft: 1700, market_price: 13000000, location_score: 83, zone_type: "residential",  road_proximity_km: 0.9, infrastructure_score: 82 },
};

const AREA_NAMES = Object.keys(BANGALORE_AREAS).sort();

const selectClass = "input-field appearance-none cursor-pointer";

export function LandInputForm({ onSubmit, isLoading, landId = 1 }: LandInputFormProps) {
  const [selectedArea, setSelectedArea] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PredictionRequest>({
    defaultValues: {
      land_id: landId,
      zone_type: "residential",
      soil_type: "loam",
      flood_risk: false,
      ownership_changes: 0,
      litigation_count: 0,
    },
  });

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    const data = BANGALORE_AREAS[area];
    if (!data) return;
    Object.entries(data).forEach(([key, val]) => {
      setValue(key as keyof PredictionRequest, val as any);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Bangalore Area Selector */}
      <div>
        <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
          📍 Select Bangalore Area
        </label>
        <select
          className={selectClass}
          value={selectedArea}
          onChange={e => handleAreaSelect(e.target.value)}
        >
          <option value="">— Pick an area to auto-fill —</option>
          {AREA_NAMES.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {selectedArea && (
          <p className="text-xs text-gold-400 mt-1">
            ✓ Auto-filled data for <strong>{selectedArea}</strong> — adjust if needed
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Area (sqft)"
          type="number"
          step="0.01"
          placeholder="e.g. 2400"
          {...register("area_sqft", { required: true, valueAsNumber: true })}
          error={errors.area_sqft ? "Required" : undefined}
        />
        <Input
          label="Market Price (₹)"
          type="number"
          placeholder="e.g. 4800000"
          {...register("market_price", { required: true, valueAsNumber: true })}
          error={errors.market_price ? "Required" : undefined}
        />
        <Input
          label="Location Score (0–100)"
          type="number"
          min="0"
          max="100"
          placeholder="e.g. 75"
          {...register("location_score", { required: true, valueAsNumber: true })}
          error={errors.location_score ? "Required" : undefined}
        />
        <div>
          <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
            Zone Type
          </label>
          <select className={selectClass} {...register("zone_type", { required: true })}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="agricultural">Agricultural</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>
        <Input
          label="Road Proximity (km)"
          type="number"
          step="0.1"
          placeholder="e.g. 0.5"
          {...register("road_proximity_km", { required: true, valueAsNumber: true })}
          error={errors.road_proximity_km ? "Required" : undefined}
        />
        <Input
          label="Infrastructure Score (0–100)"
          type="number"
          min="0"
          max="100"
          placeholder="e.g. 80"
          {...register("infrastructure_score", { required: true, valueAsNumber: true })}
          error={errors.infrastructure_score ? "Required" : undefined}
        />
        <Input
          label="Year Established"
          type="number"
          placeholder="e.g. 2015"
          {...register("year_established", { valueAsNumber: true })}
        />
        <div>
          <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
            Soil Type
          </label>
          <select className={selectClass} {...register("soil_type")}>
            <option value="loam">Loam</option>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="rocky">Rocky</option>
            <option value="alluvial">Alluvial</option>
            <option value="red laterite">Red Laterite</option>
            <option value="black cotton">Black Cotton</option>
          </select>
        </div>
        <Input
          label="Ownership Changes"
          type="number"
          min="0"
          placeholder="e.g. 1"
          {...register("ownership_changes", { valueAsNumber: true })}
        />
        <Input
          label="Litigation Count"
          type="number"
          min="0"
          placeholder="e.g. 0"
          {...register("litigation_count", { valueAsNumber: true })}
        />
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          {...register("flood_risk")}
          className="w-4 h-4 rounded accent-gold-500"
        />
        <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
          Flood Risk Zone
        </span>
      </label>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Run AI Analysis
      </Button>
    </form>
  );
}
