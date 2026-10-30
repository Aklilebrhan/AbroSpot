import re
from typing import Optional, Dict, Any, List

class AddisAbabaLocationResolver:
    """Specialized geographic and landmark resolver for Addis Ababa event announcements."""

    SUB_CITIES = {
        "bole": {"name": "Bole", "nameAmharic": "ቦሌ"},
        "kirkos": {"name": "Kirkos", "nameAmharic": "ቂርቆስ"},
        "yeka": {"name": "Yeka", "nameAmharic": "የካ"},
        "arada": {"name": "Arada", "nameAmharic": "አራዳ"},
        "lideta": {"name": "Lideta", "nameAmharic": "ልደታ"},
        "nifas silk": {"name": "Nifas Silk-Lafto", "nameAmharic": "ንፋስ ስልክ ላፍቶ"},
        "lafto": {"name": "Nifas Silk-Lafto", "nameAmharic": "ንፋስ ስልክ ላፍቶ"},
        "gullele": {"name": "Gullele", "nameAmharic": "ጉለሌ"},
        "akaki": {"name": "Akaki Kality", "nameAmharic": "አቃቂ ቃሊቲ"},
        "kolfe": {"name": "Kolfe Keranio", "nameAmharic": "ኮልፌ ቀራኒዮ"},
        "addis ketema": {"name": "Addis Ketema", "nameAmharic": "አዲስ ከተማ"},
        "lemi kura": {"name": "Lemi Kura", "nameAmharic": "ለሚ ኩራ"},
    }

    # Popular venues with known metadata
    KNOWN_VENUES: List[Dict[str, Any]] = [
        {
            "venueName": "Atmosphere Addis",
            "aliases": ["atmosphere", "አትሞስፊየር", "atmosphere addis"],
            "subCity": "Bole",
            "landmark": "Behind Edna Mall",
            "latitude": 8.9984,
            "longitude": 38.7852
        },
        {
            "venueName": "Addis Ababa Exhibition Center",
            "aliases": ["exhibition center", "ኤግዚቢሽን ማዕከል", "meskel square exhibition"],
            "subCity": "Kirkos",
            "landmark": "Meskel Square",
            "latitude": 9.0105,
            "longitude": 38.7618
        },
        {
            "venueName": "Millennium Hall",
            "aliases": ["millennium hall", "ሚሊኒየም አዳራሽ", "millenium hall"],
            "subCity": "Bole",
            "landmark": "Bole Airport Road",
            "latitude": 8.9892,
            "longitude": 38.7891
        },
        {
            "venueName": "Fendika Cultural Center",
            "aliases": ["fendika", "ፈንዲካ", "fendika azmari bet"],
            "subCity": "Kirkos",
            "landmark": "Kazanchis",
            "latitude": 9.0175,
            "longitude": 38.7712
        },
        {
            "venueName": "Alliance Ethio-Française",
            "aliases": ["alliance ethio-française", "alliance ethio francaise", "አሊያንስ ፍራንሴዝ", "alliance"],
            "subCity": "Arada",
            "landmark": "Near Churchill Road / Piassa",
            "latitude": 9.0305,
            "longitude": 38.7521
        },
        {
            "venueName": "Goethe-Institut Addis Ababa",
            "aliases": ["goethe", "goethe institut", "ጌተ ኢንስቲትዩት"],
            "subCity": "Yeka",
            "landmark": "4 Kilo / Behind Holy Trinity",
            "latitude": 9.0332,
            "longitude": 38.7634
        },
        {
            "venueName": "ALX Capstone Hub (Lideta)",
            "aliases": ["alx hub", "alx lideta", "alx capstone", "alx ethiopia hub"],
            "subCity": "Lideta",
            "landmark": "Lideta Commerce Area",
            "latitude": 9.0145,
            "longitude": 38.7423
        },
        {
            "venueName": "Ethiopian Skylight Hotel",
            "aliases": ["skylight", "skylight hotel", "ስካይላይት ሆቴል"],
            "subCity": "Bole",
            "landmark": "Near Bole International Airport",
            "latitude": 8.9876,
            "longitude": 38.7915
        }
    ]

    # Major Addis Landmarks mapped to Sub-Cities
    LANDMARKS_TO_SUBCITY = {
        "meskel square": "Kirkos",
        "edna mall": "Bole",
        "kazanchis": "Kirkos",
        "sarbet": "Kirkos",
        "piassa": "Arada",
        "churchill road": "Arada",
        "megenagna": "Yeka",
        "mexico": "Lideta",
        "cmc": "Yeka",
        "4 kilo": "Yeka",
        "6 kilo": "Yeka",
        "bole medhanialem": "Bole",
        "bole atlas": "Bole",
        "hayahulet": "Bole",
        "22 mazoria": "Bole",
        "gerji": "Bole",
        "jomo": "Nifas Silk-Lafto",
        "torhailoch": "Lideta"
    }

    def resolve(self, text: str) -> Dict[str, Any]:
        """Extract venue, sub-city, and landmarks from unstructured announcement text."""
        text_lower = text.lower()
        result = {
            "venueName": None,
            "city": "Addis Ababa",
            "subCity": None,
            "landmark": None,
            "latitude": None,
            "longitude": None,
            "isVirtual": False
        }

        # Check virtual
        if any(v in text_lower for v in ["zoom", "google meet", "online event", "virtual meetup", "livestream"]):
            result["isVirtual"] = True
            result["venueName"] = "Online / Virtual Event"
            return result

        # 1. Match known venues
        for v in self.KNOWN_VENUES:
            for alias in v["aliases"]:
                if alias in text_lower:
                    result["venueName"] = v["venueName"]
                    result["subCity"] = v["subCity"]
                    result["landmark"] = v["landmark"]
                    result["latitude"] = v["latitude"]
                    result["longitude"] = v["longitude"]
                    return result

        # 2. Match sub-city directly
        for key, sc in self.SUB_CITIES.items():
            if key in text_lower or sc["nameAmharic"] in text:
                result["subCity"] = sc["name"]
                break

        # 3. Match landmarks and infer sub-city if not already set
        for lm, sc_name in self.LANDMARKS_TO_SUBCITY.items():
            if lm in text_lower:
                result["landmark"] = lm.title()
                if not result["subCity"]:
                    result["subCity"] = sc_name
                break

        # 4. Venue extraction via heuristic patterns
        # e.g. "at [Venue Name]" or "ቦታ፡ [Venue Name]"
        at_match = re.search(r'\b(?:at|venue|location|ቦታ|አድራሻ)[\s:–-]+([A-Z][A-Za-z0-9\s&\'\.-]{2,40})', text)
        if at_match and not result["venueName"]:
            cand = at_match.group(1).strip().split("\n")[0].split(".")[0].split(",")[0]
            if len(cand) > 3 and cand.lower() not in ["addis ababa", "ethiopia", "amharic"]:
                result["venueName"] = cand

        if not result["venueName"] and result["landmark"]:
            result["venueName"] = f"Venue around {result['landmark']}"

        return result
