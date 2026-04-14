"use client";
import React, { useEffect, useRef } from "react";

interface MapViewerProps {
  heatmapData?: Array<{ lat: number; lng: number; intensity: number }>;
  riskZones?: { high_risk: any[]; medium_risk: any[]; low_risk: any[] };
  center?: [number, number];
  zoom?: number;
}

export function MapViewer({
  heatmapData = [],
  riskZones,
  center = [12.9716, 77.5946],
  zoom = 11,
}: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const init = async () => {
      await new Promise(r => setTimeout(r, 150));
      if (cancelled || !containerRef.current) return;

      const L = (await import("leaflet")).default;

      // Destroy any existing Leaflet instance on this container
      const container = containerRef.current as any;
      if (container._leaflet_id) {
        try { mapRef.current?.remove(); } catch {}
        // Force-clear the leaflet id so it can be reused
        delete container._leaflet_id;
      }
      mapRef.current = null;

      if (cancelled || !containerRef.current) return;

      // Fix marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, { center, zoom, zoomControl: true });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      // Risk zone markers
      if (riskZones) {
        const add = (pts: any[], color: string, label: string) =>
          pts.forEach(p => {
            if (!p.lat || !p.lng) return;
            L.circleMarker([p.lat, p.lng], {
              radius: 8, fillColor: color, color: "#fff",
              weight: 1.5, opacity: 1, fillOpacity: 0.85,
            })
              .bindPopup(`<b>${label}</b><br/>Land ID: ${p.land_id ?? "—"}<br/>Risk: ${p.risk_score ?? "—"}`)
              .addTo(map);
          });
        add(riskZones.high_risk   || [], "#f87171", "High Risk");
        add(riskZones.medium_risk || [], "#fbbf24", "Medium Risk");
        add(riskZones.low_risk    || [], "#34d399", "Low Risk");
      }

      // Heatmap points
      heatmapData.forEach(p => {
        if (!p.lat || !p.lng) return;
        L.circleMarker([p.lat, p.lng], {
          radius: 7, fillColor: "#c9a84c", color: "#fff",
          weight: 1, opacity: 0.8,
          fillOpacity: Math.min(1, p.intensity || 0.5),
        }).addTo(map);
      });
    };

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch {}
        mapRef.current = null;
      }
      // Clear leaflet id on unmount
      if (containerRef.current) {
        delete (containerRef.current as any)._leaflet_id;
      }
    };
  }, [JSON.stringify(heatmapData), JSON.stringify(riskZones), center?.toString(), zoom]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "480px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        zIndex: 0,
      }}
    />
  );
}
