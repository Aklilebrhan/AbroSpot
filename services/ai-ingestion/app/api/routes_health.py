from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime, timezone

from app.adapters import get_adapter
from app.schemas.ingestion import PlatformType

router = APIRouter(prefix="/health", tags=["Health & Status"])

@router.get("")
async def health_check():
    return {
        "status": "healthy",
        "service": "AbroSpot AI & Ingestion Engine",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    }

@router.get("/adapters")
async def check_adapters_status():
    results = {}
    for platform in PlatformType:
        try:
            adapter = get_adapter(platform)
            test_res = await adapter.test_connection()
            results[platform.value] = {
                "configured": adapter.is_configured(),
                "connected": test_res.is_connected,
                "message": test_res.message,
                "details": test_res.details
            }
        except Exception as e:
            results[platform.value] = {
                "configured": False,
                "connected": False,
                "message": str(e)
            }
    return results
