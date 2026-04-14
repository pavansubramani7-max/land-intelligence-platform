import json
from typing import Dict, Any, List
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import LegalDocument
from app.models.land import LandRecord
from app.utils.ocr_utils import extract_text_from_image, extract_text_from_pdf_bytes, clean_ocr_text
from app.utils.nlp_utils import extract_entities, extract_area_mentions, extract_monetary_values
from app.utils.file_utils import save_upload_file, read_file_bytes
from fastapi import HTTPException


def analyze_document(text: str, land: LandRecord) -> Dict[str, Any]:
    entities = extract_entities(text)
    area_mentions = extract_area_mentions(text)
    monetary_mentions = extract_monetary_values(text)

    mismatches = []
    warnings = []

    if area_mentions:
        for area in area_mentions:
            if abs(area - land.area_sqft) / (land.area_sqft + 1) > 0.1:
                mismatches.append(f"Area mismatch: document says {area:.0f} sqft, record shows {land.area_sqft:.0f} sqft")

    if monetary_mentions:
        for val in monetary_mentions:
            if val > 0 and abs(val - land.market_price) / (land.market_price + 1) > 0.3:
                warnings.append(f"Price discrepancy: document mentions {val:.0f}, record shows {land.market_price:.0f}")

    integrity_score = 100.0
    integrity_score -= len(mismatches) * 20
    integrity_score -= len(warnings) * 10
    integrity_score = max(0.0, integrity_score)

    return {
        "entities": entities,
        "area_mentions": area_mentions,
        "monetary_mentions": monetary_mentions,
        "mismatches": mismatches,
        "warnings": warnings,
        "integrity_score": integrity_score,
    }


async def process_legal_document(file: UploadFile, land_id: int, db: Session) -> Dict[str, Any]:
    land = db.query(LandRecord).filter(LandRecord.id == land_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land record not found")

    file_path, file_name = save_upload_file(file, land_id)
    file_bytes = read_file_bytes(file_path)

    if file.content_type == "application/pdf":
        raw_text = extract_text_from_pdf_bytes(file_bytes)
    else:
        raw_text = extract_text_from_image(file_bytes)

    cleaned_text = clean_ocr_text(raw_text)
    analysis = analyze_document(cleaned_text, land)

    doc = LegalDocument(
        land_id=land_id,
        file_name=file_name,
        file_path=file_path,
        file_type=file.content_type or "unknown",
        ocr_text=cleaned_text[:5000],
        integrity_score=analysis["integrity_score"],
        extracted_entities=json.dumps(analysis["entities"]),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "document_id": doc.id,
        "extracted_text": cleaned_text[:2000],
        "entities": analysis["entities"],
        "mismatches": analysis["mismatches"],
        "warnings": analysis["warnings"],
        "integrity_score": analysis["integrity_score"],
    }
