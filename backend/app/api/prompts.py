from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import PromptTemplate
from app.schemas.schemas import PromptTemplateResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/prompts", tags=["Prompt Library & AI Guardrails"])

@router.get("", response_model=List[PromptTemplateResponse])
def list_prompts(db: Session = Depends(get_db)):
    return db.query(PromptTemplate).order_by(PromptTemplate.created_at.asc()).all()

@router.patch("/{prompt_id}", response_model=PromptTemplateResponse)
def update_prompt(
    prompt_id: str,
    payload: dict,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prompt = db.query(PromptTemplate).filter(PromptTemplate.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt template not found")

    if "template_text" in payload:
        prompt.template_text = payload["template_text"]
    if "defense_rules" in payload:
        prompt.defense_rules = payload["defense_rules"]
    if "is_active" in payload:
        prompt.is_active = payload["is_active"]

    db.commit()
    db.refresh(prompt)
    return prompt
