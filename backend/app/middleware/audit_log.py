from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import time
from app.utils.logger import logger


class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.time()
        response = await call_next(request)
        duration = round((time.time() - start) * 1000, 2)
        logger.info(
            f"method={request.method} path={request.url.path} "
            f"status={response.status_code} duration={duration}ms "
            f"ip={request.client.host if request.client else 'unknown'}"
        )
        return response
