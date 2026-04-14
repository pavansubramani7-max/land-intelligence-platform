import pytesseract
from PIL import Image
import io
from typing import Optional
import re


def extract_text_from_image(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image, config="--psm 6")
    return text.strip()


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip()
    except ImportError:
        return extract_text_from_image(pdf_bytes)


def clean_ocr_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s.,;:()\-/]", "", text)
    return text.strip()


def extract_numbers_from_text(text: str) -> list:
    return [float(n.replace(",", "")) for n in re.findall(r"[\d,]+\.?\d*", text)]
