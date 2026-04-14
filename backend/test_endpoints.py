import requests

BASE = "http://localhost:8000"
token = requests.post(f"{BASE}/auth/login", json={"email":"admin@landiq.com","password":"admin1234"}).json().get("access_token","")
h = {"Authorization": f"Bearer {token}"}
payload = {"land_id":1,"area_sqft":2400,"location_score":85,"zone_type":"residential","road_proximity_km":0.5,"infrastructure_score":82,"market_price":4800000,"ownership_changes":1,"litigation_count":0,"flood_risk":False}

print("LOGIN:", "OK" if token else "FAILED")

r = requests.post(f"{BASE}/valuation/predict", json=payload, headers=h)
print("VALUATION:", r.status_code, r.text[:300])

r = requests.post(f"{BASE}/dispute/predict", json=payload, headers=h)
print("DISPUTE:", r.status_code, r.text[:300])

r = requests.post(f"{BASE}/fraud/detect", json=payload, headers=h)
print("FRAUD:", r.status_code, r.text[:300])

r = requests.get(f"{BASE}/geo/heatmap", headers=h)
print("GEO:", r.status_code, r.text[:300])

r = requests.post(f"{BASE}/forecast/", json=payload, headers=h)
print("FORECAST:", r.status_code, r.text[:300])

r = requests.post(f"{BASE}/recommend/", json=payload, headers=h)
print("RECOMMEND:", r.status_code, r.text[:300])
