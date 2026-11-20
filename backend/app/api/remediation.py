from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import RemediationTask, AuditLog
from app.schemas.schemas import RemediationTaskResponse, RemediationTaskCreate, RemediationStatusUpdate
from app.api.deps import get_current_org, get_current_user

router = APIRouter(prefix="/remediation", tags=["Remediation Management & Human Approvals"])

@router.get("/tasks", response_model=List[RemediationTaskResponse])
def list_tasks(
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    query = db.query(RemediationTask).filter(RemediationTask.organization_id == org.id)
    if status_filter:
        query = query.filter(RemediationTask.status == status_filter)
    if priority_filter:
        query = query.filter(RemediationTask.priority == priority_filter)
    return query.order_by(RemediationTask.created_at.desc()).all()

@router.post("/tasks", response_model=RemediationTaskResponse)
def create_task(
    payload: RemediationTaskCreate,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = RemediationTask(
        organization_id=org.id,
        finding_id=payload.finding_id,
        title=payload.title,
        description=payload.description,
        priority=payload.priority or "High",
        due_date=payload.due_date or "30 Days",
        assigned_to=payload.assigned_to or "IT Infrastructure Team",
        suggested_owner=payload.suggested_owner or user.full_name,
        status="Proposed Action",
        approval_status="Pending Review"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.patch("/tasks/{task_id}", response_model=RemediationTaskResponse)
def update_task_progress(
    task_id: str,
    payload: RemediationStatusUpdate,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(RemediationTask).filter(
        RemediationTask.id == task_id,
        RemediationTask.organization_id == org.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Remediation task not found")

    if payload.status:
        task.status = payload.status
    if payload.completion_evidence:
        task.completion_evidence = payload.completion_evidence

    # If status transitioned to Completed or Verified
    if task.status in ["Completed", "Verified"]:
        audit = AuditLog(
            organization_id=org.id,
            user_id=user.id,
            user_email=user.email,
            action="REMEDIATION_EVIDENCE_SUBMITTED",
            resource_type="RemediationTask",
            resource_id=task.id,
            details={"status": task.status, "evidence": payload.completion_evidence}
        )
        db.add(audit)

    db.commit()
    db.refresh(task)
    return task

@router.post("/tasks/{task_id}/approve", response_model=RemediationTaskResponse)
def approve_remediation_action(
    task_id: str,
    payload: dict,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Enforces governance rule: Human reviewer approval required to transition
    from 'Proposed Action' to 'Approved' / 'Assigned'.
    """
    task = db.query(RemediationTask).filter(
        RemediationTask.id == task_id,
        RemediationTask.organization_id == org.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Remediation task not found")

    action = payload.get("action", "Approved")  # Approved or Rejected
    task.approval_status = action
    task.approved_by = user.full_name
    task.approved_at = datetime.now(timezone.utc)

    if action == "Approved":
        task.status = "Approved"
    else:
        task.status = "Rejected"

    audit = AuditLog(
        organization_id=org.id,
        user_id=user.id,
        user_email=user.email,
        action="REMEDIATION_HUMAN_APPROVED" if action == "Approved" else "REMEDIATION_HUMAN_REJECTED",
        resource_type="RemediationTask",
        resource_id=task.id,
        details={"approved_by": user.full_name, "decision": action}
    )
    db.add(audit)
    db.commit()
    db.refresh(task)
    return task
