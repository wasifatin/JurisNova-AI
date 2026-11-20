from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Organization, OrganizationMember, User
from app.schemas.schemas import OrganizationResponse
from app.api.deps import get_current_org, get_current_user

router = APIRouter(prefix="/organizations", tags=["Organization Management & RBAC"])

@router.get("/current", response_model=OrganizationResponse)
def get_organization(org = Depends(get_current_org)):
    return org

@router.get("/members")
def get_org_members(
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    memberships = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org.id
    ).all()
    
    return [
        {
            "id": m.id,
            "user_id": m.user_id,
            "full_name": m.user.full_name if m.user else "User",
            "email": m.user.email if m.user else "user@jurisnova.ai",
            "role": m.role,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in memberships
    ]

@router.patch("/current")
def update_organization(
    payload: dict,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if "name" in payload:
        org.name = payload["name"]
    if "jurisdiction" in payload:
        org.jurisdiction = payload["jurisdiction"]
    if "industry" in payload:
        org.industry = payload["industry"]
    if "domain" in payload:
        org.domain = payload["domain"]

    db.commit()
    db.refresh(org)
    return org
