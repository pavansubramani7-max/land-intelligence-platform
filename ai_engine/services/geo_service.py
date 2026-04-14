"""Geo analytics: risk zone classification."""


def classify_risk_zone(lat: float, lng: float, risk_score: float) -> dict:
    """Classify a location into a risk zone based on score."""
    if risk_score < 30:
        zone = "green"
        label = "Low Risk"
    elif risk_score < 60:
        zone = "yellow"
        label = "Medium Risk"
    elif risk_score < 80:
        zone = "orange"
        label = "High Risk"
    else:
        zone = "red"
        label = "Critical Risk"

    return {
        "lat": lat,
        "lng": lng,
        "risk_score": risk_score,
        "zone_color": zone,
        "zone_label": label,
    }


def generate_heatmap_points(records: list) -> list:
    """Convert land records to heatmap-compatible points."""
    return [
        {"lat": r["lat"], "lng": r["lng"], "intensity": r.get("risk_score", 50) / 100}
        for r in records if "lat" in r and "lng" in r
    ]
