import json
from typing import Optional, Any
from fastapi import Request


def _get_client(request: Optional[Request] = None):
    """Return the app-level Redis client, or None if unavailable."""
    if request and hasattr(request.app.state, "redis") and request.app.state.redis:
        return request.app.state.redis
    return None


async def cache_set(key: str, value: Any, ttl: int = 300,
                    request: Optional[Request] = None) -> None:
    client = _get_client(request)
    if client:
        await client.setex(key, ttl, json.dumps(value))


async def cache_get(key: str, request: Optional[Request] = None) -> Optional[Any]:
    client = _get_client(request)
    if not client:
        return None
    data = await client.get(key)
    return json.loads(data) if data else None


async def cache_delete(key: str, request: Optional[Request] = None) -> None:
    client = _get_client(request)
    if client:
        await client.delete(key)


async def cache_exists(key: str, request: Optional[Request] = None) -> bool:
    client = _get_client(request)
    if not client:
        return False
    return bool(await client.exists(key))
