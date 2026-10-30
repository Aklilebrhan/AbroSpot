import re
import logging
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime

from app.schemas.ingestion import RawPostPayload
from app.ai.date_normalizer import EthiopianDateNormalizer
from app.ai.location_resolver import AddisAbabaLocationResolver

logger = logging.getLogger("abrospot.extractor")

class EventExtractor:
    """Multilingual AI extraction engine converting unstructured social posts to structured events."""

    EVENT_SIGNALS = [
        "event", "concert", "workshop", "summit", "conference", "party", "exhibition",
        "live music", "expo", "festival", "bazaar", "meetup", "hackathon", "panel discussion",
        "doors open", "entrance", "admission", "entry fee", "tickets at", "rsvp",
        "ዝግጅት", "ኮንሰርት", "አውደ-ርዕይ", "ስልጠና", "ጉባኤ", "ምሽት", "ባዛር", "መግቢያ", "የመግቢያ ዋጋ"
    ]

    NON_EVENT_SIGNALS = [
        "job vacancy", "we are hiring", "urgent vacancy", "house for rent", "car for sale",
        "የስራ ማስታወቂያ", "የኪራይ ቤት", "መኪና ሽያጭ", "የስራ ዕድል", "salary", "cv to"
    ]

    CATEGORY_KEYWORDS = {
        "technology": ["tech", "coding", "flutter", "python", "ai", "cloud", "developer", "hackathon", "software", "devfest", "google", "fintech", "ሮቦቲክስ", "ቴክኖሎጂ"],
        "music": ["music", "concert", "acoustic", "dj", "band", "live", "jazz", "singer", "pop", "ዘፈን", "ሙዚቃ", "አዝማሪ", "ኮንሰርት"],
        "art-culture": ["art", "gallery", "culture", "painting", "poetry", "theatre", "exhibit", "film", "screening", "ባህል", "ኪነ-ጥበብ", "ግጥም", "ቲያትር"],
        "business": ["business", "networking", "startup", "investor", "pitch", "entrepreneur", "trade", "ንግድ", "ስራ ፈጠራ"],
        "education": ["workshop", "training", "masterclass", "course", "lecture", "bootcamp", "learn", "ስልጠና", "ትምህርት"],
        "community": ["bazaar", "market", "community", "charity", "makers", "artisan", "ባዛር", "ገበያ"],
        "conferences": ["conference", "summit", "symposium", "forum", "annual meeting", "ጉባኤ", "ሲምፖዚየም"],
        "sports": ["marathon", "run", "fitness", "football", "tournament", "yoga", "ስፖርት", "ሩጫ"],
        "entertainment": ["nightlife", "party", "club", "happy hour", "karaoke", "comedy", "መዝናኛ"]
    }

    def __init__(self):
        self.date_normalizer = EthiopianDateNormalizer()
        self.location_resolver = AddisAbabaLocationResolver()

    def classify_is_event(self, text: str) -> Tuple[bool, float, str]:
        text_lower = text.lower()

        # Check negative signals
        non_event_hits = sum(1 for s in self.NON_EVENT_SIGNALS if s in text_lower)
        if non_event_hits >= 2:
            return False, 0.20, "Contains strong non-event signals (job vacancy / commercial ad)"

        # Check positive signals
        event_hits = sum(1 for s in self.EVENT_SIGNALS if s in text_lower)
        
        # Check date/time markers
        has_time = any(w in text_lower for w in ["pm", "am", ":00", "ከሰዓት", "ከጠዋቱ", "ከምሽቱ", "ሰዓት"])
        has_location = any(w in text_lower for w in ["at", "venue", "location", "ቦታ", "አድራሻ", "hall", "center", "hotel"])

        score = 0.50
        if event_hits > 0:
            score += min(event_hits * 0.15, 0.35)
        if has_time:
            score += 0.10
        if has_location:
            score += 0.10

        is_event = score >= 0.70
        return is_event, min(score, 0.99), "Event signals detected" if is_event else "Insufficient event signals"

    def extract_category(self, text: str) -> str:
        text_lower = text.lower()
        scores = {}
        for cat, keywords in self.CATEGORY_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            if matches > 0:
                scores[cat] = matches

        if scores:
            return max(scores, key=scores.get)
        return "other"

    def extract_pricing(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        if any(w in text_lower for w in ["free admission", "free entry", "no entrance fee", "free", "ነፃ", "መግቢያው ነፃ"]):
            return {"isFree": True, "priceAmount": 0.0, "currency": "ETB", "ticketUrl": None}

        # Match ETB or Birr amounts
        birr_match = re.search(r'\b(\d{2,5})\s*(?:etb|birr|ብር)\b', text_lower)
        if birr_match:
            amount = float(birr_match.group(1))
            return {"isFree": False, "priceAmount": amount, "currency": "ETB", "ticketUrl": None}

        # Ticket link
        ticket_match = re.search(r'(https?://[^\s]+(?:ticket|eventbrite|chapa|telebirr|t\.me)[^\s]*)', text)
        ticket_url = ticket_match.group(1) if ticket_match else None

        return {"isFree": False, "priceAmount": None, "currency": "ETB", "ticketUrl": ticket_url}

    def extract_title(self, text: str) -> str:
        lines = [line.strip() for line in text.strip().split("\n") if line.strip()]
        if not lines:
            return "Untitled Event"

        # The first substantial line is often the headline/title
        for line in lines:
            clean = re.sub(r'^[🎨🚀🎉📢🔥✨👉\s]+', '', line).strip()
            if len(clean) > 5 and not clean.startswith("http"):
                return clean[:120]

        return lines[0][:120]

    def process(self, raw_post: RawPostPayload, ocr_text: Optional[str] = None) -> Dict[str, Any]:
        combined_text = f"{raw_post.rawText or ''}\n{ocr_text or ''}".strip()
        is_event, confidence, reason = self.classify_is_event(combined_text)

        if not is_event:
            return {
                "isEvent": False,
                "confidence": confidence,
                "reason": reason,
                "data": None
            }

        title = self.extract_title(combined_text)
        category = self.extract_category(combined_text)
        date_info = self.date_normalizer.normalize_date_expression(
            combined_text, reference_date=raw_post.publishedAt
        )
        time_iso = self.date_normalizer.normalize_time_expression(combined_text)
        location = self.location_resolver.resolve(combined_text)
        pricing = self.extract_pricing(combined_text)

        missing_fields = []
        if not date_info["isoDate"]:
            missing_fields.append("startDate")
        if not location["venueName"]:
            missing_fields.append("venue")
        if not time_iso:
            missing_fields.append("startTime")

        requires_review = bool(
            len(missing_fields) > 1 or
            confidence < 0.80 or
            date_info["assumedYear"]
        )

        return {
            "isEvent": True,
            "confidence": confidence,
            "title": title,
            "category": category,
            "summary": combined_text[:280] if len(combined_text) > 280 else combined_text,
            "dates": {
                "startDate": date_info["isoDate"],
                "endDate": None,
                "startTime": time_iso,
                "endTime": None,
                "timezone": "Africa/Addis_Ababa",
                "detectedCalendar": date_info["detectedCalendar"],
                "originalExpression": date_info["originalExpression"]
            },
            "location": location,
            "pricing": pricing,
            "organizer": {
                "name": raw_post.channelOrAccountName or raw_post.authorUsername,
                "contact": None
            },
            "missingFields": missing_fields,
            "requiresReview": requires_review,
            "reviewReason": "LOW_CONFIDENCE" if confidence < 0.80 else ("DATE_AMBIGUITY" if date_info["assumedYear"] else None)
        }
