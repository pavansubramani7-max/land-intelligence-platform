"""Live Bangalore land price simulation — fluctuates like stock/gold prices."""
import time
import math
import random
from typing import Dict, List

# Base prices per sqft for each area (₹)
AREA_BASE_PRICES: Dict[str, float] = {
    "MG Road": 45000, "Brigade Road": 42000, "Lavelle Road": 48000,
    "Cunningham Road": 38000, "Richmond Town": 35000, "Langford Town": 32000,
    "Indiranagar": 28000, "Koramangala": 26000, "Sadashivanagar": 34000,
    "Basavanagudi": 24000, "Frazer Town": 22000, "Malleshwaram": 24000,
    "Rajajinagar": 20000, "Jayanagar": 22000, "JP Nagar": 20000,
    "Banashankari": 18000, "HSR Layout": 22000, "BTM Layout": 18000,
    "Domlur": 24000, "Shivajinagar": 28000, "Wilson Garden": 20000,
    "Shanthinagar": 22000, "Lalbagh Road": 24000, "Ejipura": 22000,
    "Whitefield": 14000, "Marathahalli": 13000, "Bellandur": 14000,
    "Sarjapur Road": 12000, "Brookefield": 15000, "Mahadevapura": 13000,
    "Varthur": 11000, "Kadugodi": 10000, "KR Puram": 11000,
    "Hebbal": 16000, "Nagawara": 14000, "Hennur": 13000,
    "Thanisandra": 12000, "Kalyan Nagar": 15000, "RT Nagar": 16000,
    "Banaswadi": 14000, "Horamavu": 13000, "CV Raman Nagar": 16000,
    "HBR Layout": 15000, "Kammanahalli": 14000, "Sanjaynagar": 16000,
    "Yelahanka": 10000, "Dollars Colony": 17000, "Mathikere": 14000,
    "Jalahalli": 12000, "Yeshwanthpur": 14000, "Vijayanagar": 15000,
    "Electronic City": 9500, "Chandapura": 7500, "Begur": 9000,
    "Hulimavu": 9500, "Haralur": 10000, "Carmelaram": 9000,
    "Bommanahalli": 10500, "Hongasandra": 9500, "Akshayanagar": 9000,
    "Bilekahalli": 9500, "Gottigere": 8500, "Arekere": 9000,
    "Devanahalli": 8500, "Hoskote": 7000, "Bagalur": 6500,
    "Budigere": 7500, "Virgonagar": 9000, "Ramamurthy Nagar": 10500,
    "Nagarbhavi": 11000, "Kengeri": 9000, "Mysore Road": 9500,
    "Rajarajeshwari Nagar": 10000, "Uttarahalli": 9000, "Subramanyapura": 9500,
    "Girinagar": 12000, "Padmanabhanagar": 11500, "Kumaraswamy Layout": 11000,
    "Kathriguppe": 11000, "Mysore Bank Colony": 12000, "Dollars Layout": 12000,
    "Bannerghatta Road": 13000, "Bannerghatta": 8000, "Jigani": 6000,
    "Bommasandra": 6500, "Hebbagodi": 6500, "Attibele": 5500,
    "Anekal": 5000, "Nandi Hills": 4000, "Doddaballapur": 4500,
    "Nelamangala": 4000, "Magadi Road": 8500, "Peenya": 7000,
    "Dasarahalli": 7000, "Tumkur Road": 7500, "Palace Orchards": 20000,
    "Vivek Nagar": 18000, "Ejipura Layout": 20000,
}

# Volatility per area (higher = more fluctuation)
AREA_VOLATILITY: Dict[str, float] = {
    "MG Road": 0.003, "Brigade Road": 0.003, "Indiranagar": 0.004,
    "Koramangala": 0.004, "Whitefield": 0.006, "Electronic City": 0.007,
    "Devanahalli": 0.008, "Sarjapur Road": 0.006, "Hebbal": 0.005,
}

# Trend direction per area (+ve = appreciating)
AREA_TREND: Dict[str, float] = {
    "Devanahalli": 0.0002, "Electronic City": 0.0003, "Whitefield": 0.0002,
    "Sarjapur Road": 0.0002, "Yelahanka": 0.0001, "Hebbal": 0.0001,
    "MG Road": 0.00005, "Indiranagar": 0.0001, "Koramangala": 0.0001,
}

# In-memory price state
_price_state: Dict[str, Dict] = {}


def _init_state():
    global _price_state
    if _price_state:
        return
    t = time.time()
    for area, base in AREA_BASE_PRICES.items():
        _price_state[area] = {
            "current": base,
            "prev": base,
            "open": base,
            "high": base,
            "low": base,
            "phase": random.uniform(0, 2 * math.pi),
            "last_update": t,
        }


def get_live_prices() -> List[Dict]:
    """Return current live prices for all areas with change info."""
    _init_state()
    t = time.time()
    result = []

    for area, state in _price_state.items():
        base = AREA_BASE_PRICES[area]
        vol = AREA_VOLATILITY.get(area, 0.005)
        trend = AREA_TREND.get(area, 0.00005)

        # Simulate price movement: sine wave + random noise + trend
        elapsed = t - state["last_update"]
        sine = math.sin(t / 300 + state["phase"]) * vol * base
        noise = random.gauss(0, vol * base * 0.3)
        drift = trend * base * elapsed

        new_price = state["current"] + sine * 0.1 + noise * 0.05 + drift
        # Keep within ±15% of base
        new_price = max(base * 0.85, min(base * 1.15, new_price))

        prev = state["current"]
        state["prev"] = prev
        state["current"] = new_price
        state["high"] = max(state["high"], new_price)
        state["low"] = min(state["low"], new_price)
        state["last_update"] = t

        change = new_price - state["open"]
        change_pct = (change / state["open"]) * 100

        result.append({
            "area": area,
            "price_per_sqft": round(new_price, 0),
            "prev_price": round(prev, 0),
            "open": round(state["open"], 0),
            "high": round(state["high"], 0),
            "low": round(state["low"], 0),
            "change": round(change, 0),
            "change_pct": round(change_pct, 3),
            "trend": "up" if new_price > prev else "down",
            "timestamp": round(t * 1000),
        })

    result.sort(key=lambda x: x["price_per_sqft"], reverse=True)
    return result


def get_area_history(area: str, points: int = 60) -> List[Dict]:
    """Generate historical price data for sparkline charts."""
    _init_state()
    base = AREA_BASE_PRICES.get(area, 10000)
    vol = AREA_VOLATILITY.get(area, 0.005)
    trend = AREA_TREND.get(area, 0.00005)
    phase = _price_state.get(area, {}).get("phase", 0)

    t = time.time()
    history = []
    price = base * 0.95  # start slightly below base

    for i in range(points):
        ts = t - (points - i) * 5  # 5 seconds apart
        sine = math.sin(ts / 300 + phase) * vol * base
        noise = random.gauss(0, vol * base * 0.2)
        price = price + sine * 0.08 + noise * 0.03 + trend * base * 5
        price = max(base * 0.85, min(base * 1.15, price))
        history.append({
            "time": round(ts * 1000),
            "price": round(price, 0),
        })

    return history
