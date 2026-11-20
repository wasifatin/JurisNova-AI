# Product Requirements Document (PRD)
## JurisNova AI — AI-Powered Governance, Risk & Compliance Platform

**Challenge:** GovernanceIQ | **Event:** AI Builders World Congress 2026  
**Category:** Legal, Compliance & Trust Technologies  
**Tagline:** Governance Intelligence. Compliance Clarity. Trusted Decisions.

---

## 1. Product Vision & Problem Statement

### 1.1 The Problem
Global and regional regulatory compliance—particularly in regulated sectors like banking, fintech, and critical infrastructure—is undergoing explosive complexity. In jurisdictions like Bangladesh, the **Bangladesh Bank ICT Security Guidelines v3.0** impose stringent statutory obligations on access control, immutable transaction logging, 24-hour incident notification, and cryptographic hygiene. Simultaneously, cross-border privacy regulations (e.g., **EU GDPR**) dictate strict data subject erasure timelines.

Organizations face critical operational challenges:
1. **Disconnected Knowledge:** Regulations live in static legal circulars; internal controls live in fragmented Word/PDF policies; operational logs live in SIEM/Cloud consoles.
2. **Legal Hallucination Danger:** Generic LLM chatbots frequently fabricate statutory clauses, invent non-existent articles, or miss cross-statutory exceptions.
3. **Paper Compliance vs. Operational Implementation:** Possessing a policy document is often mistakenly treated as proof that a control is operationally enforced.
4. **Autonomous Agent Risk:** Autonomous AI tools that execute or approve remediation without human review create unacceptable regulatory and operational liability.

### 1.2 The Solution
**JurisNova AI** is an evidence-first, multi-agent governance intelligence platform that:
* Ingests, normalizes, and chunks internal organizational policies with exact page and section preservation.
* Automatically benchmarks internal controls against configured regulatory obligations.
* Discovers compliance gaps categorized as **Implemented**, **Partially Implemented**, **Missing**, or **Not Verifiable**.
* Calculates quantitative risk scores on a 1–5 likelihood-impact matrix with transparent AI rationales.
* Generates actionable remediation tasks with departmental ownership and completion evidence requirements.
* Strictly enforces human-in-the-loop authorization gates before any finding or remediation action is certified.

---

## 2. Target Personas

| Persona | Primary Goal | Core Needs in JurisNova AI |
| :--- | :--- | :--- |
| **Chief Compliance Officer (CCO)** | Ensure organization meets central bank and global statutory baselines without audit findings. | Rapid gap analysis, evidence-backed findings, traceable audit trails, board-level executive reports. |
| **Information Security Auditor** | Verify that internal security controls match documented claims and statutory requirements. | Primary source citations with page numbers, verification confidence scores, zero hallucination tolerance. |
| **Enterprise Risk Analyst** | Quantify organizational exposure and prioritize technical vulnerabilities. | 5x5 Likelihood x Impact risk matrix, automated scoring formulas, transparent AI rationales. |
| **CISO / IT Infrastructure Lead** | Execute technical remediation actions and provide completion evidence. | Clear remediation tasks, departmental SLAs, evidence upload, clear human sign-off workflows. |

---

## 3. Product Scope & Functional Modules

### Module A: Multi-Tenant Organization & RBAC
* **Requirements:**
  * User registration and JWT-based authentication.
  * Role-Based Access Control supporting 6 distinct roles: *Super Administrator, Organization Administrator, Compliance Officer, Risk Analyst, Auditor, Viewer*.
  * Complete data isolation at both database and application query layers.

### Module B: Executive Governance Dashboard
* **Requirements:**
  * Real-time calculation of overall compliance posture derived from persisted records.
  * Breakdowns: Total requirements, total controls, compliant controls, partial controls, missing controls.
  * Risk exposure summary: Critical (17–25), High (10–16), Moderate (5–9), Low (1–4).
  * Historical compliance maturity area chart (Recharts).
  * Recent multi-agent run records and audit trail feeds.

### Module C: Document Intelligence & RAG Pipeline
* **Requirements:**
  * Multipart file ingestion supporting PDF (PyMuPDF), DOCX (python-docx), and TXT formats.
  * Document text normalization and sliding window semantic chunking (750 chars, 150 chars overlap).
  * Preservation of Document ID, Document Title, Page Number, Section Heading, and Token Count.
  * 384-dimensional dense vector embeddings with cosine similarity search.
  * Untrusted input sanitization defending against prompt injection.

### Module D: Regulatory Knowledge Hub
* **Requirements:**
  * Curated regulatory source registry initially supporting **Bangladesh Bank ICT Security Guidelines v3.0**, **EU GDPR**, and **ISO/IEC 27001:2022**.
  * Domain-based requirement categorization (Data Retention, Access Control, Incident Response, Cryptography).
  * Real-time semantic search over regulatory mandates.

### Module E: Compliance Investigation Lab (Signature Feature)
* **Requirements:**
  * End-to-end investigation workspace comparing internal policies against selected regulatory scopes.
  * Step-by-step progress visualization across 6 specialized LangGraph agents.
  * Results presentation:
    * Compliance score & status badge.
    * Requirement vs. internal control mapping.
    * Primary source document citation excerpt with exact page reference.
    * Evidentiary verification confidence score (Lexical & semantic overlap).
    * Quantitative 1–5 Likelihood x Impact risk score with transparent AI explanation.
    * Proposed remediation plan with SLA and completion evidence requirements.
    * Authorized human reviewer approval / rejection / override action.

### Module F: Risk Intelligence Center
* **Requirements:**
  * Dynamic 5x5 Heatmap Matrix: Likelihood (1–5) x Impact (1–5) = Risk Score (1–25).
  * Categorization: Low (1–4), Moderate (5–9), High (10–16), Critical (17–25).
  * Transparent explanatory rationale generated for every risk score.

### Module G: Remediation Management
* **Requirements:**
  * Remediation lifecycle: *Identified Gap → Proposed Action → Human Review → Approved → Assigned → In Progress → Completed → Verified*.
  * Strict enforcement: AI agents propose corrective actions; human compliance officers must authorize them.
  * Ability to submit completion evidence (hashes, URLs, verification logs).

### Module H: Governance AI Assistant
* **Requirements:**
  * Conversational copilot answering organizational compliance queries.
  * Clear structural separation: Retrieved Primary Evidence vs. Policy Interpretation vs. Strategic Recommendations.
  * Grounded citations with document name, page number, and source type.
  * Uncertainty level disclosure (Low, Moderate, High - Insufficient Evidence).

### Module I: Audit Trail & PDF Reporting
* **Requirements:**
  * Immutable event logging with actor email, resource type, action, details, and IP address.
  * One-click PDF report generation using ReportLab conforming to the Hemla brand aesthetic.

---

## 4. Non-Functional Requirements (NFRs)

* **Performance:** Single-query vector retrieval latency < 60ms; complete multi-agent investigation < 3,000ms.
* **Accuracy:** Evidentiary citation accuracy > 95%; zero fabricated regulatory clauses.
* **Security:** Password hashing with `bcrypt`; stateless JWT authorization; prompt injection defense regex/AST filter.
* **Availability:** Graceful fallback to deterministic local semantic embeddings and seed data if external AI APIs are offline or unconfigured.
* **Accessibility & UI:** Dark mode default with light mode toggle; WCAG 2.1 AA text contrast; fully responsive mobile/desktop layouts.
