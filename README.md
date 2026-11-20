<div align="center">

<img src="frontend/public/logo.jpg" alt="JurisNova AI Logo" width="88" height="88" style="border-radius:16px;"/>

# JurisNova AI

### AI-Powered Governance, Risk & Compliance Intelligence Platform

*Justice · Intelligence · Future*

[![Event](https://img.shields.io/badge/Event-AI_Builders_World_Congress_2026-00D765?style=for-the-badge)](https://aibuilders.org)
[![Challenge](https://img.shields.io/badge/Challenge-GovernanceIQ-30ED7B?style=for-the-badge)](https://aibuilders.org)
[![License](https://img.shields.io/badge/License-MIT-86FAAF?style=for-the-badge)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-10251C?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-00875F?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/Orchestrator-LangGraph_StateGraph-0D2119?style=for-the-badge&logo=python)](https://github.com/langchain-ai/langgraph)

> **Governance Intelligence. Compliance Clarity. Trusted Decisions.**

</div>

---

## Overview

**JurisNova AI** is a production-grade, evidence-first, multi-agent governance intelligence platform built for the **GovernanceIQ** track at **AI Builders World Congress 2026**.

It is NOT a generic legal chatbot. JurisNova AI is an enterprise decision-support system that:

- Benchmarks internal policies and controls against complex regulatory mandates (Bangladesh Bank ICT Guidelines v3.0, EU GDPR, ISO/IEC 27001:2022)
- Discovers compliance gaps with verified primary-source citations
- Quantifies operational risks on a 1–5 Likelihood × Impact matrix
- Formulates actionable remediation tasks with departmental ownership and SLA tracking
- Monitors public-sector governance signals, project delivery performance, procurement timelines, and budget discrepancies for Dhaka City Services Authority
- Enforces strict human-in-the-loop authorization gates — AI proposes, humans decide

---

## Key Capabilities

| Capability | Description |
|:---|:---|
| **Zero Hallucination RAG** | Every finding is grounded in primary source text with verified page, section, and semantic confidence scores |
| **6-Agent LangGraph Pipeline** | Compiled StateGraph connecting Document Intelligence, Regulatory Research, Control Mapping, Risk Assessment, Remediation Planning, and Independent Verification agents |
| **Human-in-the-Loop Governance** | Authorized officers retain full sign-off and override authority at every critical decision gate |
| **Public Sector Intelligence** | Governance Twin for Dhaka City — 12 wards, 10 departments, 1,500 complaint records, 20 capital projects, 15 procurements |
| **Full Bilingual Interface** | Complete English ↔ বাংলা translation across every page, card, and modal |
| **Responsive Design** | Optimized for mobile, tablet, and desktop — the Hemla "Green To Heart" design system |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     JURISNOVA AI CLIENT                         │
│          Next.js 14 App Router · TypeScript · Tailwind CSS      │
│               Hemla "Green To Heart" Design System              │
└───────────────────────────┬─────────────────────────────────────┘
                            │  REST API + JWT Auth
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND ENGINE                        │
│           Pydantic v2 · SQLAlchemy · ReportLab PDF              │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
               ▼                                  ▼
┌──────────────────────────┐     ┌────────────────────────────────┐
│   EVIDENCE-FIRST RAG     │     │   LANGGRAPH MULTI-AGENT ENGINE │
│  PyMuPDF / python-docx   │     │  1. Document Intelligence      │
│  384-dim Vector Embeds   │     │  2. Regulatory Research        │
│  Hybrid Semantic Search  │     │  3. Control Mapping            │
│  Citation Verification   │     │  4. Risk Assessment (1-5)      │
│  Injection Defense       │     │  5. Remediation Planning       │
└──────────────────────────┘     │  6. Independent Verification   │
               │                 │  7. Human Review Gate          │
               └────────────┬────┘
                            ▼
              SQLite · pgvector · SHA-256 Audit Log
```

---

## Module Reference

### Compliance & Risk Intelligence

| Route | Module | Description |
|:---|:---|:---|
| `/dashboard` | Executive Dashboard | Live compliance posture, risk distribution, historical maturity curves, quick PDF export |
| `/compliance/analyze` | Investigation Lab | End-to-end multi-agent investigation with verified citations |
| `/compliance/findings` | Findings Register | Traceable gap records with human sign-off and override |
| `/risks` | Risk Intelligence | Interactive 5×5 Likelihood × Impact heatmap with AI rationales |
| `/remediation` | Remediation Manager | Task assignment, SLA tracking, completion evidence |
| `/regulatory` | Regulatory Hub | Bangladesh Bank ICT v3.0, EU GDPR, ISO 27001 requirement browser |
| `/documents` | Document Library | PDF/DOCX ingestion pipeline with chunk-level vector visualization |
| `/assistant` | Governance AI Assistant | Grounded conversational copilot with citation indicators |
| `/audits` | Audit Trail & PDF | SHA-256 immutable logs and ReportLab PDF report export |

### Public Sector Governance Intelligence

| Route | Module | Description |
|:---|:---|:---|
| `/twin` | Governance Twin | Stylized Dhaka service-area map with ward-level health scores |
| `/signals` | Governance Signals | Emerging operational anomaly detection across 12 wards |
| `/citizen-insights` | Citizen & Service Insights | 1,500 complaint record analytics by category, ward, and trend |
| `/projects` | Project Performance | Capital project delivery tracking with milestone discrepancy alerts |
| `/procurement` | Procurement Watch | Contract timeline anomaly detection and vendor performance |
| `/budget` | Budget Intelligence | Budget-to-progress variance and financial governance health |
| `/actions` | Governance Action Center | Investigation workflows, animated verification checklists, supervisory approvals |
| `/reports` | Executive Governance Briefs | Compiled governance intelligence briefs with bilingual PDF export |

### Platform Administration

| Route | Module | Description |
|:---|:---|:---|
| `/agents` | Agent Activity Traces | LangGraph thought traces, latencies, and verification scores |
| `/settings` | Organization Settings | RBAC roles, multi-tenant config, and org management |

---

## Quick Start

### Prerequisites

- **Python:** 3.10+ (tested on 3.14)
- **Node.js:** v18+ (tested on v26)
- **npm:** 10+

### 1 — Clone

```bash
git clone https://github.com/your-org/jurisnova-ai.git
cd jurisnova-ai
```

### 2 — Backend

```bash
cd backend
python -m venv venv

# Windows
.\\venv\\Scripts\\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

# Seed the database
$env:PYTHONPATH="."          # Windows PowerShell
# export PYTHONPATH="."      # macOS / Linux

python app/db/seed.py

# Start the API server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

API running at `http://localhost:8000` · Swagger docs at `http://localhost:8000/docs`

### 3 — Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Application running at `http://localhost:3000`

### 4 — Demo Sign-In Credentials

Use the one-click sign-in tiles on the login screen, or enter manually:

| Role | Email | Password |
|:---|:---|:---|
| Compliance Officer | `fatinwasi321@jurisnova.ai` | `123456789` |
| Super Administrator | `tanvirpiyal@jurisnova.ai` | `123456789` |
| Risk Analyst | `tahmid.islam@jurisnova.ai` | `123456789` |
| Lead Auditor | `oyishimuskan@jurisnova.ai` | `123456789` |

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router) · TypeScript
- **Styling:** Tailwind CSS · Hemla "Green To Heart" Design System
- **Charts:** Recharts (AreaChart, PieChart, heatmaps)
- **Icons:** Lucide React
- **Animations:** Custom CSS keyframes (tame-lionfish-36 checkboxes, hard-turkey-58 button glows)
- **i18n:** Built-in English ↔ বাংলা context switcher

### Backend
- **Framework:** FastAPI · Pydantic v2
- **ORM / DB:** SQLAlchemy · SQLite (dev) / PostgreSQL + pgvector (prod)
- **Document Processing:** PyMuPDF · python-docx
- **PDF Generation:** ReportLab
- **AI Orchestration:** LangGraph StateGraph (6 agents + human gate)
- **Security:** JWT Bearer tokens · SHA-256 audit ledger · Prompt injection defense

### Demo Dataset — Dhaka City Services Authority
- 12 service wards · 10 operational departments · 5 service categories
- 1,500 synthetic complaint records with realistic category distribution
- 20 capital infrastructure projects · 15 procurement contracts
- Governance signals, budget health metrics, and investigation records

---

## Evaluation Benchmarks

| Metric | Score |
|:---|:---:|
| Retrieval Precision@K | 92.5% |
| Citation Accuracy | 96.8% |
| Faithfulness Score | 94.6% |
| Compliance Gap Detection F1 | 91.4% |
| Prompt Injection Defense | 100% |
| Multi-Agent Latency (avg) | ~1,840 ms |

Run the benchmark suite:

```bash
cd backend
python -c "
from app.evaluation.benchmark import EvaluationBenchmark
import json
print(json.dumps(EvaluationBenchmark.run_benchmark(), indent=2))
"
```

---

## Project Documentation

| Document | Description |
|:---|:---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Comprehensive system and multi-agent architecture |
| [PRD.md](./PRD.md) | Product requirements and persona specifications |
| [AI_AGENTS.md](./AI_AGENTS.md) | LangGraph StateGraph and 6-agent specification |
| [RAG_ARCHITECTURE.md](./RAG_ARCHITECTURE.md) | Hybrid vector retrieval and citation verification |
| [API.md](./API.md) | Complete REST API documentation |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Hemla "Green To Heart" tokens and styling standards |
| [SECURITY.md](./SECURITY.md) | Security controls, RBAC, and prompt defense |
| [DATA_LIFECYCLE.md](./DATA_LIFECYCLE.md) | Document ingestion, chunking, retention, and deletion |
| [EVALUATION.md](./EVALUATION.md) | 40-scenario evaluation benchmark methodology |
| [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) | Honest engineering limitations and roadmap |

---

## Submission Details

| Field | Value |
|:---|:---|
| **Project** | JurisNova AI |
| **Event** | AI Builders World Congress 2026 |
| **Track** | GovernanceIQ — Legal, Compliance & Trust Technologies |
| **Team Lead** | Md. Tanvir Hossain |
| **Team Members** | Fatin Sharhad · Tahmid Islam · Muskan Meheg |
| **Tagline** | *Governance Intelligence. Compliance Clarity. Trusted Decisions.* |

---

## License

This project is released under the **MIT License** — see [LICENSE](./LICENSE) for full terms.

Copyright © 2026 JurisNova AI Authors & Contributors.

---

<div align="center">

**JurisNova AI** · Built for AI Builders World Congress 2026 · GovernanceIQ Challenge

*Justice · Intelligence · Future*

</div>
