import pytest
from datetime import date
from app.ai.date_normalizer import EthiopianCalendar, EthiopianDateNormalizer

def test_ethiopian_to_gregorian_known_dates():
    cal = EthiopianCalendar()
    
    # Meskerem 1, 2016 EC -> Sept 12, 2023 GC
    g1 = cal.to_gregorian(2016, 1, 1)
    assert g1 == date(2023, 9, 12)

    # Meskerem 1, 2017 EC -> Sept 11, 2024 GC
    g2 = cal.to_gregorian(2017, 1, 1)
    assert g2 == date(2024, 9, 11)

    # Megabit 15, 2018 EC -> March 24, 2026 GC
    g3 = cal.to_gregorian(2018, 7, 15)
    assert g3 == date(2026, 3, 24)

def test_gregorian_to_ethiopian_bi_directional():
    cal = EthiopianCalendar()
    # Sept 11, 2024 GC -> Meskerem 1, 2017 EC
    ey, em, ed = cal.from_gregorian(date(2024, 9, 11))
    assert (ey, em, ed) == (2017, 1, 1)

def test_amharic_date_expression_parsing():
    normalizer = EthiopianDateNormalizer()
    res = normalizer.normalize_date_expression("ዓርብ መጋቢት 15, 2018 ዓ.ም ልዩ ዝግጅት")
    assert res["detectedCalendar"] == "ETHIOPIAN"
    assert res["isoDate"] == "2026-03-24"

def test_english_ethiopian_month_parsing():
    normalizer = EthiopianDateNormalizer()
    res = normalizer.normalize_date_expression("Event on Megabit 15, 2018 at Atmosphere")
    assert res["detectedCalendar"] == "ETHIOPIAN"
    assert res["isoDate"] == "2026-03-24"

def test_ethiopian_time_parsing():
    normalizer = EthiopianDateNormalizer()
    
    # ጠዋት 12:00 -> 06:00:00 (Dawn)
    t1 = normalizer.normalize_time_expression("ከጠዋቱ 12:00 ጀምሮ")
    assert t1 == "06:00:00"

    # ከጠዋቱ 3:00 -> 09:00:00
    t2 = normalizer.normalize_time_expression("ጠዋት 3:00")
    assert t2 == "09:00:00"

    # ከሰዓት 8:30 -> 14:30:00 (2:30 PM)
    t3 = normalizer.normalize_time_expression("ከሰዓት 8:30 ጀምሮ")
    assert t3 == "14:30:00"

    # ከምሽቱ 1:00 -> 19:00:00 (7:00 PM)
    t4 = normalizer.normalize_time_expression("ከምሽቱ 1:00")
    assert t4 == "19:00:00"

    # Standard PM time
    t5 = normalizer.normalize_time_expression("Doors open at 6:00 PM")
    assert t5 == "18:00:00"
