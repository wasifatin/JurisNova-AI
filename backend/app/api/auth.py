from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.all_models import User, Organization, OrganizationMember
from app.schemas.schemas import Token, LoginRequest, RegisterRequest, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")

    access_token = create_access_token(subject=user.id)
    org_id = user.memberships[0].organization_id if user.memberships else None
    org_name = user.memberships[0].organization.name if user.memberships else "Default Org"

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "system_role": user.system_role,
            "organization_id": org_id,
            "organization_name": org_name
        }
    }

@router.post("/register", response_model=Token)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already registered")

    # Check or create organization
    org = db.query(Organization).first()
    if not org:
        org = Organization(
            name=request.organization_name or "Acme Governance Corp",
            slug="acme-gov",
            jurisdiction="Bangladesh & Global",
            industry="Trust Technologies"
        )
        db.add(org)
        db.flush()

    new_user = User(
        email=request.email,
        hashed_password=get_password_hash(request.password),
        full_name=request.full_name,
        system_role=request.system_role or "Compliance Officer"
    )
    db.add(new_user)
    db.flush()

    membership = OrganizationMember(
        user_id=new_user.id,
        organization_id=org.id,
        role=new_user.system_role
    )
    db.add(membership)
    db.commit()

    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "system_role": new_user.system_role,
            "organization_id": org.id,
            "organization_name": org.name
        }
    }

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
