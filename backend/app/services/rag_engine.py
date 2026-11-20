import re
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.all_models import DocumentChunk, Document, Requirement
from app.services.embedding_service import EmbeddingService

class RAGEngine:
    """
    Evidence-First Retrieval-Augmented Generation Engine with:
    - Hybrid keyword (BM25-style term matching) + Vector Cosine Retrieval
    - Citation Verification & Source Faithfulness Checking
    - Prompt Injection Defense & Data Sanitization
    """

    PROMPT_INJECTION_PATTERNS = [
        r"(?i)ignore\s+(all\s+)?(previous|prior)\s+instructions?",
        r"(?i)system\s+override",
        r"(?i)disregard\s+(all\s+)?rules?",
        r"(?i)you\s+are\s+now\s+an?\s+(dan|jailbreak|unrestricted)",
        r"(?i)sudo\s+mode",
        r"(?i)bypass\s+(all\s+)?compliance",
        r"(?i)act\s+as\s+an\s+unfiltered"
    ]

    @classmethod
    def sanitize_untrusted_text(cls, text: str) -> str:
        """
        Defends against document-based prompt injection by neutralizing injection triggers.
        """
        sanitized = text
        for pattern in cls.PROMPT_INJECTION_PATTERNS:
            sanitized = re.sub(pattern, "[FILTERED_UNTRUSTED_INSTRUCTION]", sanitized)
        # Prevent markdown link or script exploits
        sanitized = sanitized.replace("<script", "&lt;script").replace("javascript:", "")
        return sanitized

    @classmethod
    def hybrid_search(
        cls,
        db: Session,
        query: str,
        org_id: str,
        doc_ids: Optional[List[str]] = None,
        top_k: int = 5,
        vector_weight: float = 0.65,
        keyword_weight: float = 0.35
    ) -> List[Dict[str, Any]]:
        """
        Performs hybrid vector cosine + keyword scoring over document chunks.
        """
        query_embedding = EmbeddingService.generate_embedding(query)
        query_terms = set(re.findall(r'\b\w{3,}\b', query.lower()))

        # Base query for document chunks
        db_query = db.query(DocumentChunk).join(Document, DocumentChunk.document_id == Document.id)\
                     .filter(Document.organization_id == org_id)

        if doc_ids and len(doc_ids) > 0:
            db_query = db_query.filter(DocumentChunk.document_id.in_(doc_ids))

        chunks = db_query.all()
        scored_results = []

        for chunk in chunks:
            # 1. Vector similarity
            chunk_emb = chunk.embedding
            if isinstance(chunk_emb, list) and len(chunk_emb) > 0:
                v_score = EmbeddingService.cosine_similarity(query_embedding, chunk_emb)
            else:
                v_score = 0.0

            # 2. Keyword overlap score
            clean_content = chunk.clean_text or chunk.content
            content_lower = clean_content.lower()
            matching_terms = sum(1 for term in query_terms if term in content_lower)
            k_score = (matching_terms / max(1, len(query_terms))) if query_terms else 0.0

            # Hybrid weighted combination
            combined_score = (v_score * vector_weight) + (k_score * keyword_weight)

            scored_results.append({
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "document_name": chunk.document.title if chunk.document else "Policy Document",
                "page_number": chunk.page_number,
                "section_title": chunk.section_title or f"Page {chunk.page_number}",
                "content": cls.sanitize_untrusted_text(chunk.content),
                "similarity_score": round(float(combined_score), 4),
                "vector_score": round(float(v_score), 4),
                "keyword_score": round(float(k_score), 4),
            })

        # Sort descending by score
        scored_results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_results[:top_k]

    @classmethod
    def verify_citation(cls, claimed_excerpt: str, actual_chunk_text: str) -> Tuple[bool, float, str]:
        """
        Verifies if an AI-generated finding citation is genuinely anchored in the source chunk text.
        Returns: (is_valid, confidence_score, verification_note)
        """
        if not claimed_excerpt or not actual_chunk_text:
            return False, 0.0, "Missing citation or chunk text"

        norm_claimed = re.sub(r'\s+', ' ', claimed_excerpt.lower().strip())
        norm_actual = re.sub(r'\s+', ' ', actual_chunk_text.lower().strip())

        # Exact substring match
        if norm_claimed in norm_actual:
            return True, 1.0, "Exact textual match verified in primary source."

        # Token overlap verification
        claimed_words = set(re.findall(r'\b\w{3,}\b', norm_claimed))
        actual_words = set(re.findall(r'\b\w{3,}\b', norm_actual))

        if not claimed_words:
            return False, 0.0, "Claimed excerpt contained no valid keywords."

        intersection = claimed_words.intersection(actual_words)
        overlap_ratio = len(intersection) / len(claimed_words)

        if overlap_ratio >= 0.70:
            return True, round(overlap_ratio, 2), f"High semantic token overlap ({int(overlap_ratio * 100)}%) verified."
        elif overlap_ratio >= 0.45:
            return True, round(overlap_ratio, 2), f"Moderate token overlap ({int(overlap_ratio * 100)}%) - marked for human review."
        else:
            return False, round(overlap_ratio, 2), f"Insufficient textual evidence in cited chunk ({int(overlap_ratio * 100)}% match). Potential hallucination flagged."
