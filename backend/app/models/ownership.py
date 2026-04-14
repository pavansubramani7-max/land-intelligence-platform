from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class OwnershipHistory(Base):
    __tablename__ = "ownership_history"

    id = Column(Integer, primary_key=True, index=True)
    land_id = Column(Integer, ForeignKey("land_records.id"), nullable=False)
    owner_name = Column(String(200), nullable=False)
    owner_id_number = Column(String(100), nullable=True)
    transfer_date = Column(Date, nullable=False)
    transfer_price = Column(Integer, nullable=True)
    transfer_type = Column(String(50), default="sale")
    created_at = Column(DateTime, server_default=func.now())

    land = relationship("LandRecord", back_populates="ownership_history")
