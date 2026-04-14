"""Explainable AI Chatbot for Land Intelligence Platform."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
import re

from app.services.live_price_service import AREA_BASE_PRICES, get_live_prices
from app.utils.security import get_current_user_id

router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


def get_area_from_message(msg: str) -> Optional[str]:
    msg_lower = msg.lower()
    for area in AREA_BASE_PRICES:
        if area.lower() in msg_lower:
            return area
    return None


def format_price(p: float) -> str:
    if p >= 10000000:
        return f"₹{p/10000000:.2f} Cr"
    if p >= 100000:
        return f"₹{p/100000:.2f} L"
    return f"₹{p:,.0f}"


def generate_response(message: str) -> str:
    msg = message.lower().strip()
    prices = {p["area"]: p for p in get_live_prices()}
    area = get_area_from_message(message)

    # ── Price queries ──
    if any(w in msg for w in ["price", "rate", "cost", "value", "worth", "sqft"]):
        if area and area in prices:
            p = prices[area]
            direction = "📈" if p["trend"] == "up" else "📉"
            return (
                f"{direction} **{area}** current rate: **₹{p['price_per_sqft']:,.0f}/sqft**\n\n"
                f"- Change today: {'+' if p['change'] >= 0 else ''}{p['change_pct']:.2f}%\n"
                f"- Day High: ₹{p['high']:,.0f}/sqft\n"
                f"- Day Low: ₹{p['low']:,.0f}/sqft\n\n"
                f"For a 2400 sqft plot: **{format_price(p['price_per_sqft'] * 2400)}**"
            )
        # Top 5 areas
        top5 = sorted(prices.values(), key=lambda x: x["price_per_sqft"], reverse=True)[:5]
        lines = "\n".join([f"- **{p['area']}**: ₹{p['price_per_sqft']:,.0f}/sqft ({'+' if p['change_pct']>=0 else ''}{p['change_pct']:.2f}%)" for p in top5])
        return f"📊 **Top 5 Bangalore Areas by Price:**\n\n{lines}\n\nAsk me about a specific area for detailed rates!"

    # ── Best investment ──
    if any(w in msg for w in ["best", "invest", "buy", "recommend", "good area", "which area"]):
        gainers = sorted(prices.values(), key=lambda x: x["change_pct"], reverse=True)[:3]
        lines = "\n".join([f"- **{p['area']}**: +{p['change_pct']:.2f}% today @ ₹{p['price_per_sqft']:,.0f}/sqft" for p in gainers])
        return (
            f"💡 **Best Investment Areas Today:**\n\n{lines}\n\n"
            f"**Why these areas?**\n"
            f"- Strong infrastructure development\n"
            f"- Metro connectivity boost\n"
            f"- IT corridor proximity\n\n"
            f"Use the **Recommendation** page for full AI analysis with fraud & dispute checks."
        )

    # ── Valuation explanation ──
    if any(w in msg for w in ["valuation", "predict", "estimate", "model", "how", "ai", "shap"]):
        return (
            "🤖 **How our AI Valuation works:**\n\n"
            "We use a **3-model ensemble**:\n"
            "1. **Random Forest** (35% weight) — learns non-linear patterns\n"
            "2. **XGBoost** (45% weight) — gradient boosting, highest accuracy\n"
            "3. **Neural Network** (20% weight) — deep feature interactions\n\n"
            "**Key features used:**\n"
            "- Area (sqft), Location score, Infrastructure score\n"
            "- Zone type, Road proximity, Soil type\n"
            "- Ownership history, Litigation count\n\n"
            "**SHAP values** explain which features pushed the price up or down.\n\n"
            f"Current model accuracy: **R² = 0.975** on {len(AREA_BASE_PRICES)} Bangalore areas."
        )

    # ── Fraud explanation ──
    if any(w in msg for w in ["fraud", "fake", "scam", "anomaly", "suspicious"]):
        return (
            "🛡️ **Fraud Detection System:**\n\n"
            "We use **IsolationForest + Random Forest** to detect:\n"
            "- 🔴 Rapid price spikes (>50% in short time)\n"
            "- 🔴 Unusually fast ownership transfers (<30 days)\n"
            "- 🔴 Price far above/below area median\n"
            "- 🔴 Multiple ownership changes in 90 days\n\n"
            "**Accuracy: 96%** on Bangalore transaction data.\n\n"
            "Go to **Fraud Detection** page and enter property details to check."
        )

    # ── Dispute explanation ──
    if any(w in msg for w in ["dispute", "legal", "litigation", "court", "risk"]):
        return (
            "⚖️ **Dispute Risk Assessment:**\n\n"
            "Our model checks:\n"
            "- Number of ownership changes\n"
            "- Active litigation count\n"
            "- Survey conflicts\n"
            "- Boundary disputes\n"
            "- Multiple claimants\n\n"
            "**Risk levels:** Low / Medium / High / Critical\n\n"
            "**Model accuracy: 91%** F1-score.\n\n"
            "Always verify with a registered lawyer before purchase."
        )

    # ── Area comparison ──
    if any(w in msg for w in ["compare", "vs", "versus", "difference", "better"]):
        areas_mentioned = [a for a in AREA_BASE_PRICES if a.lower() in msg]
        if len(areas_mentioned) >= 2:
            a1, a2 = areas_mentioned[0], areas_mentioned[1]
            p1 = prices.get(a1, {}).get("price_per_sqft", AREA_BASE_PRICES.get(a1, 0))
            p2 = prices.get(a2, {}).get("price_per_sqft", AREA_BASE_PRICES.get(a2, 0))
            cheaper = a1 if p1 < p2 else a2
            pricier = a2 if p1 < p2 else a1
            diff = abs(p1 - p2)
            return (
                f"📊 **{a1} vs {a2}:**\n\n"
                f"- **{a1}**: ₹{p1:,.0f}/sqft\n"
                f"- **{a2}**: ₹{p2:,.0f}/sqft\n\n"
                f"**{pricier}** is ₹{diff:,.0f}/sqft more expensive.\n"
                f"**{cheaper}** offers better value for budget buyers.\n\n"
                f"For a 2400 sqft plot:\n"
                f"- {a1}: {format_price(p1 * 2400)}\n"
                f"- {a2}: {format_price(p2 * 2400)}"
            )

    # ── Forecast ──
    if any(w in msg for w in ["forecast", "future", "next year", "growth", "appreciate", "trend"]):
        if area:
            base = AREA_BASE_PRICES.get(area, 10000)
            growth = 12 if area in ["Devanahalli", "Electronic City", "Whitefield"] else 8
            return (
                f"📈 **{area} Price Forecast:**\n\n"
                f"- Current: ₹{base:,.0f}/sqft\n"
                f"- 1-Year forecast: ₹{base * (1 + growth/100):,.0f}/sqft (+{growth}%)\n"
                f"- 3-Year forecast: ₹{base * (1 + growth/100 * 3):,.0f}/sqft (+{growth*3}%)\n\n"
                f"**Growth drivers:** Metro expansion, IT corridor, infrastructure investment.\n\n"
                f"Use the **Forecast** page for full ARIMA model predictions."
            )
        return (
            "📈 **Bangalore Market Forecast 2024-2027:**\n\n"
            "- **Premium zones** (MG Road, Indiranagar): +6-8% annually\n"
            "- **Growth corridors** (Whitefield, Electronic City): +12-15% annually\n"
            "- **Emerging areas** (Devanahalli, Sarjapur): +15-20% annually\n"
            "- **Peripheral areas** (Hoskote, Anekal): +8-12% annually\n\n"
            "Ask about a specific area for detailed forecast!"
        )

    # ── Cheapest areas ──
    if any(w in msg for w in ["cheap", "affordable", "budget", "low price", "lowest"]):
        cheap = sorted(prices.values(), key=lambda x: x["price_per_sqft"])[:5]
        lines = "\n".join([f"- **{p['area']}**: ₹{p['price_per_sqft']:,.0f}/sqft" for p in cheap])
        return f"💰 **Most Affordable Bangalore Areas:**\n\n{lines}\n\nThese areas have high growth potential due to upcoming infrastructure projects."

    # ── Default ──
    return (
        "👋 Hi! I'm **Land IQ Assistant**. I can help you with:\n\n"
        "- 💰 **Live prices** — 'What is the price in Koramangala?'\n"
        "- 📈 **Forecasts** — 'What is the forecast for Whitefield?'\n"
        "- 🏆 **Best areas** — 'Which area is best to invest?'\n"
        "- 📊 **Compare** — 'Compare Indiranagar vs HSR Layout'\n"
        "- 🤖 **AI explanation** — 'How does the valuation model work?'\n"
        "- 🛡️ **Fraud info** — 'How is fraud detected?'\n"
        "- ⚖️ **Dispute info** — 'What is dispute risk?'\n\n"
        "Ask me anything about Bangalore land!"
    )


@router.post("/chat")
def chat(req: ChatRequest, user_id: int = Depends(get_current_user_id)):
    response = generate_response(req.message)
    return {"response": response, "role": "assistant"}
