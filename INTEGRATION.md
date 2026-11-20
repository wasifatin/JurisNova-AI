# External Integration Architecture
## JurisNova AI — Enterprise Connectors & Ecosystem Interoperability

---

## 1. Overview

JurisNova AI is designed to integrate into existing enterprise IT security architectures, regulatory monitoring feeds, and operational incident dispatch pipelines.

---

## 2. LLM & Embedding Integrations

### Google Gemini API
* **Supported Models:** `gemini-1.5-pro`, `gemini-1.5-flash`, `text-embedding-004`.
* **Configuration:** Set `LLM_PROVIDER="gemini"` and `GEMINI_API_KEY="AIza..."` in `backend/.env`.
* **Role:** High-context legal reasoning, cross-clause statutory synthesis, and dense semantic embeddings.

### OpenAI API
* **Supported Models:** `gpt-4o`, `text-embedding-3-small`.
* **Configuration:** Set `LLM_PROVIDER="openai"` and `OPENAI_API_KEY="sk-..."` in `backend/.env`.

### Local / Offline Engine (Zero External Dependency)
* Enabled by default when `DEMO_MODE=True` or when API keys are omitted.
* High-fidelity 384-dimensional term-positional vector hashing and rule-based LangGraph agents execute locally with zero network calls required.

---

## 3. Enterprise Identity & RBAC (SSO)

* **SAML 2.0 / OIDC:** Can be bridged through Okta, Azure Active Directory (Entra ID), or Keycloak.
* **JWT Claims:** The backend decodes standard JWT claims mapping user roles to the 6 JurisNova RBAC tiers (*Super Admin, Org Admin, Compliance Officer, Risk Analyst, Auditor, Viewer*).

---

## 4. Ticketing & Remediation Dispatch (Jira / ServiceNow)

When the Remediation Agent generates corrective action tasks, webhooks can be dispatched to operational ticketing systems:
* **Jira Service Management:** Creates an `IssueType: Compliance Remediation` with mapped SLA due date and assigned team.
* **PagerDuty:** Dispatches emergency alerts for P1 critical regulatory breach notifications (e.g., Bangladesh Bank 24-hour mandatory disclosure).

---

## 5. Persistence & Vector Database Connectors

* **PostgreSQL + pgvector:**
  * Uses standard SQLAlchemy engine.
  * In production, configure `DATABASE_URL="postgresql+psycopg2://user:password@host:5432/jurisnova"`.
  * Embeddings map to `vector(384)` with HNSW indexes for sub-millisecond similarity lookups over millions of policy chunks.
* **SQLite:**
  * Default out-of-the-box storage (`jurisnova.db`) requiring no separate database server.
