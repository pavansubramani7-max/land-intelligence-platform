from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.land import LandInput, LandOut, LandUpdate
from app.services.land_service import (
    create_land_record, get_land_record, get_all_land_records,
    update_land_record, delete_land_record
)
from app.utils.security import get_current_user_id

router = APIRouter()


@router.post("/", response_model=LandOut, status_code=201)
def create_land(land_data: LandInput, db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user_id)):
    return create_land_record(db, land_data, user_id)


@router.get("/", response_model=List[LandOut])
def list_lands(skip: int = 0, limit: int = 100,
               db: Session = Depends(get_db),
               user_id: int = Depends(get_current_user_id)):
    return get_all_land_records(db, skip=skip, limit=limit, owner_id=user_id)


@router.get("/{land_id}", response_model=LandOut)
def get_land(land_id: int, db: Session = Depends(get_db),
             user_id: int = Depends(get_current_user_id)):
    return get_land_record(db, land_id)


@router.put("/{land_id}", response_model=LandOut)
def update_land(land_id: int, update_data: LandUpdate,
                db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user_id)):
    return update_land_record(db, land_id, update_data, user_id)


@router.delete("/{land_id}")
def delete_land(land_id: int, db: Session = Depends(get_db),
                user_id: int = Depends(get_current_user_id)):
    delete_land_record(db, land_id, user_id)
    return {"message": "Land record deleted"}
