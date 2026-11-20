from typing import List, Optional
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import AuditLog, ComplianceFinding, RiskAssessment, RemediationTask, ComplianceAssessment
from app.schemas.schemas import AuditLogResponse
from app.api.deps import get_current_org, get_current_user
from app.services.report_generator import ReportGenerator

router = APIRouter(prefix="/audits", tags=["Audit Trails & Formal Reports"])

@router.get("/logs", response_model=List[AuditLogResponse])
def list_audit_logs(
    limit: int = 50,
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    return db.query(AuditLog).filter(
        AuditLog.organization_id == org.id
    ).order_by(AuditLog.created_at.desc()).limit(limit).all()

@router.get("/export/pdf")
def export_compliance_report_pdf(
    assessment_id: Optional[str] = None,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates and downloads an official executive PDF report using ReportLab.
    """
    if assessment_id:
        assessment = db.query(ComplianceAssessment).filter(
            ComplianceAssessment.id == assessment_id,
            ComplianceAssessment.organization_id == org.id
        ).first()
    else:
        assessment = db.query(ComplianceAssessment).filter(
            ComplianceAssessment.organization_id == org.id
        ).order_by(ComplianceAssessment.created_at.desc()).first()

    title = assessment.title if assessment else "Unified Compliance & Risk Audit"
    score = assessment.overall_score if assessment else 78.5
    scope = assessment.scope_jurisdiction if assessment else "Bangladesh Bank ICT Guidelines & EU GDPR"

    # Gather data
    findings = db.query(ComplianceFinding).filter(ComplianceFinding.organization_id == org.id).all()
    findings_data = [
        {
            "req_code": f.requirement.req_code if f.requirement else "N/A",
            "explanation": f.explanation,
            "status": f.status,
            "impact": f.impact,
            "verification_status": f.verification_status
        }
        for f in findings
    ]

    risks = db.query(RiskAssessment).filter(RiskAssessment.organization_id == org.id).all()
    risks_data = [
        {
            "title": r.title,
            "category": r.category,
            "likelihood": r.likelihood,
            "impact": r.impact,
            "risk_score": r.risk_score,
            "severity": r.severity
        }
        for r in risks
    ]

    remediations = db.query(RemediationTask).filter(RemediationTask.organization_id == org.id).all()
    remediations_data = [
        {
            "title": rem.title,
            "assigned_to": rem.assigned_to,
            "priority": rem.priority,
            "due_date": rem.due_date,
            "status": rem.status
        }
        for rem in remediations
    ]

    pdf_bytes = ReportGenerator.generate_compliance_pdf(
        organization_name=org.name,
        assessment_title=title,
        scope_jurisdiction=scope,
        overall_score=score,
        findings=findings_data,
        risks=risks_data,
        remediations=remediations_data,
        reviewer_name=user.full_name
    )

    filename = f"JurisNova_Compliance_Report_{org.slug}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
