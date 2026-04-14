import numpy as np
import pandas as pd
from pathlib import Path
import json

np.random.seed(42)
N = 1000

# Real Bangalore localities with coordinates and base price per sqft (INR)
LOCALITIES = {
    "Whitefield":        (12.9698, 77.7500, 8500),
    "Koramangala":       (12.9352, 77.6245, 12000),
    "Indiranagar":       (12.9784, 77.6408, 13000),
    "HSR Layout":        (12.9116, 77.6389, 10000),
    "Marathahalli":      (12.9591, 77.7006, 7500),
    "Electronic City":   (12.8399, 77.6770, 6000),
    "Sarjapur Road":     (12.9010, 77.6860, 8000),
    "Bannerghatta Road": (12.8933, 77.5975, 7000),
    "Hebbal":            (13.0350, 77.5970, 9000),
    "Yelahanka":         (13.1007, 77.5963, 6500),
    "JP Nagar":          (12.9102, 77.5850, 9500),
    "Jayanagar":         (12.9308, 77.5838, 11000),
    "Rajajinagar":       (12.9907, 77.5530, 10500),
    "Malleshwaram":      (13.0035, 77.5710, 11500),
    "Banashankari":      (12.9255, 77.5468, 9000),
    "BTM Layout":        (12.9166, 77.6101, 9800),
    "Bellandur":         (12.9257, 77.6760, 8200),
    "Domlur":            (12.9609, 77.6387, 11000),
    "Nagarbhavi":        (12.9630, 77.5060, 7800),
    "Kengeri":           (12.9063, 77.4824, 5500),
    "Devanahalli":       (13.2468, 77.7143, 4500),
    "Hoskote":           (13.0707, 77.7980, 3800),
    "Tumkur Road":       (13.0500, 77.5200, 5000),
    "Mysore Road":       (12.9500, 77.4800, 5200),
    "Old Madras Road":   (13.0100, 77.6500, 6800),
}

ZONES = ["residential", "commercial", "agricultural", "industrial"]
SOILS = ["red laterite", "black cotton", "alluvial", "sandy loam", "rocky"]

locality_names = list(LOCALITIES.keys())
locality_weights = np.ones(len(locality_names)) / len(locality_names)

locations = np.random.choice(locality_names, N, p=locality_weights)
zones = np.random.choice(ZONES, N, p=[0.55, 0.25, 0.12, 0.08])
soils = np.random.choice(SOILS, N)

lats = np.array([LOCALITIES[l][0] for l in locations]) + np.random.normal(0, 0.02, N)
lngs = np.array([LOCALITIES[l][1] for l in locations]) + np.random.normal(0, 0.02, N)

area_sqft = np.where(
    zones == "agricultural",
    np.random.lognormal(10, 0.8, N),
    np.random.lognormal(7.2, 0.7, N),
).clip(600, 200000)

base_prices = np.array([LOCALITIES[l][2] for l in locations])
zone_multipliers = {"residential": 1.0, "commercial": 1.9, "agricultural": 0.25, "industrial": 1.3}
zone_mult = np.array([zone_multipliers[z] for z in zones])

infrastructure_score = np.random.beta(5, 2, N) * 100
road_proximity_km = np.random.exponential(2.5, N).clip(0.1, 30)
flood_risk = np.random.binomial(1, 0.12, N).astype(bool)
metro_proximity_km = np.random.exponential(4, N).clip(0.5, 25)
year_established = np.random.randint(1980, 2024, N)
ownership_changes = np.random.poisson(1.5, N)
litigation_count = np.random.poisson(0.3, N)
survey_conflicts = np.random.binomial(1, 0.1, N)
area_mismatch = np.random.binomial(1, 0.08, N)
document_inconsistency_count = np.random.poisson(0.2, N)
price_volatility = np.random.beta(2, 5, N)

market_price = (
    area_sqft * base_prices * zone_mult
    * (1 + infrastructure_score / 200)
    * (1 - road_proximity_km / 80)
    * (1 - metro_proximity_km / 100)
    * (1 - flood_risk * 0.12)
    * np.random.normal(1.0, 0.08, N)
).clip(500000, 5e9)

