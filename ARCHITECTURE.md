# System Architecture
## JurisNova AI — Multi-Agent Governance, Risk & Compliance Platform

---

## 1. Architectural Overview

JurisNova AI implements a modern, decoupled, multi-tier enterprise architecture engineered for high evidentiary rigor, explainability, and multi-tenant security.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│           Next.js 14 (App Router) • TypeScript • Tailwind CSS           │
│                Hemla Design Tokens • Recharts Visualizations            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST / JSON
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY LAYER                            │
│           FastAPI • Pydantic v2 • JWT Authentication • CORS             │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
                    ▼                                 ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│      EVIDENCE-FIRST RAG ENGINE       │  │  LANGGRAPH MULTI-AGENT ENGINE │
│  • DocumentProcessor (PyMuPDF, docx) │  │  • StateGraph(Investigation)  │
│  • Text Normalization & Chunking     │  │  • 6 Specialized Agent Nodes  │
│  • 384-dim Dense Embeddings          │  │  • Conditional Verification   │
│  • Hybrid Vector + Keyword Search    │  │  • Human Review Gate          │
│  • Prompt Injection Sanitization     │  │  • Shared Typed State         │
└───────────────────┬──────────────────┘  └───────────────┬───────────────┘
                    │                                     │
                    └──────────────────┬──────────────────┘
                                       │ SQLAlchemy ORM
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            PERSISTENCE LAYER                            │
│     SQLite (Local/Demo) • PostgreSQL + pgvector (Production Enterprise) │
│       Relational Tables • Vector JSON / pgvector • SHA-256 Audit Logs   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Presentation Layer (Frontend)

The frontend is constructed using **Next.js 14 App Router**, **React 18/19**, **TypeScript**, and **Tailwind CSS**. It follows the **Hemla "Green To Heart"** visual direction.

### Key Components:
* **`AppShell` (`components/AppShell.tsx`):** Unifies responsive layout, containing the persistent enterprise `Sidebar` and `Header`.
* **`Sidebar` (`components/Sidebar.tsx`):** Grouped into *Executive Intelligence, Knowledge & Evidence, Risk & Remediation, AI Multi-Agent Engine, and Audit & Governance*.
* **`Header` (`components/Header.tsx`):** Surfaces organization switching, active jurisdiction tags, real-time grounding status, theme toggle, and user profile.
* **`ThemeContext` (`context/ThemeContext.tsx`):** Manages dark mode (default) and light mode toggle, persisting state across browser sessions.
* **`AuthContext` (`context/AuthContext.tsx`):** Manages user session state and active organization context.
* **`apiFetch` (`lib/api.ts`):** Centralized HTTP client automatically injecting JWT Bearer tokens and managing binary blob streaming for PDF exports.

---

## 3. Multi-Agent AI Orchestration (LangGraph)

The core compliance investigation engine uses **LangGraph** (`langgraph.graph.StateGraph`).

### Shared Typed State:
```python
class InvestigationState(TypedDict):
    investigation_id: str
    organization_id: str
    policy_scope: str
    regulatory_source_id: str
    document_ids: List[str]
    jurisdiction: str
    extracted_policies: List[Dict[str, Any]]
    retrieved_requirements: List[Dict[str, Any]]
    control_mappings: List[Dict[str, Any]]
    risk_assessments: List[Dict[str, Any]]
    remediation_plans: List[Dict[str, Any]]
    verification_results: List[Dict[str, Any]]
    verification_passed: bool
    verification_score: float
    flagged_citations: List[Dict[str, Any]]
    human_review_required: bool
    human_approved: bool
    execution_trace: List[Dict[str, Any]]
    final_summary: str
    status: str
    error: Optional[str]
```

### StateGraph Flowchart:
```
       START
         │
         ▼
[ Document Intelligence Agent ]
         │
         ▼
[ Regulatory Research Agent ]
         │
         ▼
  [ Control Mapping Agent ]
         │
         ▼
  [ Risk Assessment Agent ]
         │
         ▼
 [ Remediation Planning Agent ]
         │
         ▼
[ Independent Verification Agent ]
         │
         ├─────────────────────────────────────────┐
         │ (Verification Score < 0.50)             │ (Verification Score >= 0.50)
         ▼                                         ▼
[ Flagged Verification Notice ]           [ Verified Assessment Package ]
         │                                         │
         └───────────────────┬─────────────────────┘
                             ▼
                    [ Human Review Gate ]
                             │
                             ▼
                            END
```

---

## 4. Evidence-First RAG Pipeline

### 4.1 Document Ingestion Flow:
1. **Validation:** Checks file extensions (`.pdf`, `.docx`, `.txt`, `.md`) and size constraints ($\le 25\text{ MB}$).
2. **Extraction:**
   * PDF: Parsed page-by-page via `PyMuPDF` (`fitz`), preserving page numbers and top section headings.
   * DOCX: Parsed paragraph-by-paragraph via `python-docx`, using heading styles as section boundaries.
3. **Normalization:** Strips non-standard whitespace, resolves broken hyphenated line wraps, preserves legal numbering.
4. **Sliding Window Chunking:** Chunks content into 750-character segments with 150-character overlap while strictly preserving page numbers.
5. **Embedding:** Generates 384-dimensional dense vectors using normalized term-positional hashing (offline fallback) or Gemini/OpenAI embedding models.
6. **Storage:** Chunks and embeddings are stored in relational records with foreign keys linking back to parent documents.

### 4.2 Retrieval & Verification:
* **Hybrid Scoring:** Combines cosine vector similarity (65% weight) with keyword token overlap (35% weight).
* **Sanitization:** Sanitizes retrieved texts against prompt injection payloads.
* **Citation Verification:** Checks whether claimed finding quotes literally exist in primary chunks or satisfy high token overlap ($\ge 70\%$).

---

## 5. Security & Isolation Architecture

* **Multi-Tenancy:** All queries require an active `organization_id`. Cross-tenant data leakage is prevented at the database query level.
* **Stateless Authentication:** Passwords hashed with `bcrypt` (salt rounds = 12). JWT tokens signed with `HS256`.
* **Adversarial Guardrails:** Regex and AST scanners strip instruction overriding attempts before passing text to reasoning agents.
* **Auditability:** Every consequential event (investigation run, finding approval, remediation assignment, document upload/deletion) generates an immutable `AuditLog` row.
