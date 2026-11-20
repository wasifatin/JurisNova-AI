# Evidence-First RAG Architecture
## JurisNova AI — High-Fidelity Retrieval & Citation Verification

---

## 1. RAG Design Philosophy

In enterprise Governance, Risk, and Compliance, a Retrieval-Augmented Generation (RAG) system cannot behave like a casual search engine. Merely retrieving text that "feels relevant" is insufficient:
* The system must know the **exact page number** and **section header** of the clause.
* The system must distinguish between a high-level policy statement and operational implementation proof.
* The system must verify that AI-generated summaries do not misquote the source text.
* The system must protect itself from adversarial prompts concealed in uploaded documents.

---

## 2. Ingestion & Text Extraction

### PDF Document Parsing (`PyMuPDF` / `fitz`):
```python
doc = fitz.open(file_path)
for page_idx in range(len(doc)):
    page = doc[page_idx]
    text = page.get_text("text")
    # Identifies topmost line as section title candidate
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    section_title = lines[0] if lines else f"Page {page_idx + 1}"
```
* **Page Boundary Guarantee:** Page numbers are 1-indexed and anchored directly to the source PDF pages.

### DOCX Parsing (`python-docx`):
Paragraphs are parsed sequentially. Paragraphs with styles beginning with `"Heading"` trigger section boundary transitions, maintaining hierarchical clause structures.

---

## 3. Sliding Window Semantic Chunking

```
  Document Text: [ ... Clause 4.1 ... ] [ ... Clause 4.2 ... ] [ ... Clause 4.3 ... ]
                      ├─── Chunk 0 ───┤
                                ├─── Chunk 1 ───┤ (150 char overlap)
```

* **Chunk Size:** 750 characters.
* **Overlap:** 150 characters.
* **Boundary Alignment:** If a chunk boundary cuts through a word, the chunk end automatically pulls back to the nearest preceding whitespace.

---

## 4. Vector Embedding & Hybrid Retrieval

### Embedding Dimensionality:
Dense 384-dimensional vector space.

### Hybrid Scoring Formula:
For a given query $Q$ and candidate chunk $C$:
$$\text{Score}(Q, C) = 0.65 \cdot \text{CosineSimilarity}(\vec{E}_Q, \vec{E}_C) + 0.35 \cdot \text{KeywordScore}(Q, C)$$
Where:
* $\text{CosineSimilarity}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\|_2 \|\vec{v}\|_2}$
* $\text{KeywordScore}(Q, C) = \frac{|\text{Terms}(Q) \cap \text{Terms}(C)|}{\max(1, |\text{Terms}(Q)|)}$

---

## 5. Automated Citation Verification

Before any finding is marked as `Verified`, the Independent Verification Agent executes `RAGEngine.verify_citation()`:

```python
def verify_citation(claimed_excerpt: str, actual_chunk_text: str) -> Tuple[bool, float, str]:
    norm_claimed = claimed_excerpt.lower().strip()
    norm_actual = actual_chunk_text.lower().strip()

    # Tier 1: Exact Substring Match
    if norm_claimed in norm_actual:
        return True, 1.0, "Exact textual match verified in primary source."

    # Tier 2: Token Overlap Verification
    claimed_words = set(re.findall(r'\b\w{3,}\b', norm_claimed))
    actual_words = set(re.findall(r'\b\w{3,}\b', norm_actual))
    overlap = len(claimed_words.intersection(actual_words)) / len(claimed_words)

    if overlap >= 0.70:
        return True, round(overlap, 2), f"High semantic token overlap ({int(overlap*100)}%) verified."
    elif overlap >= 0.45:
        return True, round(overlap, 2), f"Moderate token overlap ({int(overlap*100)}%) - marked for human review."
    else:
        return False, round(overlap, 2), f"Insufficient textual evidence in cited chunk ({int(overlap*100)}% match). Potential hallucination flagged."
```

---

## 6. Prompt Injection Defense

All retrieved chunks pass through `RAGEngine.sanitize_untrusted_text()`, which strips instruction-override attack vectors before chunks are presented to reasoning agents.
