"""Generate expanded Bangalore land dataset with 50+ real areas."""
import pandas as pd
import numpy as np
import random

rng = np.random.default_rng(42)
random.seed(42)

# 50 Bangalore areas with real GPS coords and price multipliers
AREAS = [
    # (name, lat, lng, price_mult, infra_base)
    ("Koramangala",     12.9352, 77.6245, 3.5, 88),
    ("Indiranagar",     12.9784, 77.6408, 3.8, 90),
    ("Whitefield",      12.9698, 77.7500, 2.8, 82),
    ("HSR Layout",      12.9116, 77.6389, 3.2, 85),
    ("BTM Layout",      12.9166, 77.6101, 2.9, 83),
    ("Marathahalli",    12.9591, 77.6974, 2.6, 80),
    ("Bellandur",       12.9256, 77.6762, 2.7, 79),
    ("Sarjapur Road",   12.9010, 77.6849, 2.5, 78),
    ("Electronic City", 12.8399, 77.6770, 2.0, 72),
    ("Hebbal",          13.0358, 77.5970, 2.8, 81),
    ("Yelahanka",       13.1007, 77.5963, 2.2, 74),
    ("Devanahalli",     13.2480, 77.7120, 1.8, 70),
    ("Hoskote",         13.0700, 77.7980, 1.5, 65),
    ("Malleshwaram",    13.0035, 77.5710, 3.3, 86),
    ("Rajajinagar",     12.9900, 77.5560, 3.0, 84),
    ("Jayanagar",       12.9308, 77.5838, 3.4, 87),
    ("JP Nagar",        12.9063, 77.5857, 3.1, 85),
    ("Banashankari",    12.9252, 77.5468, 2.8, 82),
    ("Nagarbhavi",      12.9600, 77.5100, 2.4, 76),
    ("Kengeri",         12.9074, 77.4800, 1.9, 71),
    ("Mysore Road",     12.9500, 77.4800, 2.1, 73),
    ("Tumkur Road",     13.0600, 77.5200, 1.8, 68),
    ("Bannerghatta Road", 12.8900, 77.5970, 2.6, 79),
    ("Domlur",          12.9600, 77.6380, 3.2, 85),
    ("Old Madras Road", 13.0100, 77.6500, 2.3, 75),
    ("Nagawara",        13.0450, 77.6200, 2.5, 78),
    ("Hennur",          13.0500, 77.6400, 2.3, 76),
    ("Thanisandra",     13.0600, 77.6300, 2.2, 74),
    ("Kalyan Nagar",    13.0200, 77.6400, 2.6, 80),
    ("RT Nagar",        13.0200, 77.5900, 2.7, 81),
    ("Frazer Town",     12.9800, 77.6100, 3.0, 84),
    ("Shivajinagar",    12.9800, 77.6000, 3.1, 85),
    ("MG Road",         12.9756, 77.6197, 4.0, 92),
    ("Brigade Road",    12.9719, 77.6074, 4.2, 93),
    ("Lavelle Road",    12.9700, 77.6000, 4.5, 95),
    ("Cunningham Road", 12.9900, 77.5900, 3.8, 90),
    ("Sadashivanagar",  13.0100, 77.5700, 3.5, 88),
    ("Basavanagudi",    12.9400, 77.5700, 3.2, 86),
    ("Vijayanagar",     12.9700, 77.5300, 2.8, 82),
    ("Yeshwanthpur",    13.0200, 77.5400, 2.6, 79),
    ("Peenya",          13.0300, 77.5200, 1.8, 68),
    ("Dasarahalli",     13.0500, 77.5100, 1.7, 66),
    ("Bagalur",         13.1500, 77.7000, 1.4, 60),
    ("Attibele",        12.7800, 77.7600, 1.3, 58),
    ("Anekal",          12.7100, 77.6900, 1.2, 55),
    ("Chandapura",      12.8200, 77.6800, 1.6, 64),
    ("Begur",           12.8700, 77.6200, 2.0, 72),
    ("Gottigere",       12.8600, 77.5900, 1.9, 70),
    ("Hulimavu",        12.8800, 77.6000, 2.1, 73),
    ("Akshayanagar",    12.8700, 77.6100, 2.0, 71),
    ("Bommanahalli",    12.9000, 77.6200, 2.3, 75),
    ("Hongasandra",     12.8900, 77.6100, 2.1, 72),
    ("Arekere",         12.8800, 77.6000, 2.0, 71),
    ("Bilekahalli",     12.8900, 77.6100, 2.1, 72),
    ("Haralur",         12.8900, 77.6800, 2.2, 74),
    ("Carmelaram",      12.8900, 77.7100, 2.0, 71),
    ("Varthur",         12.9400, 77.7500, 2.1, 72),
    ("Kadugodi",        12.9800, 77.7700, 1.9, 70),
    ("Brookefield",     12.9700, 77.7200, 2.7, 80),
    ("Mahadevapura",    12.9900, 77.7100, 2.5, 78),
    ("KR Puram",        13.0000, 77.6900, 2.2, 74),
    ("Banaswadi",       13.0100, 77.6500, 2.5, 78),
    ("Horamavu",        13.0300, 77.6600, 2.3, 75),
    ("Ramamurthy Nagar",13.0200, 77.6700, 2.2, 74),
    ("Virgonagar",      13.0100, 77.7000, 2.0, 71),
    ("Budigere",        13.1000, 77.7500, 1.6, 63),
    ("Nandi Hills",     13.3700, 77.6800, 1.5, 60),
    ("Doddaballapur",   13.2900, 77.5400, 1.4, 58),
    ("Nelamangala",     13.1000, 77.3900, 1.3, 55),
    ("Magadi Road",     12.9600, 77.4600, 1.8, 68),
    ("Rajarajeshwari Nagar", 12.9200, 77.5000, 2.2, 74),
    ("Uttarahalli",     12.9000, 77.5300, 2.0, 71),
    ("Subramanyapura",  12.9100, 77.5200, 2.1, 72),
    ("Padmanabhanagar", 12.9300, 77.5500, 2.5, 78),
    ("Girinagar",       12.9400, 77.5500, 2.6, 79),
    ("Kathriguppe",     12.9300, 77.5400, 2.4, 76),
    ("Kumaraswamy Layout", 12.9100, 77.5600, 2.5, 77),
    ("Dollars Colony",  13.0400, 77.5900, 2.8, 82),
    ("Palace Orchards", 13.0100, 77.5800, 3.0, 84),
    ("Sanjaynagar",     13.0200, 77.5900, 2.7, 80),
    ("Mathikere",       13.0300, 77.5600, 2.5, 78),
    ("Jalahalli",       13.0500, 77.5300, 2.2, 74),
    ("HBR Layout",      13.0300, 77.6400, 2.6, 79),
    ("Kammanahalli",    13.0100, 77.6500, 2.5, 78),
    ("CV Raman Nagar",  12.9900, 77.6600, 2.7, 80),
    ("Ejipura",         12.9500, 77.6200, 3.0, 84),
    ("Vivek Nagar",     12.9600, 77.6300, 2.8, 82),
    ("Richmond Town",   12.9600, 77.6000, 3.8, 90),
    ("Langford Town",   12.9600, 77.6000, 3.5, 88),
    ("Shanthinagar",    12.9600, 77.6000, 3.2, 85),
    ("Wilson Garden",   12.9500, 77.6000, 3.0, 84),
    ("Lalbagh Road",    12.9500, 77.5900, 3.3, 86),
    ("Mysore Bank Colony", 12.9300, 77.5600, 2.8, 82),
    ("Dollars Layout",  12.9200, 77.5700, 2.6, 79),
    ("Bannerghatta",    12.8600, 77.5800, 1.8, 68),
    ("Jigani",          12.7900, 77.6300, 1.5, 62),
    ("Bommasandra",     12.8100, 77.6800, 1.6, 64),
    ("Hebbagodi",       12.8300, 77.6700, 1.7, 65),
]

