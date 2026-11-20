import os
import re
from typing import List, Dict, Any, Tuple
import fitz  # PyMuPDF
import docx

class DocumentProcessor:
    """
    Extracts text, normalizes content, identifies headings and pages,
    and produces structured chunks preserving page and section references.
    """

    @staticmethod
    def extract_from_pdf(file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts pages from PDF using PyMuPDF, preserving page numbers.
        """
        pages_data = []
        doc = fitz.open(file_path)
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            text = page.get_text("text")
            # Try to identify top heading
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            section_title = lines[0] if lines else f"Section Page {page_idx + 1}"
            pages_data.append({
                "page_number": page_idx + 1,
                "text": text,
                "section_title": section_title[:100]
            })
        doc.close()
        return pages_data

    @staticmethod
    def extract_from_docx(file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts text from DOCX, detecting heading levels as section boundaries.
        """
        doc = docx.Document(file_path)
        sections = []
        current_section = "General Overview"
        current_text = []
        estimated_page = 1
        para_count = 0

        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue
            para_count += 1
            if para.style.name.startswith("Heading"):
                if current_text:
                    sections.append({
                        "page_number": estimated_page,
                        "text": "\n".join(current_text),
                        "section_title": current_section
                    })
                    current_text = []
                current_section = text
            else:
                current_text.append(text)

            if para_count % 15 == 0:
                estimated_page += 1

        if current_text:
            sections.append({
                "page_number": estimated_page,
                "text": "\n".join(current_text),
                "section_title": current_section
            })

        return sections

    @staticmethod
    def extract_from_txt(file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts text from plain text files, splitting into logical segments.
        """
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        pages = []
        chunk_size = 4
        for i in range(0, len(paragraphs), chunk_size):
            group = paragraphs[i:i+chunk_size]
            first_line = group[0].split("\n")[0]
            pages.append({
                "page_number": (i // chunk_size) + 1,
                "text": "\n\n".join(group),
                "section_title": first_line[:80]
            })

        if not pages:
            pages.append({
                "page_number": 1,
                "text": content,
                "section_title": "Document Content"
            })
        return pages

    @classmethod
    def process_file(cls, file_path: str, file_type: str) -> List[Dict[str, Any]]:
        ext = file_type.lower().replace(".", "")
        if ext == "pdf":
            return cls.extract_from_pdf(file_path)
        elif ext in ["docx", "doc"]:
            return cls.extract_from_docx(file_path)
        elif ext in ["txt", "md", "csv"]:
            return cls.extract_from_txt(file_path)
        else:
            # Fallback to plain text read
            return cls.extract_from_txt(file_path)

    @staticmethod
    def normalize_text(text: str) -> str:
        # Replace multiple spaces with single space, fix hyphenated line breaks
        text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
        text = re.sub(r'[ \t]+', ' ', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()

    @classmethod
    def chunk_document(
        cls, 
        pages: List[Dict[str, Any]], 
        chunk_size_chars: int = 750, 
        overlap_chars: int = 150
    ) -> List[Dict[str, Any]]:
        """
        Splits extracted pages into semantic chunks while preserving exact page numbers,
        section headings, and token estimations.
        """
        chunks = []
        chunk_idx = 0

        for page_data in pages:
            raw_text = page_data["text"]
            cleaned = cls.normalize_text(raw_text)
            page_num = page_data["page_number"]
            sec_title = page_data.get("section_title", f"Page {page_num}")

            if len(cleaned) <= chunk_size_chars:
                if cleaned:
                    chunks.append({
                        "chunk_index": chunk_idx,
                        "content": cleaned,
                        "clean_text": cleaned,
                        "page_number": page_num,
                        "section_title": sec_title,
                        "token_count": len(cleaned.split())
                    })
                    chunk_idx += 1
            else:
                # Sliding window chunking with word boundary respect
                start = 0
                while start < len(cleaned):
                    end = min(start + chunk_size_chars, len(cleaned))
                    # Align end to last space if possible
                    if end < len(cleaned):
                        last_space = cleaned.rfind(" ", start, end)
                        if last_space > start + (chunk_size_chars // 2):
                            end = last_space

                    slice_text = cleaned[start:end].strip()
                    if slice_text:
                        chunks.append({
                            "chunk_index": chunk_idx,
                            "content": slice_text,
                            "clean_text": slice_text,
                            "page_number": page_num,
                            "section_title": sec_title,
                            "token_count": len(slice_text.split())
                        })
                        chunk_idx += 1

                    if end >= len(cleaned):
                        break
                    start = max(start + 1, end - overlap_chars)

        return chunks
