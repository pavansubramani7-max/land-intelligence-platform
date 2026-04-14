from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.services.ownership_service import analyze_ownership
from app.utils.security import get_current_user_id

router = APIRouter()


@router.get("/graph/{land_id}")
def get_ownership_graph(land_id: int, db: Session = Depends(get_db),
                         user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    return analyze_ownership(land_id, db)
