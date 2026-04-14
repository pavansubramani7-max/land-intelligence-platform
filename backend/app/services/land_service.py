from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.land import LandRecord
from app.schemas.land import LandInput, LandUpdate


def create_land_record(db: Session, land_data: LandInput, owner_id: int) -> LandRecord:
    land = LandRecord(**land_data.model_dump(), owner_id=owner_id)
    db.add(land)
    db.commit()
    db.refresh(land)
    return land


def get_land_record(db: Session, land_id: int) -> LandRecord:
    land = db.query(LandRecord).filter(LandRecord.id == land_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land record not found")
    return land


def get_all_land_records(db: Session, skip: int = 0, limit: int = 100,
                          owner_id: Optional[int] = None) -> List[LandRecord]:
    query = db.query(LandRecord)
    if owner_id:
        query = query.filter(LandRecord.owner_id == owner_id)
    return query.offset(skip).limit(limit).all()


def update_land_record(db: Session, land_id: int, update_data: LandUpdate,
                        owner_id: int) -> LandRecord:
    land = get_land_record(db, land_id)
    if land.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    for field, value in update_data.model_dump(exclude_none=True).items():
        setattr(land, field, value)
    db.commit()
    db.refresh(land)
    return land


def delete_land_record(db: Session, land_id: int, owner_id: int) -> bool:
    land = get_land_record(db, land_id)
    if land.owner_id != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(land)
    db.commit()
    return True
