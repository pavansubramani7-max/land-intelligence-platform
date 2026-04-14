from pydantic import BaseModel
from typing import List


class DisputeInput(BaseModel):
    ownership_changes_count: int = 0
    survey_conflict: bool = False
    litigation_history_count: int = 0
    boundary_disputes: bool = False
    multiple_claimants: bool = False


class DisputeOutput(BaseModel):
    risk_score: float
    risk_category: str
    factors: List[str]
