from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import AgentRun
from app.schemas.schemas import AgentRunResponse
from app.api.deps import get_current_org

router = APIRouter(prefix="/agents", tags=["Multi-Agent Tracing & Observability"])

@router.get("/runs", response_model=List[AgentRunResponse])
def list_agent_runs(
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    return db.query(AgentRun).filter(
        AgentRun.organization_id == org.id
    ).order_by(AgentRun.started_at.desc()).all()

@router.get("/runs/{run_id}", response_model=AgentRunResponse)
def get_agent_run(
    run_id: str,
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    run = db.query(AgentRun).filter(
        AgentRun.id == run_id,
        AgentRun.organization_id == org.id
    ).first()
    if not run:
        raise HTTPException(status_code=404, detail="Agent run not found")
    return run
