from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime


class DocumentOut(BaseModel):
    id: int
    land_id: int
    file_name: str
    file_type: str
    ocr_text: Optional[str]
    integrity_score: Optional[float]
    extracted_entities: Optional[str]
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class DocumentAnalysisResult(BaseModel):
    document_id: int
    extracted_text: str
    entities: Dict[str, List[str]]
    mismatches: List[str]
    integrity_score: float
    warnings: List[str]
