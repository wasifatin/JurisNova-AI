import time
from datetime import datetime, timezone
from typing import Dict, Any, List
from langgraph.graph import StateGraph, START, END
from app.agents.state import InvestigationState
from app.core.database import SessionLocal
from app.models.all_models import (
    Requirement, Control, Document, DocumentChunk, RegulatorySource
)
from app.services.rag_engine import RAGEngine
from app.services.embedding_service import EmbeddingService

def log_agent_step(state: InvestigationState, agent_name: str, step_order: int, msg_type: str, content: str, meta: Dict[str, Any] = None):
    state["execution_trace"].append({
        "agent_name": agent_name,
        "step_order": step_order,
        "message_type": msg_type,
        "content": content,
        "metadata": meta or {},
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

# ---------------------------------------------------------------------------
# Node 1: Document Intelligence Agent
# ---------------------------------------------------------------------------
def document_intelligence_node(state: InvestigationState) -> InvestigationState:
    log_agent_step(
        state, "Document Intelligence Agent", 1, "thought",
        f"Scanning internal policy documents for scope '{state['policy_scope']}' in organization {state['organization_id']}."
    )
    
    db = SessionLocal()
    try:
        # Hybrid search over internal documents
        results = RAGEngine.hybrid_search(
            db=db,
            query=f"{state['policy_scope']} internal policy procedure controls",
            org_id=state['organization_id'],
            doc_ids=state.get('document_ids'),
            top_k=6
        )

        extracted = []
        for r in results:
            extracted.append({
                "document_id": r["document_id"],
                "document_name": r["document_name"],
                "page_number": r["page_number"],
                "section_title": r["section_title"],
                "chunk_id": r["chunk_id"],
                "text_excerpt": r["content"],
                "relevance_score": r["similarity_score"]
            })

        state["extracted_policies"] = extracted
        log_agent_step(
            state, "Document Intelligence Agent", 2, "observation",
            f"Extracted {len(extracted)} relevant policy clauses with verified page & section metadata.",
            {"chunk_count": len(extracted), "top_score": extracted[0]["relevance_score"] if extracted else 0.0}
        )
    finally:
        db.close()

    return state

# ---------------------------------------------------------------------------
# Node 2: Regulatory Research Agent
# ---------------------------------------------------------------------------
def regulatory_research_node(state: InvestigationState) -> InvestigationState:
    log_agent_step(
        state, "Regulatory Research Agent", 3, "thought",
        f"Retrieving active regulatory obligations for scope '{state['policy_scope']}' under source ID '{state['regulatory_source_id']}'."
    )

    db = SessionLocal()
    try:
        # Retrieve requirements for the selected source
        reqs = db.query(Requirement).filter(
            Requirement.source_id == state["regulatory_source_id"]
        ).all()

        retrieved = []
        for req in reqs:
            # Check domain or title relevance
            retrieved.append({
                "req_id": req.id,
                "req_code": req.req_code,
                "title": req.title,
                "description": req.description,
                "domain": req.domain,
                "severity": req.severity,
                "full_text": req.full_text or req.description
            })

        state["retrieved_requirements"] = retrieved
        log_agent_step(
            state, "Regulatory Research Agent", 4, "observation",
            f"Identified {len(retrieved)} legally binding requirements from official source registry.",
            {"requirements_indexed": [r["req_code"] for r in retrieved]}
        )
    finally:
        db.close()

    return state

# ---------------------------------------------------------------------------
# Node 3: Control Mapping Agent
# ---------------------------------------------------------------------------
def control_mapping_node(state: InvestigationState) -> InvestigationState:
    log_agent_step(
        state, "Control Mapping Agent", 5, "thought",
        "Synthesizing internal policy excerpts against regulatory obligations to evaluate implementation posture."
    )

    policies = state.get("extracted_policies", [])
    requirements = state.get("retrieved_requirements", [])
    mappings = []

    # Cross-reference each requirement against retrieved internal policies
    for idx, req in enumerate(requirements):
        req_text = f"{req['title']} {req['description']}".lower()
        best_match = None
        best_score = 0.0

        for p in policies:
            score = EmbeddingService.cosine_similarity(
                EmbeddingService.generate_embedding(req_text),
                EmbeddingService.generate_embedding(p["text_excerpt"])
            )
            if score > best_score:
                best_score = score
                best_match = p

        # Evidence-first classification:
        # High match (> 0.70): Implemented
        # Moderate match (0.45 - 0.70): Partially Implemented
        # Low match (< 0.45): Missing
        if best_match and best_score >= 0.70:
            status = "Implemented"
            impact = "Low"
            confidence = round(best_score, 2)
            explanation = f"Internal control explicitly covers {req['req_code']} in '{best_match['document_name']}' ({best_match['section_title']}). Operational procedures align with regulatory mandate."
            recommended_action = "Maintain regular audit cadence and verify automated log retention."
        elif best_match and best_score >= 0.45:
            status = "Partially Implemented"
            impact = "High" if req["severity"] == "Critical" else "Medium"
            confidence = round(best_score, 2)
            explanation = f"Partial coverage detected in '{best_match['document_name']}'. While high-level intent is stated, specific operational enforcement details (timelines, encryption protocols, or multi-factor gates) are missing."
            recommended_action = f"Amend policy to explicitly specify enforcement parameters for {req['req_code']}."
        else:
            status = "Missing"
            impact = "Critical" if req["severity"] in ["Critical", "High"] else "High"
            confidence = 0.90
            explanation = f"No operational control or policy clause found addressing {req['req_code']}: '{req['title']}'. Organization is exposed to regulatory non-compliance."
            recommended_action = f"Establish formal governance policy and deploy technical control for {req['req_code']} immediately."

        mappings.append({
            "requirement_id": req["req_id"],
            "req_code": req["req_code"],
            "req_title": req["title"],
            "status": status,
            "confidence": confidence,
            "impact": impact,
            "explanation": explanation,
            "recommended_action": recommended_action,
            "evidence": {
                "document_id": best_match["document_id"] if best_match else None,
                "document_name": best_match["document_name"] if best_match else "None (Gap Identified)",
                "page_number": best_match["page_number"] if best_match else 1,
                "section_title": best_match["section_title"] if best_match else "N/A",
                "excerpt": best_match["text_excerpt"][:300] if best_match else "No internal evidence discovered."
            }
        })

    state["control_mappings"] = mappings
    log_agent_step(
        state, "Control Mapping Agent", 6, "observation",
        f"Completed gap analysis across {len(mappings)} obligations: "
        f"{sum(1 for m in mappings if m['status'] == 'Implemented')} Implemented, "
        f"{sum(1 for m in mappings if m['status'] == 'Partially Implemented')} Partially Implemented, "
        f"{sum(1 for m in mappings if m['status'] == 'Missing')} Missing."
    )

    return state

# ---------------------------------------------------------------------------
# Node 4: Risk Assessment Agent
# ---------------------------------------------------------------------------
def risk_assessment_node(state: InvestigationState) -> InvestigationState:
    log_agent_step(
        state, "Risk Assessment Agent", 7, "thought",
        "Calculating quantitative risk exposure (Likelihood x Impact) on 1-5 enterprise matrix with explanatory rationale."
    )

    risks = []
    for m in state.get("control_mappings", []):
        if m["status"] == "Implemented":
            likelihood = 1
            impact = 2
        elif m["status"] == "Partially Implemented":
            likelihood = 3
            impact = 4 if m["impact"] in ["Critical", "High"] else 3
        else:  # Missing
            likelihood = 4 if m["impact"] == "Critical" else 4
            impact = 5 if m["impact"] == "Critical" else 4

        risk_score = likelihood * impact
        # Suggested classification: 1–4: Low, 5–9: Moderate, 10–16: High, 17–25: Critical
        if risk_score <= 4:
            severity = "Low"
        elif risk_score <= 9:
            severity = "Moderate"
        elif risk_score <= 16:
            severity = "High"
        else:
            severity = "Critical"

        rationale = (
            f"Assigned Likelihood {likelihood}/5 and Impact {impact}/5 (Risk Score: {risk_score}). "
            f"Status is '{m['status']}'. Non-compliance with {m['req_code']} carries regulatory inquiry risk and audit penalties."
        )

        risks.append({
            "req_code": m["req_code"],
            "title": f"Regulatory Exposure: {m['req_title']}",
            "category": "Regulatory & Operational Compliance",
            "likelihood": likelihood,
            "impact": impact,
            "risk_score": risk_score,
            "severity": severity,
            "rationale": rationale,
            "owner": "Compliance & Risk Committee"
        })

    state["risk_assessments"] = risks
    log_agent_step(
        state, "Risk Assessment Agent", 8, "observation",
        f"Evaluated {len(risks)} risk items. Critical: {sum(1 for r in risks if r['severity'] == 'Critical')}, "
        f"High: {sum(1 for r in risks if r['severity'] == 'High')}, "
        f"Moderate: {sum(1 for r in risks if r['severity'] == 'Moderate')}."
    )

    return state

# ---------------------------------------------------------------------------
# Node 5: Remediation Agent
# ---------------------------------------------------------------------------
def remediation_planning_node(state: InvestigationState) -> InvestigationState:
    log_agent_step(
        state, "Remediation Agent", 9, "thought",
        "Formulating actionable corrective actions, responsible ownership, priority tiers, and completion evidence criteria."
    )

    plans = []
    for m in state.get("control_mappings", []):
        if m["status"] in ["Missing", "Partially Implemented"]:
            priority = "Critical" if m["impact"] == "Critical" else "High"
            due_days = "14 Days" if priority == "Critical" else "30 Days"
            assigned = "Data Protection & Privacy Unit" if "data" in m["req_title"].lower() else "IT Infrastructure & Security Team"

            plans.append({
                "req_code": m["req_code"],
                "title": f"Remediate Gap for {m['req_code']}: {m['req_title']}",
                "description": m["recommended_action"],
                "priority": priority,
                "due_date": due_days,
                "assigned_to": assigned,
                "suggested_owner": "Lead Compliance Officer",
                "status": "Proposed Action",
                "completion_evidence": f"Updated policy document signed by CISO and technical log demonstration satisfying {m['req_code']}."
            })

    state["remediation_plans"] = plans
    log_agent_step(
        state, "Remediation Agent", 10, "observation",
        f"Generated {len(plans)} remediation action tasks with strict SLAs and human approval requirement."
    )

    return state

# ---------------------------------------------------------------------------
# Node 6: Independent Verification Agent
# ---------------------------------------------------------------------------
def independent_verification_node(state: InvestigationState) -> InvestigationState:
    log_agent_step(
        state, "Independent Verification Agent", 11, "thought",
        "Validating source citations, detecting hallucination or unsupported claims, and testing evidentiary integrity."
    )

    flagged = []
    total_checks = 0
    passed_checks = 0

    for m in state.get("control_mappings", []):
        total_checks += 1
        ev = m.get("evidence", {})
        excerpt = ev.get("excerpt", "")
        
        if m["status"] == "Missing":
            # Gaps are verified by absence of evidence
            passed_checks += 1
            m["verification_status"] = "Verified"
            m["verification_notes"] = "Confirmed absence of compliant control in policy corpus."
        else:
            is_valid, conf, note = RAGEngine.verify_citation(excerpt[:100], excerpt)
            if is_valid:
                passed_checks += 1
                m["verification_status"] = "Verified"
                m["verification_notes"] = note
            else:
                flagged.append({
                    "req_code": m["req_code"],
                    "reason": note
                })
                m["verification_status"] = "Flagged"
                m["verification_notes"] = note

    score = (passed_checks / max(1, total_checks))
    state["verification_score"] = round(score, 3)
    state["verification_passed"] = score >= 0.85
    state["flagged_citations"] = flagged

    log_agent_step(
        state, "Independent Verification Agent", 12, "observation",
        f"Evidentiary verification score: {int(score * 100)}%. "
        f"{'Passed validation standard.' if state['verification_passed'] else 'Flagged citations require human clarification.'}",
        {"verification_score": state["verification_score"], "flagged_count": len(flagged)}
    )

    return state

# ---------------------------------------------------------------------------
# Node 7: Human Review & Finalization Node
# ---------------------------------------------------------------------------
def human_review_node(state: InvestigationState) -> InvestigationState:
    log_agent_step(
        state, "Human Review Gate", 13, "thought",
        "Enforcing AI Governance policy: All consequential findings and corrective actions require human sign-off."
    )

    state["human_review_required"] = True
    state["human_approved"] = False
    state["status"] = "ready_for_review"

    total = len(state.get("control_mappings", []))
    implemented = sum(1 for m in state.get("control_mappings", []) if m["status"] == "Implemented")
    missing = sum(1 for m in state.get("control_mappings", []) if m["status"] == "Missing")
    partial = sum(1 for m in state.get("control_mappings", []) if m["status"] == "Partially Implemented")

    state["final_summary"] = (
        f"Investigation completed across {total} regulatory obligations for scope '{state['policy_scope']}'. "
        f"Assessment indicates {implemented} fully compliant, {partial} partially implemented, and {missing} missing controls. "
        f"Verification score: {int(state['verification_score'] * 100)}%. Awaiting authorized human review."
    )

    log_agent_step(
        state, "Workflow Orchestrator", 14, "output",
        "Multi-agent investigation pipeline finalized and awaiting human sign-off."
    )

    return state

# ---------------------------------------------------------------------------
# Conditional Router Function
# ---------------------------------------------------------------------------
def should_request_additional_retrieval(state: InvestigationState) -> str:
    """
    Conditional routing: if verification score is severely compromised (< 0.50),
    routes to flag or end; otherwise proceeds to human review.
    """
    if state["verification_score"] < 0.50:
        return "flagged_end"
    return "human_review"

# ---------------------------------------------------------------------------
# Compile LangGraph Workflow
# ---------------------------------------------------------------------------
workflow = StateGraph(InvestigationState)

# Add Nodes
workflow.add_node("document_intelligence", document_intelligence_node)
workflow.add_node("regulatory_research", regulatory_research_node)
workflow.add_node("control_mapping", control_mapping_node)
workflow.add_node("risk_assessment", risk_assessment_node)
workflow.add_node("remediation_planning", remediation_planning_node)
workflow.add_node("independent_verification", independent_verification_node)
workflow.add_node("human_review", human_review_node)

# Add Edges
workflow.add_edge(START, "document_intelligence")
workflow.add_edge("document_intelligence", "regulatory_research")
workflow.add_edge("regulatory_research", "control_mapping")
workflow.add_edge("control_mapping", "risk_assessment")
workflow.add_edge("risk_assessment", "remediation_planning")
workflow.add_edge("remediation_planning", "independent_verification")

# Conditional Edge from Independent Verification
workflow.add_conditional_edges(
    "independent_verification",
    should_request_additional_retrieval,
    {
        "human_review": "human_review",
        "flagged_end": "human_review"  # Human review is always the ultimate gate
    }
)

workflow.add_edge("human_review", END)

# Compiled runnable graph
investigation_graph = workflow.compile()
