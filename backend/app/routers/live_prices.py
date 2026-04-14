"""Live Bangalore land price endpoints."""
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from typing import Optional
import asyncio
import json

from app.services.live_price_service import get_live_prices, get_area_history
from app.utils.security import get_current_user_id

router = APIRouter()


@router.get("/prices")
def live_prices(user_id: int = Depends(get_current_user_id)):
    """Get current live prices for all Bangalore areas."""
    return get_live_prices()


@router.get("/prices/{area}/history")
def area_history(area: str, points: int = 60,
                 user_id: int = Depends(get_current_user_id)):
    """Get price history for a specific area (for sparkline chart)."""
    return get_area_history(area, points)


@router.get("/stream")
async def stream_prices(user_id: int = Depends(get_current_user_id)):
    """Server-Sent Events stream — pushes price updates every 3 seconds."""
    async def event_generator():
        while True:
            prices = get_live_prices()
            data = json.dumps(prices)
            yield f"data: {data}\n\n"
            await asyncio.sleep(3)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
