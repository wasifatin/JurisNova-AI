import time
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import (
    ComplianceAssessment, ComplianceFinding, Evidence,
    RiskAssessment, RemediationTask, AgentRun, AgentMessage,
    AuditLog, Requirement, Control, RegulatorySource
)
from app.schemas.schemas import (
    ComplianceAssessmentResponse, ComplianceFindingResponse,
    RunInvestigationRequest, FindingStatusUpdate
)
from app.api.deps import get_current_org, get_current_user
from app.agents.workflow import investigation_graph
from app.agents.state import InvestigationState

router = APIRouter(prefix="/compliance", tags=["Compliance Gap Analyzer & Investigation"])

@router.get("/assessments", response_model=List[ComplianceAssessmentResponse])
def list_assessments(
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    return db.query(ComplianceAssessment).filter(
        ComplianceAssessment.organization_id == org.id
    ).order_by(ComplianceAssessment.created_at.desc()).all()

@router.get("/assessments/{assessment_id}", response_model=ComplianceAssessmentResponse)
def get_assessment(
    assessment_id: str,
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    assessment = db.query(ComplianceAssessment).filter(
        ComplianceAssessment.id == assessment_id,
        ComplianceAssessment.organization_id == org.id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Compliance assessment not found")
    return assessment

@router.post("/investigate", response_model=ComplianceAssessmentResponse)
def run_compliance_investigation(
    payload: RunInvestigationRequest,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    SIGNATURE FEATURE: Triggers the multi-agent LangGraph governance workflow:
    1. Document Intelligence Agent extracts policy clauses.
    2. Regulatory Research Agent searches obligations.
    3. Control Mapping Agent compares controls & identifies gaps.
    4. Risk Assessment Agent calculates 1-5 matrix likelihood & impact.
    5. Remediation Agent drafts corrective action plans.
    6. Independent Verification Agent validates citations & tests against hallucination.
    7. Human Review Gate flags findings for official sign-off.
    """
    start_time = time.time()
    source = db.query(RegulatorySource).filter(RegulatorySource.id == payload.regulatory_source_id).first()
    source_title = source.title if source else "Bangladesh Bank ICT Guidelines"

    # Initial State for LangGraph
    initial_state: InvestigationState = {
        "investigation_id": f"inv-{int(time.time())}",
        "organization_id": org.id,
        "policy_scope": payload.policy_scope,
        "regulatory_source_id": payload.regulatory_source_id,
        "document_ids": payload.document_ids or [],
        "jurisdiction": payload.jurisdiction or org.jurisdiction,
        "extracted_policies": [],
        "retrieved_requirements": [],
        "control_mappings": [],
        "risk_assessments": [],
        "remediation_plans": [],
        "verification_results": [],
        "verification_passed": True,
        "verification_score": 1.0,
        "flagged_citations": [],
        "human_review_required": True,
        "human_approved": False,
        "execution_trace": [],
        "final_summary": "",
        "status": "processing",
        "error": None
    }

    try:
        # Run LangGraph Orchestrator
        final_state = investigation_graph.invoke(initial_state)
        latency_ms = int((time.time() - start_time) * 1000)

        # 1. Create AgentRun Record
        agent_run = AgentRun(
            organization_id=org.id,
            workflow_name=f"Investigation: {payload.policy_scope}",
            status="completed" if final_state["verification_passed"] else "flagged_verification",
            input_params={
                "policy_scope": payload.policy_scope,
                "regulatory_source": source_title,
                "document_ids": payload.document_ids
            },
            output_data={"final_summary": final_state["final_summary"]},
            verification_score=final_state["verification_score"],
            latency_ms=latency_ms,
            completed_at=datetime.now(timezone.utc)
        )
        db.add(agent_run)
        db.flush()

        # Save Agent Messages for Tracing
        for msg in final_state.get("execution_trace", []):
            db.add(AgentMessage(
                run_id=agent_run.id,
                agent_name=msg["agent_name"],
                step_order=msg["step_order"],
                message_type=msg["message_type"],
                content=msg["content"],
                metadata_json=msg.get("metadata", {})
            ))

        # 2. Count Findings Posture
        mappings = final_state.get("control_mappings", [])
        total_reqs = len(mappings)
        compliant = sum(1 for m in mappings if m["status"] == "Implemented")
        partial = sum(1 for m in mappings if m["status"] == "Partially Implemented")
        missing = sum(1 for m in mappings if m["status"] == "Missing")
        score = round((compliant * 100.0 + partial * 50.0) / max(1, total_reqs), 1)

        # 3. Create Compliance Assessment
        assessment = ComplianceAssessment(
            organization_id=org.id,
            title=f"Investigation: {payload.policy_scope} vs {source_title}",
            scope_jurisdiction=source_title,
            status="in_review",
            overall_score=score,
            total_requirements=total_reqs,
            compliant_count=compliant,
            partial_count=partial,
            missing_count=missing,
            unverified_count=len(final_state.get("flagged_citations", [])),
            agent_execution_id=agent_run.id,
            assessment_summary=final_state["final_summary"],
            known_limitations="Scope limited to currently indexed documents and configured active requirements."
        )
        db.add(assessment)
        db.flush()

        # 4. Save Findings, Evidence, Risks & Remediation Tasks
        for m in mappings:
            # Map or find control
            ctrl = db.query(Control).filter(
                Control.organization_id == org.id,
                Control.title.ilike(f"%{payload.policy_scope}%")
            ).first()

            finding = ComplianceFinding(
                assessment_id=assessment.id,
                organization_id=org.id,
                requirement_id=m["requirement_id"],
                control_id=ctrl.id if ctrl else None,
                status=m["status"],
                confidence=m["confidence"],
                impact=m["impact"],
                explanation=m["explanation"],
                recommended_action=m["recommended_action"],
                verification_status=m.get("verification_status", "Verified"),
                verification_notes=m.get("verification_notes", ""),
                human_review_status="Pending",
                human_reviewer=None
            )
            db.add(finding)
            db.flush()

            # Evidence item
            ev_data = m.get("evidence", {})
            if ev_data.get("document_id"):
                ev = Evidence(
                    finding_id=finding.id,
                    document_id=ev_data["document_id"],
                    document_name=ev_data.get("document_name", "Policy Document"),
                    page_number=ev_data.get("page_number", 1),
                    section_title=ev_data.get("section_title", "Section"),
                    excerpt=ev_data.get("excerpt", ""),
                    confidence_score=m["confidence"],
                    verification_passed=m.get("verification_status") != "Flagged"
                )
                db.add(ev)

            # Corresponding Risk Assessment
            risk_item = next((r for r in final_state.get("risk_assessments", []) if r["req_code"] == m["req_code"]), None)
            if risk_item:
                risk_rec = RiskAssessment(
                    organization_id=org.id,
                    finding_id=finding.id,
                    title=risk_item["title"],
                    category=risk_item["category"],
                    likelihood=risk_item["likelihood"],
                    impact=risk_item["impact"],
                    risk_score=risk_item["risk_score"],
                    severity=risk_item["severity"],
                    rationale=risk_item["rationale"],
                    owner=risk_item["owner"],
                    status="Identified"
                )
                db.add(risk_rec)

            # Corresponding Remediation Task if gap exists
            rem_item = next((p for p in final_state.get("remediation_plans", []) if p["req_code"] == m["req_code"]), None)
            if rem_item:
                rem_rec = RemediationTask(
                    organization_id=org.id,
                    finding_id=finding.id,
                    title=rem_item["title"],
                    description=rem_item["description"],
                    priority=rem_item["priority"],
                    due_date=rem_item["due_date"],
                    status="Proposed Action",
                    assigned_to=rem_item["assigned_to"],
                    suggested_owner=rem_item["suggested_owner"],
                    completion_evidence=rem_item["completion_evidence"],
                    approval_status="Pending Review"
                )
                db.add(rem_rec)

        # 5. Audit Log
        audit = AuditLog(
            organization_id=org.id,
            user_id=user.id,
            user_email=user.email,
            action="INVESTIGATION_EXECUTED",
            resource_type="ComplianceAssessment",
            resource_id=assessment.id,
            details={
                "scope": payload.policy_scope,
                "score": score,
                "agent_run_id": agent_run.id,
                "verification_score": final_state["verification_score"]
            }
        )
        db.add(audit)
        db.commit()
        db.refresh(assessment)
        return assessment

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Multi-agent investigation failed: {str(e)}")

@router.get("/findings", response_model=List[ComplianceFindingResponse])
def list_findings(
    status_filter: Optional[str] = Query(None),
    review_status: Optional[str] = Query(None),
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    query = db.query(ComplianceFinding).filter(ComplianceFinding.organization_id == org.id)
    if status_filter:
        query = query.filter(ComplianceFinding.status == status_filter)
    if review_status:
        query = query.filter(ComplianceFinding.human_review_status == review_status)
    return query.order_by(ComplianceFinding.created_at.desc()).all()

@router.patch("/findings/{finding_id}/review", response_model=ComplianceFindingResponse)
def review_finding(
    finding_id: str,
    payload: FindingStatusUpdate,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    finding = db.query(ComplianceFinding).filter(
        ComplianceFinding.id == finding_id,
        ComplianceFinding.organization_id == org.id
    ).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    finding.human_review_status = payload.human_review_status
    finding.human_reviewer = payload.human_reviewer or user.full_name
    finding.human_review_notes = payload.human_review_notes

    if payload.override_status:
        finding.status = payload.override_status

    # Audit Trail
    audit = AuditLog(
        organization_id=org.id,
        user_id=user.id,
        user_email=user.email,
        action="FINDING_HUMAN_REVIEW",
        resource_type="ComplianceFinding",
        resource_id=finding.id,
        details={
            "status": finding.human_review_status,
            "reviewer": finding.human_reviewer,
            "override": payload.override_status
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(finding)
    return finding
