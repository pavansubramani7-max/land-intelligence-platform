from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum


class ReportFormat(str, Enum):
    pdf = "pdf"
    excel = "excel"


class ReportRequest(BaseModel):
    land_id: int
    include_valuation: bool = True
    include_dispute: bool = True
    include_fraud: bool = True
    include_forecast: bool = True
    include_shap: bool = True
    format: ReportFormat = ReportFormat.pdf


class ReportOut(BaseModel):
    report_id: str
    land_id: int
    format: str
    file_size_bytes: int
    download_url: str
