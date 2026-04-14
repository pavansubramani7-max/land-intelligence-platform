import math
from typing import Tuple, List


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Returns distance in kilometers."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def degrees_to_dms(degrees: float) -> Tuple[int, int, float]:
    d = int(degrees)
    m = int((degrees - d) * 60)
    s = (degrees - d - m / 60) * 3600
    return d, m, s


def calculate_proximity_score(lat: float, lon: float, amenities: List[Tuple[float, float]]) -> float:
    if not amenities:
        return 50.0
    distances = [haversine_distance(lat, lon, a[0], a[1]) for a in amenities]
    avg_dist = sum(distances) / len(distances)
    score = max(0.0, 100.0 - avg_dist * 10)
    return round(min(100.0, score), 2)


def bbox_from_points(points: List[Tuple[float, float]]) -> Tuple[float, float, float, float]:
    lats = [p[0] for p in points]
    lons = [p[1] for p in points]
    return min(lats), min(lons), max(lats), max(lons)
