from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import RegulatorySource, Requirement
from app.schemas.schemas import RegulatorySourceResponse, RequirementResponse
from app.api.deps import get_current_org
from app.services.embedding_service import EmbeddingService

router = APIRouter(prefix="/regulatory", tags=["Regulatory Knowledge Hub"])

@router.get("/sources", response_model=List[RegulatorySourceResponse])
def get_regulatory_sources(
    jurisdiction: Optional[str] = Query(None),
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    query = db.query(RegulatorySource)
    if jurisdiction:
        query = query.filter(RegulatorySource.jurisdiction.ilike(f"%{jurisdiction}%"))
    return query.all()

@router.get("/sources/{source_id}", response_model=RegulatorySourceResponse)
def get_source_details(
    source_id: str,
    db: Session = Depends(get_db)
):
    source = db.query(RegulatorySource).filter(RegulatorySource.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Regulatory source not found")
    return source

@router.get("/requirements", response_model=List[RequirementResponse])
def list_requirements(
    source_id: Optional[str] = Query(None),
    domain: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Requirement)
    if source_id:
        query = query.filter(Requirement.source_id == source_id)
    if domain:
        query = query.filter(Requirement.domain.ilike(f"%{domain}%"))
    return query.all()

@router.post("/requirements/search", response_model=List[RequirementResponse])
def search_requirements(
    payload: dict,
    db: Session = Depends(get_db)
):
    search_text = payload.get("query", "").strip()
    if not search_text:
        return db.query(Requirement).limit(10).all()

    reqs = db.query(Requirement).all()
    query_vec = EmbeddingService.generate_embedding(search_text)

    scored = []
    for r in reqs:
        r_vec = EmbeddingService.generate_embedding(f"{r.req_code} {r.title} {r.description}")
        sim = EmbeddingService.cosine_similarity(query_vec, r_vec)
        scored.append((sim, r))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored[:8]]
