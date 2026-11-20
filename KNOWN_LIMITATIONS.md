# Known Limitations & Engineering Roadmap
## JurisNova AI — Honest Engineering Transparency

---

## 1. Known Technical Limitations

In accordance with Section 14 and Section 15 of the GovernanceIQ specification, this document honestly records the operational boundaries and known technical limitations of the current JurisNova AI prototype.

### 1.1 Non-Searchable Scanned Image PDFs
* **Current State:** The `DocumentProcessor` uses `PyMuPDF` (`fitz`) and `python-docx` for native text extraction. It processes standard digital PDFs, Word documents, and text files.
* **Limitation:** PDFs consisting purely of scanned raster images without an embedded OCR text layer will return empty or minimal text.
* **Roadmap Solution:** Integration of an asynchronous Tesseract OCR / Google Cloud Vision OCR pre-processing worker for rasterized legacy documents.

### 1.2 Multi-Jurisdiction Legal Conflicts
* **Current State:** The system benchmarks policies against configured regulatory standards (e.g., Bangladesh Bank ICT Guidelines vs. EU GDPR).
* **Limitation:** Where two jurisdictions impose directly contradictory rules (e.g., Bangladesh Bank mandatory 6-year AML audit log retention vs. GDPR Article 17 Right to Immediate Erasure), the system flags the contradiction as a partial gap and defers to human compliance officers. The AI does not unilaterally arbitrate complex statutory preemption.
* **Design Rationale:** In legal systems, statutory hierarchy and conflict-of-laws doctrines require human legal determination.

### 1.3 Offline Demo Mode Heuristics
* **Current State:** When cloud LLM keys (`GEMINI_API_KEY` / `OPENAI_API_KEY`) are not provided, the platform operates in full **Demo Mode** using high-fidelity local 384-dimensional semantic hashing vectors and rule-based LangGraph agent heuristics.
* **Transparency:** As mandated by the competition rules, the system explicitly flags offline demo mode in API health checks (`/health`) and UI badges.

### 1.4 Non-Provision of Formal Legal Counsel
* **Limitation:** JurisNova AI provides evidence-first regulatory intelligence, automated control benchmarking, and decision-support analytics. Outputs do **NOT** constitute formal legal advice or licensed bar opinions.
* **Safeguard:** All reports and assistant interfaces display an explicit legal disclaimer.

---

## 2. Engineering Roadmap (Post-Congress 2026)

1. **Enterprise Connectors:** Automated sync connectors for AWS CloudTrail, Microsoft Purview, and Jira Service Management.
2. **Dynamic Regulatory Feed Scrapers:** Real-time webhooks monitoring Bangladesh Bank circular publications and gazettes.
3. **Multi-Model Ensembles:** Parallel cross-validation combining Gemini 1.5 Pro and Claude 3.5 Sonnet for high-stakes compliance filings.
