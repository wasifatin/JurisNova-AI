# Testing & Quality Assurance Protocols
## JurisNova AI — Verification & Validation Manual

---

## 1. QA Philosophy

In compliance intelligence, false positives lead to wasted engineering hours, while false negatives (missed gaps) lead to regulatory sanctions and security breaches. Testing must verify both technical availability and evidentiary rigor.

---

## 2. Test Suite Architecture

```
backend/tests/
├── test_api_health.py        # Validates API routes and JWT authentication
├── test_document_parser.py   # Tests PyMuPDF and python-docx text extraction
├── test_rag_retrieval.py     # Tests hybrid vector search and cosine similarity
├── test_agent_graph.py       # Executes LangGraph workflow and verifies state transitions
└── test_injection_defense.py # Tests regex/AST prompt injection sanitization
```

---

## 3. Running Automated Tests

```bash
cd backend
$env:PYTHONPATH="." # Windows PowerShell
pytest tests/ -v
```

### Key Automated Verification Checks:
1. **Document Extraction Check:** Ensures page numbers are correctly preserved and not zero-indexed.
2. **Citation Accuracy Check:** Tests that text excerpts cited in findings genuinely match the source chunk.
3. **Risk Scoring Consistency Check:** Asserts that Likelihood $L \in [1, 5]$ and Impact $I \in [1, 5]$ result in Score $S = L \times I$ with correct severity categorizations.
4. **Prompt Injection Rejection:** Tests known adversarial payloads (`"ignore instructions"`, `"DAN"`, `<script>` tags) and asserts that sanitized outputs neutralize execution vectors.
5. **Human Gate Enforcement:** Asserts that multi-agent investigations leave `human_review_required = True` and findings in `Pending` state.

---

## 4. Frontend Type Checking & Build Verification

```bash
cd frontend
npm run build
```
The Next.js build validates all 16 pages, TypeScript type signatures, App Router parameters, and static route generation.
