import pytest
from datetime import datetime, timezone
from app.ai.extractor import EventExtractor
from app.ai.date_normalizer import EthiopianDateNormalizer, EthiopianCalendar
from app.ai.deduplicator import EventDeduplicator
from app.schemas.ingestion import RawPostPayload, PlatformType

@pytest.fixture
def extractor():
    return EventExtractor()

@pytest.fixture
def normalizer():
    return EthiopianDateNormalizer()

@pytest.fixture
def deduplicator():
    return EventDeduplicator()

# Scenario 1: Amharic-only announcement with Ethiopian date & local solar time
def test_scenario_amharic_only_announcement(extractor):
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="amh_101",
        publishedAt=datetime(2026, 10, 30, tzinfo=timezone.utc),
        rawText="""የፈንዲካ የአዝማሪ እና የኢትዮ ጃዝ ምሽት!
ጥቅምት 27 ቀን 2018 ዓ.ም ከምሽቱ 2:00 ጀምሮ በፈንዲካ የባህል ማዕከል ካዛንቺስ።
የመግቢያ ዋጋ፡ 200 ብር።
ሁላችሁም ተጋብዛችኋል!"""
    )
    result = extractor.process(post)
    assert result["isEvent"] is True
    assert result["category"] in ["art-culture", "music"]
    assert "Fendika" in result["location"]["venueName"]
    assert result["location"]["subCity"] == "Kirkos"
    assert result["pricing"]["priceAmount"] == 200.0
    # Ethiopian 2 night = 20:00:00 (8:00 PM)
    assert result["dates"]["startTime"] == "20:00:00"

# Scenario 2: English-only announcement with Gregorian date
def test_scenario_english_only_announcement(extractor):
    post = RawPostPayload(
        sourcePlatform=PlatformType.X_TWITTER,
        externalPostId="eng_202",
        publishedAt=datetime(2026, 10, 30, tzinfo=timezone.utc),
        rawText="""DevFest Addis 2026 Developer Summit!
Date: November 14, 2026.
Time: 9:00 AM - 5:00 PM.
Venue: Millennium Hall, Bole Airport Road.
Free registration at gdg.community.dev."""
    )
    result = extractor.process(post)
    assert result["isEvent"] is True
    assert result["category"] == "technology"
    assert "Millennium Hall" in result["location"]["venueName"]
    assert result["pricing"]["isFree"] is True
    assert result["dates"]["startDate"] == "2026-11-14"

# Scenario 3: Mixed English-Amharic announcement
def test_scenario_mixed_bilingual_announcement(extractor):
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="bilingual_303",
        publishedAt=datetime(2026, 10, 30, tzinfo=timezone.utc),
        rawText="""Atmosphere Addis presents: Acoustic Night with Betty G!
ዓርብ ጥቅምት 27, 2018 ዓ.ም ከምሽቱ 1:00 (7:00 PM) ጀምሮ በአትሞስፊየር ቦሌ።
Entrance: 300 ETB. Food and drinks available."""
    )
    result = extractor.process(post)
    assert result["isEvent"] is True
    assert "Atmosphere" in result["location"]["venueName"]
    assert result["dates"]["startDate"] is not None
    assert result["pricing"]["priceAmount"] == 300.0

# Scenario 4: Missing Year Inference
def test_scenario_missing_year_inference(normalizer):
    ref_date = datetime(2026, 10, 30, tzinfo=timezone.utc) # 2019 EC
    res = normalizer.normalize_date_expression("Event on Tikimt 27 at Atmosphere", reference_date=ref_date)
    assert res["detectedCalendar"] == "ETHIOPIAN"
    assert res["isoDate"] is not None
    assert res["assumedYear"] is True

# Scenario 5: Missing Venue Fallback to Landmark
def test_scenario_missing_venue_landmark(extractor):
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="lm_404",
        publishedAt=datetime(2026, 10, 30, tzinfo=timezone.utc),
        rawText="""Special Open Air Market & Art Fair!
Saturday November 21, 2026 at Meskel Square.
Free entry for all families!"""
    )
    result = extractor.process(post)
    assert result["isEvent"] is True
    assert "Meskel Square" in result["location"]["venueName"]
    assert result["location"]["subCity"] == "Kirkos"

# Scenario 6: Non-event Advertisement & Vacancy Rejection
def test_scenario_non_event_rejection(extractor):
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="ad_505",
        publishedAt=datetime(2026, 10, 30, tzinfo=timezone.utc),
        rawText="""የስራ ማስታወቂያ: ሹፌር ይፈለጋል!
ደሞዝ በስምምነት። ያላችሁን CV በቴሌግራም ላኩልን።"""
    )
    result = extractor.process(post)
    assert result["isEvent"] is False

# Scenario 7: Deduplication across Telegram and Instagram
def test_scenario_cross_platform_deduplication(deduplicator):
    telegram_event = {
        "id": "evt-canonical-1",
        "title": "Acoustic Night with Betty G",
        "dates": {"startDate": "2026-11-06"},
        "location": {"venueName": "Atmosphere Addis"}
    }
    instagram_event = {
        "title": "Betty G Live Acoustic at Atmosphere Bole",
        "dates": {"startDate": "2026-11-06"},
        "location": {"venueName": "Atmosphere Addis"}
    }
    match = deduplicator.find_duplicate(instagram_event, [telegram_event])
    assert match is not None
    assert match[2] == "EXACT_DUPLICATE"
    assert match[0]["id"] == "evt-canonical-1"

# Scenario 8: Low Confidence Human Review Trigger
def test_scenario_low_confidence_triggers_review(extractor):
    post = RawPostPayload(
        sourcePlatform=PlatformType.TELEGRAM,
        externalPostId="amb_606",
        publishedAt=datetime(2026, 10, 30, tzinfo=timezone.utc),
        rawText="Meetup coming soon in Addis! Stay tuned for dates."
    )
    result = extractor.process(post)
    # Insufficient signals or missing date should flag review or reject
    if result["isEvent"]:
        assert result["requiresReview"] is True
