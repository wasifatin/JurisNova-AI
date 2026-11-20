# REST API Reference Manual
## JurisNova AI — Governance, Risk & Compliance Platform

**Base URL:** `http://localhost:8000/api/v1` (or configured `NEXT_PUBLIC_API_URL`)  
**Interactive Swagger UI:** `http://localhost:8000/docs`  
**Authentication Header:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication & RBAC

### `POST /auth/login`
Authenticates user and returns JWT token with session details.
* **Request:**
```json
{
  "email": "compliance@jurisnova.ai",
  "password": "Compliance123!"
}
```
* **Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": "usr-compliance-off-01",
    "email": "compliance@jurisnova.ai",
    "full_name": "Sarah Jenkins, CAMS",
    "system_role": "Compliance Officer",
    "organization_id": "org-acme-fintech-01",
    "organization_name": "PrimeTrust Financial & Cloud Services"
  }
}
```

### `POST /auth/register`
Registers a new enterprise user and organizational workspace.
* **Request:**
```json
{
  "email": "officer@company.com",
  "password": "SecurePassword123!",
  "full_name": "Tariq Rahman",
  "organization_name": "PrimeTrust Global",
  "system_role": "Compliance Officer"
}
```

---

## 2. Executive Dashboard

### `GET /dashboard/stats`
Retrieves live aggregated metrics derived from persisted database records.
* **Response:** `200 OK`
```json
{
  "organization_name": "PrimeTrust Financial & Cloud Services",
  "jurisdiction": "Bangladesh & International",
  "overall_compliance_score": 78.5,
  "total_requirements": 6,
  "total_controls": 4,
  "controls_summary": {
    "compliant": 2,
    "partial": 1,
    "missing": 1
  },
  "open_compliance_findings": 2,
  "risks_summary": {
    "critical": 1,
    "high": 1,
    "moderate": 0,
    "low": 1
  },
  "remediation_summary": {
    "pending": 2,
    "completed": 0
  },
  "compliance_trends": [ ... ],
  "risk_distribution": [ ... ],
  "recent_agent_runs": [ ... ],
  "recent_audits": [ ... ],
  "upcoming_deadlines": [ ... ]
}
```

---

## 3. Document Intelligence & Ingestion

### `POST /documents/upload`
Uploads and indexes policy documents using PyMuPDF / python-docx.
* **Request:** Multipart form data (`file`, `title`, `category`).
* **Response:** `200 OK` Document record with page and chunk counts.

### `GET /documents`
Lists all indexed documents for the authenticated organization.

### `GET /documents/{id}/chunks`
Lists all extracted semantic chunks with exact page numbers, section headers, and token counts.

### `DELETE /documents/{id}`
Deletes a document and cascades deletion across its chunks and versions.

---

## 4. Regulatory Knowledge Hub

### `GET /regulatory/sources`
Lists active regulatory sources (Bangladesh Bank ICT, GDPR, ISO 27001).

### `GET /regulatory/requirements?source_id={id}`
Lists mandatory obligations under a specific source.

### `POST /regulatory/requirements/search`
Performs vector semantic search over regulatory obligations.
* **Request:** `{"query": "audit log retention"}`

---

## 5. Compliance Gap Analyzer & Investigation

### `POST /compliance/investigate`
**SIGNATURE FEATURE:** Triggers the multi-agent LangGraph workflow.
* **Request:**
```json
{
  "policy_scope": "Data Retention & Storage Policy",
  "regulatory_source_id": "reg-bb-ict-2023",
  "document_ids": []
}
```
* **Response:** Returns the newly persisted `ComplianceAssessment` with populated findings, verified citations, quantitative risk scores, remediation action proposals, and agent trace IDs.

### `GET /compliance/findings`
Lists compliance findings with optional filters (`status_filter`, `review_status`).

### `PATCH /compliance/findings/{id}/review`
Enforces human authorization workflow.
* **Request:**
```json
{
  "human_review_status": "Approved",
  "human_reviewer": "Sarah Jenkins",
  "human_review_notes": "Audited against production S3 Object Lock configuration.",
  "override_status": null
}
```

---

## 6. Risk Intelligence Center

### `GET /risks`
Lists operational risk records with Likelihood, Impact, Risk Score, and AI Rationale.

### `GET /risks/matrix`
Returns the 5x5 Likelihood x Impact distribution grid.

---

## 7. Remediation Action Management

### `GET /remediation/tasks`
Lists corrective action tasks with priority and SLA due dates.

### `POST /remediation/tasks/{id}/approve`
Human approval action transitioning task from `Proposed Action` to `Approved` or `Rejected`.

### `PATCH /remediation/tasks/{id}`
Updates task status and submits completion verification evidence.

---

## 8. Governance AI Assistant

### `POST /assistant/chat`
Answers compliance queries with grounded primary citations.
* **Request:** `{"query": "What is our mandatory transaction log retention timeline?"}`
* **Response:**
```json
{
  "query": "...",
  "evidence_found": true,
  "retrieved_evidence": "Retrieved from Enterprise_Data_Retention_Policy_v2.4.pdf (Page 4): ...",
  "interpretation": "Internal control CTL-DATA-01 mandates 7-year immutable retention...",
  "recommendations": "Maintain automated checksum validation...",
  "citations": [
    {
      "document_name": "Enterprise_Data_Retention_Policy_v2.4.pdf",
      "page_number": 4,
      "section": "Section 4.2",
      "confidence": 0.98
    }
  ],
  "uncertainty_level": "Low"
}
```

---

## 9. Audit Trails & Formal PDF Reports

### `GET /audits/logs`
Returns immutable audit logs.

### `GET /audits/export/pdf`
Streams an executive PDF audit report built via ReportLab (`Content-Type: application/pdf`).

---

## 10. AI Evaluation Suite

### `GET /evaluations/metrics`
Returns current benchmark metrics.

### `POST /evaluations/run-benchmark`
Executes live 40-scenario benchmark suite and returns freshly measured results.
