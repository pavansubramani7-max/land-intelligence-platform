from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(Integer, primary_key=True, index=True)
    land_id = Column(Integer, ForeignKey("land_records.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    ocr_text = Column(Text, nullable=True)
    integrity_score = Column(Float, nullable=True)
    extracted_entities = Column(String, nullable=True)
    uploaded_at = Column(DateTime, server_default=func.now())

    land = relationship("LandRecord", back_populates="documents")
