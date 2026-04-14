import pytest
from app.utils.ocr_utils import clean_ocr_text, extract_numbers_from_text
from app.utils.nlp_utils import extract_area_mentions, extract_monetary_values


def test_clean_ocr_text():
    raw = "  This  is   a   test   document  "
    cleaned = clean_ocr_text(raw)
    assert "  " not in cleaned
    assert cleaned == cleaned.strip()


def test_extract_numbers():
    text = "The area is 1,500 sqft and price is 2500000"
    numbers = extract_numbers_from_text(text)
    assert 1500.0 in numbers
    assert 2500000.0 in numbers


def test_extract_area_mentions():
    text = "The property measures 2500 sq ft and 0.5 acres"
    areas = extract_area_mentions(text)
    assert len(areas) >= 1
    assert 2500.0 in areas


def test_extract_monetary_values():
    text = "Sale price: Rs. 50,00,000 and market value ₹ 45,00,000"
    values = extract_monetary_values(text)
    assert len(values) >= 1
