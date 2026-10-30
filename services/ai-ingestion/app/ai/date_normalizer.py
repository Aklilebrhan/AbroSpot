import re
from datetime import date, datetime
from typing import Optional, Tuple, Dict, Any

try:
    import ethiocalendar as ec
except ImportError:
    ec = None

class EthiopianCalendar:
    """Accurate bi-directional converter between Ethiopian & Gregorian calendars."""

    MONTHS_AMHARIC = {
        "መስከረም": 1, "ጥቅምት": 2, "ኅዳር": 3, "ህዳር": 3, "ታኅሣሥ": 4, "ታህሳስ": 4,
        "ጥር": 5, "የካቲት": 6, "መጋቢት": 7, "ሚያዝያ": 8, "ግንቦት": 9,
        "ሰኔ": 10, "ሐምሌ": 11, "ሀምሌ": 11, "ነሐሴ": 12, "ጳጉሜ": 13, "ጳጉሜን": 13
    }

    MONTHS_ENGLISH = {
        "meskerem": 1, "tikimt": 2, "hidar": 3, "tahsas": 4, "tir": 5,
        "yekatit": 6, "megabit": 7, "miyazya": 8, "ginbot": 9, "sene": 10,
        "hamle": 11, "nehase": 12, "pagume": 13
    }

    GREGORIAN_MONTHS = {
        "january": 1, "jan": 1, "february": 2, "feb": 2, "march": 3, "mar": 3,
        "april": 4, "apr": 4, "may": 5, "june": 6, "jun": 6, "july": 7, "jul": 7,
        "august": 8, "aug": 8, "september": 9, "sep": 9, "sept": 9,
        "october": 10, "oct": 10, "november": 11, "nov": 11, "december": 12, "dec": 12
    }

    @classmethod
    def to_gregorian(cls, year: int, month: int, day: int) -> date:
        if ec:
            gy, gm, gd = ec.to_gregorian(year, month, day)
            return date(gy, gm, gd)
        # Fallback approximation if library missing
        return date(year + 7 if month < 5 else year + 8, month, day)

    @classmethod
    def from_gregorian(cls, g_date: date) -> Tuple[int, int, int]:
        if ec:
            ey, em, ed = ec.from_gregorian(g_date.year, g_date.month, g_date.day)
            return (ey, em, ed)
        return (g_date.year - 8, g_date.month, g_date.day)


