import spacy
from typing import Dict, List, Optional
import re

_nlp: Optional[spacy.language.Language] = None


def get_nlp() -> spacy.language.Language:
    global _nlp
    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except OSError:
            from spacy.lang.en import English
            _nlp = English()
    return _nlp


def extract_entities(text: str) -> Dict[str, List[str]]:
    nlp = get_nlp()
    doc = nlp(text)
    entities: Dict[str, List[str]] = {
        "persons": [],
        "dates": [],
        "monetary_values": [],
        "locations": [],
        "organizations": [],
    }
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            entities["persons"].append(ent.text)
        elif ent.label_ in ("DATE", "TIME"):
            entities["dates"].append(ent.text)
        elif ent.label_ == "MONEY":
            entities["monetary_values"].append(ent.text)
        elif ent.label_ in ("GPE", "LOC"):
            entities["locations"].append(ent.text)
        elif ent.label_ == "ORG":
            entities["organizations"].append(ent.text)
    return entities


def extract_area_mentions(text: str) -> List[float]:
    patterns = [
        r"(\d[\d,]*\.?\d*)\s*(?:sq\.?\s*ft|square\s*feet|sqft)",
        r"(\d[\d,]*\.?\d*)\s*(?:acres?|hectares?)",
    ]
    areas = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        areas.extend([float(m.replace(",", "")) for m in matches])
    return areas


def extract_monetary_values(text: str) -> List[float]:
    patterns = [
        r"(?:rs\.?|inr|₹|\$)\s*(\d[\d,]*\.?\d*)",
        r"(\d[\d,]*\.?\d*)\s*(?:lakhs?|crores?|millions?)",
    ]
    values = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        values.extend([float(m.replace(",", "")) for m in matches])
    return values


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    return text.strip()
