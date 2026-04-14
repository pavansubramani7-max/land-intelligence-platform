import re
from typing import Optional


def validate_coordinates(lat: Optional[float], lng: Optional[float]) -> bool:
    if lat is None or lng is None:
        return True
    return -90 <= lat <= 90 and -180 <= lng <= 180


def validate_area(area_sqft: float) -> bool:
    return 100 <= area_sqft <= 100_000_000


def validate_price(price: float) -> bool:
    return 1000 <= price <= 10_000_000_000


def validate_infrastructure_score(score: float) -> bool:
    return 0 <= score <= 100


def validate_year(year: Optional[int]) -> bool:
    if year is None:
        return True
    return 1800 <= year <= 2100


def sanitize_string(value: str) -> str:
    return re.sub(r"[<>\"'%;()&+]", "", value).strip()