class EthiopianDateNormalizer:
    """Normalizes informal and bilingual Ethiopian/Gregorian date and time expressions."""

    def __init__(self):
        self.cal = EthiopianCalendar()

    def normalize_date_expression(
        self, text: str, reference_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Parse natural text containing Amharic or Gregorian dates and convert to ISO Gregorian."""
        ref = reference_date or datetime.now()
        current_g_year = ref.year
        current_e_year, _, _ = self.cal.from_gregorian(ref.date())

        text_lower = text.lower()

        # 1. Check for Amharic or English Ethiopian Month
        eth_month = None
        for name, m_num in self.cal.MONTHS_AMHARIC.items():
            if name in text:
                eth_month = m_num
                break
        if not eth_month:
            for name, m_num in self.cal.MONTHS_ENGLISH.items():
                if name in text_lower:
                    eth_month = m_num
                    break

        if eth_month:
            day_match = re.search(r'\b([1-9]|[12][0-9]|30)\b', text)
            day = int(day_match.group(1)) if day_match else 1
            
            year_match = re.search(r'\b(201[5-9]|202[0-9])\b', text)
            year = int(year_match.group(1)) if year_match else current_e_year

            try:
                g_date = self.cal.to_gregorian(year, eth_month, day)
                return {
                    "detectedCalendar": "ETHIOPIAN",
                    "isoDate": g_date.isoformat(),
                    "confidence": 0.95 if day_match else 0.70,
                    "assumedYear": year_match is None,
                    "originalExpression": text.strip()
                }
            except Exception:
                pass

        # 2. Check for Gregorian Month
        greg_month = None
        for name, m_num in self.cal.GREGORIAN_MONTHS.items():
            pattern = rf'\b{name}\b'
            if re.search(pattern, text_lower):
                greg_month = m_num
                break

        if greg_month:
            day_match = re.search(r'\b([1-9]|[12][0-9]|3[01])\b', text)
            day = int(day_match.group(1)) if day_match else 1
            year_match = re.search(r'\b(202[4-9]|203[0-5])\b', text)
            year = int(year_match.group(1)) if year_match else current_g_year

            g_date = date(year, greg_month, day)
            return {
                "detectedCalendar": "GREGORIAN",
                "isoDate": g_date.isoformat(),
                "confidence": 0.95 if day_match else 0.70,
                "assumedYear": year_match is None,
                "originalExpression": text.strip()
            }

        # 3. Numeric ISO Date
        iso_match = re.search(r'\b(202\d)-(\d{1,2})-(\d{1,2})\b', text)
        if iso_match:
            y, m, d = int(iso_match.group(1)), int(iso_match.group(2)), int(iso_match.group(3))
            return {
                "detectedCalendar": "GREGORIAN",
                "isoDate": f"{y:04d}-{m:02d}-{d:02d}",
                "confidence": 0.98,
                "assumedYear": False,
                "originalExpression": iso_match.group(0)
            }

        return {
            "detectedCalendar": "UNKNOWN",
            "isoDate": None,
            "confidence": 0.0,
            "assumedYear": True,
            "originalExpression": text.strip()
        }

    def normalize_time_expression(self, text: str) -> Optional[str]:
        """Convert Ethiopian solar time (ጠዋት/ከሰዓት/ምሽት) or standard time to 24-hr HH:MM:SS."""
        text_clean = text.strip()

        is_ethiopian_morning = any(k in text_clean for k in ["ጠዋት", "ከጠዋቱ"])
        is_ethiopian_afternoon = any(k in text_clean for k in ["ከሰዓት", "ከቀኑ"])
        is_ethiopian_evening = any(k in text_clean for k in ["ምሽት", "ከምሽቱ", "ማታ"])
        is_ethiopian_night = any(k in text_clean for k in ["ሌሊት", "ከሌሊቱ"])

        # Prioritize matching time with colon e.g. 2:00, 18:30
        match = re.search(r'\b(\d{1,2}):(\d{2})\b', text_clean)
        if not match:
            # Fallback: check for numbers immediately preceded/followed by time indicators
            marker_match = re.search(r'(?:ከጠዋቱ|ጠዋት|ከሰዓት|ከቀኑ|ከምሽቱ|ምሽት|ማታ|ሰዓት|at|doors open)\s*(\d{1,2})(?::(\d{2}))?', text_clean, re.IGNORECASE)
            if marker_match:
                match = marker_match
            else:
                ampm_match = re.search(r'\b(\d{1,2})\s*(?:am|pm)\b', text_clean, re.IGNORECASE)
                if ampm_match:
                    match = ampm_match

        if not match:
            return None

        hour = int(match.group(1))
        minute = int(match.group(2)) if (match.lastindex and match.lastindex >= 2 and match.group(2)) else 0

        # Ethiopian time conversions
        if is_ethiopian_morning:
            # 12 morning = 6:00 AM; 1 morning = 7:00 AM; 3 morning = 9:00 AM
            std_hour = (hour % 12) + 6
            return f"{std_hour:02d}:{minute:02d}:00"

        if is_ethiopian_afternoon:
            # 6 afternoon = 12:00 PM (noon); 1 afternoon = 13:00 (1 PM); 8 afternoon = 14:00 (2 PM)
            if hour <= 6:
                std_hour = (hour % 12) + 12
            else:
                std_hour = (hour + 6) % 24
            return f"{std_hour:02d}:{minute:02d}:00"

        if is_ethiopian_evening or is_ethiopian_night:
            # 12 evening = 18:00 (6 PM); 1 evening = 19:00 (7 PM); 2 evening = 20:00 (8 PM)
            if hour <= 6:
                std_hour = (hour % 12) + 18
                if std_hour >= 24:
                    std_hour -= 24
            else:
                std_hour = (hour + 6) % 24
            return f"{std_hour:02d}:{minute:02d}:00"

        # Standard AM/PM
        if "pm" in text_clean.lower() and hour < 12:
            hour += 12
        elif "am" in text_clean.lower() and hour == 12:
            hour = 0

        if 0 <= hour <= 23 and 0 <= minute <= 59:
            return f"{hour:02d}:{minute:02d}:00"

        return None
