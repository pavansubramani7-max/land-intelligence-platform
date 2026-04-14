from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.database import get_db
from app.services.geo_service import get_heatmap_data, get_risk_zones, get_avg_value_by_zone, calculate_proximity_scores
from app.utils.security import get_current_user_id

router = APIRouter()


@router.get("/heatmap")
def heatmap(zone_type: Optional[str] = None, db: Session = Depends(get_db),
             user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    return get_heatmap_data(db, zone_type)


@router.get("/risk-zones")
def risk_zones(db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    return get_risk_zones(db)


@router.get("/zone-values")
def zone_values(db: Session = Depends(get_db),
                 user_id: int = Depends(get_current_user_id)) -> Dict[str, float]:
    return get_avg_value_by_zone(db)


@router.get("/proximity/{land_id}")
def proximity(land_id: int, db: Session = Depends(get_db),
               user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    return calculate_proximity_scores(land_id, db)
