from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.services.legal_service import process_legal_document
from app.utils.security import get_current_user_id

router = APIRouter()


@router.post("/upload/{land_id}")
async def upload_document(land_id: int, file: UploadFile = File(...),
                           db: Session = Depends(get_db),
                           user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    return await process_legal_document(file, land_id, db)


@router.get("/documents/{land_id}")
def list_documents(land_id: int, db: Session = Depends(get_db),
                    user_id: int = Depends(get_current_user_id)):
    from app.models.document import LegalDocument
    docs = db.query(LegalDocument).filter(LegalDocument.land_id == land_id).all()
    return [{"id": d.id, "file_name": d.file_name, "integrity_score": d.integrity_score,
              "uploaded_at": str(d.uploaded_at)} for d in docs]
