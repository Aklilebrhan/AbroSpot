from typing import List, Dict, Any, Optional, Tuple
from rapidfuzz import fuzz

class EventDeduplicator:
    """Calculates multi-factor similarity between event records to resolve duplicates."""

    def __init__(self, match_threshold: float = 0.85, review_threshold: float = 0.65):
        self.match_threshold = match_threshold
        self.review_threshold = review_threshold

    def calculate_similarity(
        self, candidate: Dict[str, Any], existing: Dict[str, Any]
    ) -> Tuple[float, Dict[str, float]]:
        """Calculate weighted score between 0.0 and 1.0 based on Title, Date, and Location."""
        
        # 1. Title Similarity (0 - 100) -> normalize to 0.0 - 1.0
        title_cand = (candidate.get("title") or "").lower()
        title_exist = (existing.get("title") or "").lower()
        title_ratio = fuzz.token_set_ratio(title_cand, title_exist) / 100.0

        # 2. Date Match (Binary or Distance)
        date_cand = candidate.get("dates", {}).get("startDate") or candidate.get("startDate")
        date_exist = existing.get("dates", {}).get("startDate") or existing.get("startDate")
        
        date_score = 0.0
        if date_cand and date_exist:
            if str(date_cand) == str(date_exist):
                date_score = 1.0
            else:
                date_score = 0.0
        else:
            # If dates are missing, neutrality penalty
            date_score = 0.3

        # 3. Location / Venue Similarity
        venue_cand = (candidate.get("location", {}).get("venueName") or candidate.get("venue") or "").lower()
        venue_exist = (existing.get("location", {}).get("venueName") or existing.get("venue") or "").lower()
        
        venue_score = 0.0
        if venue_cand and venue_exist:
            venue_score = fuzz.token_set_ratio(venue_cand, venue_exist) / 100.0
        else:
            venue_score = 0.4

        # Weighted calculation
        total_score = (title_ratio * 0.45) + (date_score * 0.35) + (venue_score * 0.20)

        metrics = {
            "titleScore": title_ratio,
            "dateScore": date_score,
            "venueScore": venue_score,
            "totalScore": round(total_score, 4)
        }
        return round(total_score, 4), metrics

    def find_duplicate(
        self, candidate: Dict[str, Any], existing_events: List[Dict[str, Any]]
    ) -> Optional[Tuple[Dict[str, Any], float, str]]:
        """Find best matching existing canonical event."""
        best_match = None
        best_score = 0.0

        for existing in existing_events:
            score, _ = self.calculate_similarity(candidate, existing)
            if score > best_score:
                best_score = score
                best_match = existing

        if best_match and best_score >= self.match_threshold:
            return best_match, best_score, "EXACT_DUPLICATE"
        elif best_match and best_score >= self.review_threshold:
            return best_match, best_score, "POSSIBLE_DUPLICATE"

        return None
