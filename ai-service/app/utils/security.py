from fastapi import Header, HTTPException, status
from app.config import settings


async def verify_ai_service_key(
    x_ai_service_key: str = Header(
        None,
        alias="X-AI-Service-Key",
        description="Server-to-server security key for AI microservice",
    ),
) -> str:
    """
    Verifies that the incoming request contains a valid server-to-server API key.
    Rejects unauthorized or missing keys with HTTP 401.
    """
    if not x_ai_service_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed: Missing X-AI-Service-Key header",
        )

    if x_ai_service_key != settings.ai_service_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed: Invalid X-AI-Service-Key",
        )

    return x_ai_service_key


verify_api_key = verify_ai_service_key
