from fastapi import APIRouter
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from app.schemas.ingestion import RawPostPayload
from app.ai.extractor import EventExtractor
from app.ai.deduplicator import EventDeduplicator
from app.ai.date_normalizer import EthiopianDateNormalizer

router = APIRouter(prefix="/api/ai", tags=["AI Processing Engine"])
extractor = EventExtractor()
deduplicator = EventDeduplicator()
date_normalizer = EthiopianDateNormalizer()

class DateNormalizeRequest(BaseModel):
    text: str
    referenceDate: Optional[datetime] = None

class DeduplicateRequest(BaseModel):
    candidate: Dict[str, Any]
    existingEvents: List[Dict[str, Any]]

@router.post("/extract")
async def extract_event_from_post(post: RawPostPayload, ocrText: Optional[str] = None):
    result = extractor.process(post, ocr_text=ocrText)
    return result

@router.post("/normalize-date")
async def normalize_date_and_time(req: DateNormalizeRequest):
    date_result = date_normalizer.normalize_date_expression(req.text, reference_date=req.referenceDate)
    time_result = date_normalizer.normalize_time_expression(req.text)
    return {
        "dates": date_result,
        "time": time_result
    }

@router.post("/deduplicate")
async def check_event_duplicates(req: DeduplicateRequest):
    match = deduplicator.find_duplicate(req.candidate, req.existingEvents)
    if match:
        matched_event, score, classification = match
        return {
            "isDuplicate": True,
            "classification": classification,
            "similarityScore": score,
            "matchedEventId": matched_event.get("id")
        }
    return {
        "isDuplicate": False,
        "classification": "UNIQUE",
        "similarityScore": 0.0,
        "matchedEventId": None
    }
