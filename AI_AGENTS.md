# Multi-Agent AI Architecture
## JurisNova AI — LangGraph Orchestration Specification

---

## 1. Multi-Agent Philosophy

JurisNova AI is built on the premise that complex legal, compliance, and operational governance tasks cannot be solved reliably by a single monolithic LLM prompt. Monolithic prompts blur the line between evidence retrieval, legal interpretation, risk quantification, and action planning—leading to hallucinated statutes and unchecked automated approvals.

JurisNova AI implements a multi-agent workflow using **LangGraph** where 6 specialized agents collaborate through a typed shared state with strict conditional routing.

---

## 2. Specialized Agent Roster

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INVESTIGATION LANGGRAPH                         │
│                                                                        │
│  [ Agent 1: Document Intelligence ] ──► Extracts Clauses & Pages       │
│                │                                                       │
│                ▼                                                       │
│  [ Agent 2: Regulatory Research ]   ──► Traverses Regulatory Mandates  │
│                │                                                       │
│                ▼                                                       │
│  [ Agent 3: Control Mapping ]       ──► Discovers Operational Gaps     │
│                │                                                       │
│                ▼                                                       │
│  [ Agent 4: Risk Assessment ]       ──► 1-5 Likelihood x Impact Matrix │
│                │                                                       │
│                ▼                                                       │
│  [ Agent 5: Remediation Planning ]  ──► Formulates Tasks & SLAs        │
│                │                                                       │
│                ▼                                                       │
│  [ Agent 6: Independent Verifier ]  ──► Adversarial Citation Check     │
│                │                                                       │
│                ▼                                                       │
│     [ Human Review Gate Node ]      ──► Official Human Sign-Off        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Agent Specifications

### Agent 1: Document Intelligence Agent
* **Role:** Primary policy extractor and structural segmenter.
* **Inputs:** `policy_scope`, `organization_id`, `document_ids`.
* **Outputs:** `extracted_policies` (list of text clauses, document titles, page numbers, section titles, and relevance scores).
* **Guarantees:** Never summarizes away exact clause numbers or page references.

### Agent 2: Regulatory Research Agent
* **Role:** Regulatory traverser and legal baseline retriever.
* **Inputs:** `regulatory_source_id`, `policy_scope`.
* **Outputs:** `retrieved_requirements` (legally binding requirements with `req_code`, `domain`, `severity`, and official descriptions).
* **Guarantees:** Only queries configured, verified regulatory sources (e.g., Bangladesh Bank ICT Guidelines, GDPR, ISO 27001). Never invents laws or article numbers.

### Agent 3: Control Mapping Agent
* **Role:** Gap identifier and compliance alignment classifier.
* **Inputs:** `extracted_policies`, `retrieved_requirements`.
* **Outputs:** `control_mappings` (each obligation classified as **Implemented**, **Partially Implemented**, **Missing**, or **Not Verifiable**).
* **Classification Criteria:**
  * *Implemented:* Substantive technical control and policy verified in document chunks ($\text{Score} \ge 0.70$).
  * *Partially Implemented:* High-level policy stated, but operational enforcement parameters are missing ($0.45 \le \text{Score} < 0.70$).
  * *Missing:* No compliant policy clause or control discovered ($\text{Score} < 0.45$).

### Agent 4: Risk Assessment Agent
* **Role:** Quantitative risk calculator and transparent explainer.
* **Inputs:** `control_mappings`.
* **Outputs:** `risk_assessments` (Likelihood 1–5, Impact 1–5, Risk Score 1–25, Severity, and Explanatory Rationale).
* **Formula:** $\text{Risk Score} = \text{Likelihood} \times \text{Impact}$.
* **Severity Tiers:**
  * 1–4: Low
  * 5–9: Moderate
  * 10–16: High
  * 17–25: Critical
* **Guarantees:** Produces a 2-sentence rationale detailing why the likelihood and impact values were assigned.

### Agent 5: Remediation Planning Agent
* **Role:** Corrective action formulator and operational SLA assigner.
* **Inputs:** `control_mappings`, `risk_assessments`.
* **Outputs:** `remediation_plans` (Task title, recommended action description, priority, SLA deadline, assigned department, and completion evidence criteria).
* **Department Routing:** Routes privacy tasks to the *Data Protection Unit*; routes technical infrastructure gaps to *IT & Security Operations*.

### Agent 6: Independent Verification Agent
* **Role:** Adversarial verifier and anti-hallucination guardian.
* **Inputs:** `control_mappings`, `extracted_policies`.
* **Outputs:** `verification_score`, `flagged_citations`, `verification_passed`.
* **Verification Protocol:** Checks claimed excerpts against source chunk text using substring matching and token overlap analysis. If an excerpt has $< 45\%$ token overlap, the finding is flagged as `Flagged / Needs Clarification`.

### Node 7: Human Review Gate Node
* **Role:** Final governance boundary enforcing human accountability.
* **Enforcement:** Sets `human_review_required = True` and `human_approved = False`.
* **Governance Standard:** AI agents are forbidden from automatically approving findings or certifying remediation completion.

---

## 4. Observability & Agent Tracing

Every agent execution step logs an `AgentMessage` row in the database:
* `agent_name`: Name of the executing agent.
* `step_order`: Monotonically increasing sequence number.
* `message_type`: `thought`, `action`, `observation`, `output`, or `verification_flag`.
* `content`: Human-readable summary of the step.
* `metadata_json`: Numerical parameters, scores, and candidate counts.

Users can inspect the full step-by-step trace in the **Agent Activity Traces** workspace (`/agents`) and in the **Investigation Lab** (`/compliance/analyze`).