ZONE_TYPES = ["residential", "commercial", "agricultural", "industrial"]
SOIL_TYPES = ["loam", "clay", "sandy", "rocky", "alluvial", "red laterite", "black cotton", "sandy loam"]
DISPUTE_RISKS = ["low", "medium", "high"]

rows = []
land_id = 1001  # start after existing 1000

for area_name, base_lat, base_lng, price_mult, infra_base in AREAS:
    n_records = random.randint(8, 15)  # 8-15 records per area
    for _ in range(n_records):
        zone = random.choices(ZONE_TYPES, weights=[50, 25, 15, 10])[0]
        area_sqft = float(rng.integers(500, 60000))
        infra = min(100, max(10, infra_base + rng.integers(-15, 15)))
        road_prox = round(float(rng.uniform(0.1, 8.0)), 3)
        metro_prox = round(float(rng.uniform(0.5, 20.0)), 3)
        year = int(rng.integers(1980, 2024))
        soil = random.choice(SOIL_TYPES)
        flood = bool(rng.random() < 0.12)
        ownership_changes = int(rng.integers(0, 7))
        litigation = int(rng.integers(0, 4))
        survey_conflict = int(rng.integers(0, 2))
        area_mismatch = int(rng.integers(0, 2))
        doc_inconsistency = int(rng.integers(0, 3))
        price_volatility = round(float(rng.uniform(0.01, 0.75)), 4)

        # Realistic price based on area multiplier
        zone_mult = {"commercial": 2.2, "residential": 1.0, "industrial": 1.4, "agricultural": 0.4}[zone]
        base_price = area_sqft * price_mult * zone_mult * rng.uniform(3500, 8000)
        market_price = round(float(base_price), 2)

        # Actual value slightly different from market
        actual_value = round(market_price * rng.uniform(0.85, 1.20), 2)
        location_score = min(100, max(20, infra + rng.integers(-10, 10)))

        # Dispute risk
        risk_score = ownership_changes * 5 + litigation * 8 + survey_conflict * 20 + area_mismatch * 15
        if risk_score > 40:
            dispute_risk = "high"
        elif risk_score > 20:
            dispute_risk = "medium"
        else:
            dispute_risk = "low"

        # Fraud features
        price_change_pct = round(float(rng.uniform(-0.5, 0.8)), 4)
        days_between = round(float(rng.exponential(400)), 1)
        ownership_90d = int(rng.integers(0, 4))
        price_vs_ratio = round(float(rng.uniform(0.4, 1.6)), 4)
        is_fraud = bool(
            price_change_pct > 0.5 or days_between < 30 or
            ownership_90d > 2 or price_vs_ratio > 1.4
        )

        # Historical prices (5 years)
        hist = [round(market_price * rng.uniform(0.5, 0.95), 2) for _ in range(5)]
        hist.sort()

        lat = round(base_lat + float(rng.uniform(-0.02, 0.02)), 6)
        lng = round(base_lng + float(rng.uniform(-0.02, 0.02)), 6)

        rows.append({
            "land_id": land_id,
            "location": area_name,
            "latitude": lat,
            "longitude": lng,
            "area_sqft": area_sqft,
            "zone_type": zone,
            "road_proximity_km": road_prox,
            "metro_proximity_km": metro_prox,
            "infrastructure_score": infra,
            "year_established": year,
            "soil_type": soil,
            "flood_risk": flood,
            "ownership_changes": ownership_changes,
            "litigation_count": litigation,
            "survey_conflicts": survey_conflict,
            "area_mismatch": area_mismatch,
            "document_inconsistency_count": doc_inconsistency,
            "price_volatility": price_volatility,
            "market_price": market_price,
            "actual_value": actual_value,
            "location_score": location_score,
            "dispute_risk": dispute_risk,
            "ownership_change_count": ownership_changes,
            "survey_conflict": survey_conflict,
            "price_change_pct": price_change_pct,
            "days_between_transfers": days_between,
            "ownership_count_90days": ownership_90d,
            "price_vs_area_median_ratio": price_vs_ratio,
            "is_fraud": is_fraud,
            "historical_prices": str(hist),
        })
        land_id += 1

new_df = pd.DataFrame(rows)
print(f"Generated {len(new_df)} new records across {new_df['location'].nunique()} areas")

# Load existing and append
existing = pd.read_csv("sample_land_data.csv")
combined = pd.concat([existing, new_df], ignore_index=True)
combined.to_csv("sample_land_data.csv", index=False)
print(f"Total dataset: {len(combined)} records across {combined['location'].nunique()} unique areas")
print("Areas:", sorted(combined['location'].unique()))
