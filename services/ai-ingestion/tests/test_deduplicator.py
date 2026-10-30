import pytest
from app.ai.deduplicator import EventDeduplicator

def test_exact_duplicate_detection():
    dedup = EventDeduplicator()

    existing_event = {
        "id": "canonical-123",
        "title": "Acoustic Night with Betty G at Atmosphere",
        "dates": {"startDate": "2026-03-24"},
        "location": {"venueName": "Atmosphere Addis"}
    }

    # Cross-posted announcement on Instagram with slight variations
    candidate = {
        "title": "Betty G Acoustic Night Live - Atmosphere",
        "dates": {"startDate": "2026-03-24"},
        "location": {"venueName": "Atmosphere Bole"}
    }

    match = dedup.find_duplicate(candidate, [existing_event])
    assert match is not None
    matched_event, score, classification = match
    assert matched_event["id"] == "canonical-123"
    assert classification == "EXACT_DUPLICATE"
    assert score >= 0.85

def test_distinct_events_different_dates():
    dedup = EventDeduplicator()

    existing_event = {
        "id": "canonical-101",
        "title": "DevFest Addis 2026",
        "dates": {"startDate": "2026-11-14"},
        "location": {"venueName": "Millennium Hall"}
    }

    candidate = {
        "title": "DevFest Addis 2026 Hackathon Day 2",
        "dates": {"startDate": "2026-11-15"},
        "location": {"venueName": "Millennium Hall"}
    }

    # Different dates should lower score below exact threshold
    score, metrics = dedup.calculate_similarity(candidate, existing_event)
    assert metrics["dateScore"] == 0.0
    assert score < 0.85
