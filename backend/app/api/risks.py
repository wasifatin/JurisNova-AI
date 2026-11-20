from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import RiskAssessment, AuditLog
from app.schemas.schemas import RiskAssessmentResponse, RiskUpdate
from app.api.deps import get_current_org, get_current_user

router = APIRouter(prefix="/risks", tags=["Risk Intelligence Center"])

@router.get("", response_model=List[RiskAssessmentResponse])
def list_risks(
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    return db.query(RiskAssessment).filter(
        RiskAssessment.organization_id == org.id
    ).order_by(RiskAssessment.risk_score.desc()).all()

@router.get("/matrix")
def get_risk_matrix(
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns 5x5 Likelihood x Impact matrix with aggregated risk items.
    """
    risks = db.query(RiskAssessment).filter(
        RiskAssessment.organization_id == org.id
    ).all()

    matrix = []
    # Row: Likelihood (5 down to 1), Col: Impact (1 up to 5)
    for l in range(5, 0, -1):
        row = []
        for imp in range(1, 6):
            score = l * imp
            if score <= 4:
                sev = "Low"
                color = "#30ED7B"
            elif score <= 9:
                sev = "Moderate"
                color = "#EAB308"
            elif score <= 16:
                sev = "High"
                color = "#F97316"
            else:
                sev = "Critical"
                color = "#EF4444"

            matching_risks = [
                {
                    "id": r.id,
                    "title": r.title,
                    "category": r.category or "Operational Compliance",
                    "likelihood": r.likelihood,
                    "impact": r.impact,
                    "risk_score": r.risk_score,
                    "score": r.risk_score,
                    "severity": r.severity,
                    "ai_explanation": r.rationale or "AI-assessed risk score derived from control gaps and regulatory enforcement precedents.",
                    "rationale": r.rationale or "AI-assessed risk score derived from control gaps and regulatory enforcement precedents.",
                    "owner": r.owner or "CISO Office & Risk Committee",
                    "status": r.status or "Identified"
                }
                for r in risks if r.likelihood == l and r.impact == imp
            ]

            row.append({
                "likelihood": l,
                "impact": imp,
                "score": score,
                "severity": sev,
                "color": color,
                "count": len(matching_risks),
                "items": matching_risks
            })
        matrix.append(row)

    return {
        "matrix": matrix,
        "total_risks": len(risks),
        "critical_count": sum(1 for r in risks if r.severity == "Critical"),
        "high_count": sum(1 for r in risks if r.severity == "High"),
        "moderate_count": sum(1 for r in risks if r.severity == "Moderate"),
        "low_count": sum(1 for r in risks if r.severity == "Low"),
    }

@router.patch("/{risk_id}", response_model=RiskAssessmentResponse)
def update_risk(
    risk_id: str,
    payload: RiskUpdate,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    risk = db.query(RiskAssessment).filter(
        RiskAssessment.id == risk_id,
        RiskAssessment.organization_id == org.id
    ).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk record not found")

    if payload.likelihood is not None:
        risk.likelihood = payload.likelihood
    if payload.impact is not None:
        risk.impact = payload.impact

    risk.risk_score = risk.likelihood * risk.impact
    if risk.risk_score <= 4:
        risk.severity = "Low"
    elif risk.risk_score <= 9:
        risk.severity = "Moderate"
    elif risk.risk_score <= 16:
        risk.severity = "High"
    else:
        risk.severity = "Critical"

    if payload.owner:
        risk.owner = payload.owner
    if payload.status:
        risk.status = payload.status

    db.commit()
    db.refresh(risk)
    return risk
