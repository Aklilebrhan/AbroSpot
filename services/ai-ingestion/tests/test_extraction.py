import pytest
from datetime import datetime, timezone
from app.ai.extractor import EventExtractor
from app.schemas.ingestion import RawPostPayload, PlatformType

def test_event_classification_positive():
    extractor = EventExtractor()
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="test_1",
        publishedAt=datetime.now(timezone.utc),
        rawText="""Acoustic Live Concert with Betty G at Atmosphere Addis!
Friday Megabit 15, 2018. Doors open at 6:00 PM (ከሰዓት 12:00).
Entry 300 ETB. Location: Bole behind Edna Mall."""
    )
    res = extractor.process(post)
    assert res["isEvent"] is True
    assert res["category"] == "music"
    assert "Atmosphere Addis" in res["location"]["venueName"]
    assert res["location"]["subCity"] == "Bole"
    assert res["pricing"]["isFree"] is False
    assert res["pricing"]["priceAmount"] == 300.0

def test_event_classification_negative_job_vacancy():
    extractor = EventExtractor()
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="test_vacancy",
        publishedAt=datetime.now(timezone.utc),
        rawText="""🚨 URGENT JOB VACANCY: Senior Accountant needed!
Salary: Negotiable. Experience: 3+ years in banking.
Send your CV to jobs@example.et before Friday."""
    )
    res = extractor.process(post)
    assert res["isEvent"] is False
    assert "job vacancy" in res["reason"]

def test_tech_event_extraction():
    extractor = EventExtractor()
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="test_tech",
        publishedAt=datetime.now(timezone.utc),
        rawText="""🚀 GDG Addis DevFest 2026!
Join 1000+ developers at Millennium Hall, Bole.
Date: November 14, 2026. Time: 9:00 AM - 5:00 PM.
Free admission! RSVP now."""
    )
    res = extractor.process(post)
    assert res["isEvent"] is True
    assert res["category"] == "technology"
    assert "Millennium Hall" in res["location"]["venueName"]
    assert res["pricing"]["isFree"] is True
