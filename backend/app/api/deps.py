from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.all_models import User, Organization

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    if credentials:
        user_id = decode_access_token(credentials.credentials)
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user

    # Default to seed Compliance Officer for convenient testing / demo mode
    fallback_user = db.query(User).filter(User.email == "fatinwasi321@jurisnova.ai").first()
    if not fallback_user:
        fallback_user = db.query(User).first()
    if fallback_user:
        return fallback_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or active session"
    )

def get_current_org(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Organization:
    if current_user.memberships:
        return current_user.memberships[0].organization
    
    org = db.query(Organization).first()
    if org:
        return org

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Organization context not found"
    )