actual_value = market_price * np.random.normal(1.04, 0.07, N)

dispute_score = (
    ownership_changes * 0.15
    + litigation_count * 0.25
    + survey_conflicts * 0.3
    + area_mismatch * 0.2
    + document_inconsistency_count * 0.1
)
dispute_risk = np.where(dispute_score > 0.7, "high", np.where(dispute_score > 0.3, "medium", "low"))

price_change_pct = np.random.normal(0.06, 0.25, N)
days_between_transfers = np.random.exponential(400, N).clip(1, 3650)
ownership_count_90days = np.random.poisson(0.3, N)
price_vs_market_ratio = np.random.normal(1.0, 0.18, N)

fraud_score = (
    (np.abs(price_change_pct) > 0.4).astype(float) * 0.3
    + (days_between_transfers < 60).astype(float) * 0.3
    + (ownership_count_90days > 1).astype(float) * 0.2
    + (np.abs(price_vs_market_ratio - 1) > 0.4).astype(float) * 0.2
)
is_fraud = (fraud_score > 0.4).astype(bool)

historical_prices = []
for i in range(N):
    base = market_price[i]
    hist = [round(base * (1 - 0.07 * (5 - j) + np.random.normal(0, 0.02)), 2) for j in range(5)]
    historical_prices.append(json.dumps(hist))

location_score = (infrastructure_score * 0.5 + (100 - road_proximity_km * 3).clip(0, 100) * 0.3 + (100 - metro_proximity_km * 4).clip(0, 100) * 0.2)

df = pd.DataFrame({
    "land_id": range(1, N + 1),
    "location": locations,
    "latitude": lats.round(6),
    "longitude": lngs.round(6),
    "area_sqft": area_sqft.round(2),
    "zone_type": zones,
    "road_proximity_km": road_proximity_km.round(3),
    "metro_proximity_km": metro_proximity_km.round(3),
    "infrastructure_score": infrastructure_score.round(2),
    "year_established": year_established,
    "soil_type": soils,
    "flood_risk": flood_risk,
    "ownership_changes": ownership_changes,
    "litigation_count": litigation_count,
    "survey_conflicts": survey_conflicts,
    "area_mismatch": area_mismatch,
    "document_inconsistency_count": document_inconsistency_count,
    "price_volatility": price_volatility.round(4),
    "market_price": market_price.round(2),
    "actual_value": actual_value.round(2),
    "location_score": location_score.round(2),
    "dispute_risk": dispute_risk,
    "ownership_change_count": ownership_changes,
    "survey_conflict": survey_conflicts,
    "price_change_pct": price_change_pct.round(4),
    "days_between_transfers": days_between_transfers.round(1),
    "ownership_count_90days": ownership_count_90days,
    "price_vs_market_ratio": price_vs_market_ratio.round(4),
    "is_fraud": is_fraud,
    "historical_prices": historical_prices,
})

output_path = Path(__file__).parent.parent / "data" / "sample_land_data.csv"
output_path.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(output_path, index=False)

print(f"Generated {N} rows of Bangalore land data")
print(f"Saved to: {output_path}")
print(f"\nDataset summary:")
print(f"  Localities: {df['location'].nunique()} areas across Bangalore")
print(f"  Zone distribution: {df['zone_type'].value_counts().to_dict()}")
print(f"  Dispute risk: {df['dispute_risk'].value_counts().to_dict()}")
print(f"  Fraud cases: {df['is_fraud'].sum()} ({df['is_fraud'].mean()*100:.1f}%)")
print(f"  Avg market price: Rs.{df['market_price'].mean():,.0f}")
print(f"  Price range: Rs.{df['market_price'].min():,.0f} - Rs.{df['market_price'].max():,.0f}")
print(f"\nTop localities by avg price:")
print(df.groupby("location")["market_price"].mean().sort_values(ascending=False).head(5).apply(lambda x: f"Rs.{x:,.0f}"))
