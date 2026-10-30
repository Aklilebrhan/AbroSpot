from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Optional
from pydantic import BaseModel

from app.schemas.ingestion import MonitoredSourceConfig, IngestionResult, PlatformType
from app.workers.ingestion_worker import IngestionWorker
from app.adapters.manual_adapter import ManualDropzoneAdapter

router = APIRouter(prefix="/api/ingest", tags=["Ingestion"])
ingestion_worker = IngestionWorker()
manual_adapter = ManualDropzoneAdapter()

class TriggerIngestRequest(BaseModel):
    platform: PlatformType
    identifier: str  # e.g. "@linkupaddis"
    displayName: Optional[str] = None
    limit: Optional[int] = 20

class ManualDropzoneRequest(BaseModel):
    rawText: str
    mediaPaths: Optional[List[str]] = None
    author: Optional[str] = "Admin Dropzone"
    sourceUrl: Optional[str] = None

@router.post("/trigger", response_model=IngestionResult)
async def trigger_source_ingestion(req: TriggerIngestRequest):
    source_config = MonitoredSourceConfig(
        platform=req.platform,
        identifier=req.identifier,
        displayName=req.displayName or req.identifier
    )
    result = await ingestion_worker.process_source(source_config, limit=req.limit or 20)
    if not result.success:
        raise HTTPException(status_code=500, detail={"message": "Ingestion failed", "errors": result.errors})
    return result

@router.post("/manual")
async def ingest_manual_flyer(req: ManualDropzoneRequest):
    post_payload = manual_adapter.create_manual_post(
        raw_text=req.rawText,
        media_paths=req.mediaPaths,
        author=req.author or "Admin Dropzone",
        source_url=req.sourceUrl
    )
    return {
        "status": "success",
        "message": "Manual post created and ready for extraction",
        "post": post_payload.model_dump()
    }
