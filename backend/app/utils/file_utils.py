import os
import uuid
import hashlib
from pathlib import Path
from typing import Tuple
from fastapi import UploadFile, HTTPException
from app.config import settings


def ensure_upload_dir() -> Path:
    path = Path(settings.UPLOAD_DIR)
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_upload_file(file: UploadFile, land_id: int) -> Tuple[str, str]:
    allowed_types = {"application/pdf", "image/jpeg", "image/png", "image/tiff"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")

    upload_dir = ensure_upload_dir() / str(land_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename or "file").suffix
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = upload_dir / unique_name

    content = file.file.read()
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(status_code=413, detail="File too large")

    with open(file_path, "wb") as f:
        f.write(content)

    return str(file_path), file.filename or unique_name


def read_file_bytes(file_path: str) -> bytes:
    with open(file_path, "rb") as f:
        return f.read()


def compute_file_hash(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def delete_file(file_path: str) -> None:
    path = Path(file_path)
    if path.exists():
        path.unlink()
