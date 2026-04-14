import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.models.land import LandRecord
from app.utils.geo_utils import haversine_distance


def get_heatmap_data(db: Session, zone_type: Optional[str] = None) -> Dict[str, Any]:
    query = db.query(LandRecord).filter(
        LandRecord.latitude.isnot(None),
        LandRecord.longitude.isnot(None),
    )
    if zone_type:
        query = query.filter(LandRecord.zone_type == zone_type)

    records = query.limit(500).all()

    heatmap_points = []
    for r in records:
        if r.latitude and r.longitude:
            heatmap_points.append({
                "lat": r.latitude,
                "lng": r.longitude,
                "value": r.market_price,
                "intensity": min(1.0, r.market_price / 1_000_000),
            })

    return {"heatmap_data": heatmap_points, "total_points": len(heatmap_points)}


def get_risk_zones(db: Session) -> Dict[str, Any]:
    records = db.query(LandRecord).filter(
        LandRecord.latitude.isnot(None),
        LandRecord.longitude.isnot(None),
    ).all()

    zones = {"high_risk": [], "medium_risk": [], "low_risk": []}
    for r in records:
        risk_score = 0
        if r.flood_risk:
            risk_score += 40
        if r.infrastructure_score < 30:
            risk_score += 30
        if r.road_proximity_km > 10:
            risk_score += 20

        point = {"lat": r.latitude, "lng": r.longitude, "land_id": r.id, "risk_score": risk_score}
        if risk_score >= 60:
            zones["high_risk"].append(point)
        elif risk_score >= 30:
            zones["medium_risk"].append(point)
        else:
            zones["low_risk"].append(point)

    return zones


def get_avg_value_by_zone(db: Session) -> Dict[str, float]:
    records = db.query(LandRecord).all()
    zone_values: Dict[str, List[float]] = {}
    for r in records:
        zone = str(r.zone_type.value if hasattr(r.zone_type, "value") else r.zone_type)
        zone_values.setdefault(zone, []).append(r.market_price)
    return {zone: round(np.mean(vals), 2) for zone, vals in zone_values.items()}


def calculate_proximity_scores(land_id: int, db: Session) -> Dict[str, Any]:
    land = db.query(LandRecord).filter(LandRecord.id == land_id).first()
    if not land or not land.latitude or not land.longitude:
        return {"error": "No coordinates available"}

    nearby = db.query(LandRecord).filter(
        LandRecord.id != land_id,
        LandRecord.latitude.isnot(None),
    ).limit(50).all()

    distances = []
    for r in nearby:
        if r.latitude and r.longitude:
            dist = haversine_distance(land.latitude, land.longitude, r.latitude, r.longitude)
            distances.append({"land_id": r.id, "distance_km": round(dist, 3), "value": r.market_price})

    distances.sort(key=lambda x: x["distance_km"])
    return {"land_id": land_id, "nearby_properties": distances[:10]}
