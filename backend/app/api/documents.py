import os
import shutil
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.all_models import Document, DocumentChunk, DocumentVersion, AuditLog
from app.schemas.schemas import DocumentResponse, DocumentChunkResponse
from app.api.deps import get_current_org, get_current_user
from app.services.document_processor import DocumentProcessor
from app.services.embedding_service import EmbeddingService

router = APIRouter(prefix="/documents", tags=["Document Intelligence & RAG Pipeline"])

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "txt", "md"}

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(None),
    category: str = Form("Internal Policy"),
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    file_title = title or file.filename.rsplit(".", 1)[0].replace("_", " ").title()
    saved_file_name = f"{org.id}_{int(os.times().elapsed)}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_file_name)

    # Save to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)

    # 1. Create Document Record
    doc_record = Document(
        organization_id=org.id,
        title=file_title,
        file_name=file.filename,
        file_type=ext,
        file_size=file_size,
        file_path=file_path,
        category=category,
        status="extracting",
        doc_metadata={"uploader": user.full_name, "version": "1.0"}
    )
    db.add(doc_record)
    db.flush()

    try:
        # 2. Extract content using PyMuPDF / python-docx
        pages_data = DocumentProcessor.process_file(file_path, ext)
        doc_record.page_count = max(1, len(pages_data))
        doc_record.status = "chunking"

        # 3. Chunk Document
        chunks = DocumentProcessor.chunk_document(pages_data)
        doc_record.chunk_count = len(chunks)

        # 4. Embed Chunks & Store
        for c in chunks:
            chunk_rec = DocumentChunk(
                document_id=doc_record.id,
                chunk_index=c["chunk_index"],
                content=c["content"],
                clean_text=c["clean_text"],
                page_number=c["page_number"],
                section_title=c["section_title"],
                token_count=c["token_count"],
                embedding=EmbeddingService.generate_embedding(c["content"])
            )
            db.add(chunk_rec)

        # 5. Version record
        version_rec = DocumentVersion(
            document_id=doc_record.id,
            version_number="1.0",
            change_summary="Initial document ingestion and RAG vector indexing.",
            file_path=file_path
        )
        db.add(version_rec)

        doc_record.status = "indexed"

        # 6. Audit Trail
        audit = AuditLog(
            organization_id=org.id,
            user_id=user.id,
            user_email=user.email,
            action="DOCUMENT_UPLOADED",
            resource_type="Document",
            resource_id=doc_record.id,
            details={"title": file_title, "chunks": len(chunks), "pages": doc_record.page_count}
        )
        db.add(audit)
        db.commit()
        db.refresh(doc_record)
        return doc_record

    except Exception as e:
        db.rollback()
        doc_record.status = "failed"
        doc_record.doc_metadata = {"error": str(e)}
        db.commit()
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")

@router.get("", response_model=List[DocumentResponse])
def list_documents(
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    return db.query(Document).filter(
        Document.organization_id == org.id
    ).order_by(Document.created_at.desc()).all()

@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document_details(
    doc_id: str,
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(
        Document.id == doc_id,
        Document.organization_id == org.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/{doc_id}/chunks", response_model=List[DocumentChunkResponse])
def get_document_chunks(
    doc_id: str,
    org = Depends(get_current_org),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(
        Document.id == doc_id,
        Document.organization_id == org.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return db.query(DocumentChunk).filter(
        DocumentChunk.document_id == doc_id
    ).order_by(DocumentChunk.chunk_index.asc()).all()

@router.delete("/{doc_id}")
def delete_document(
    doc_id: str,
    org = Depends(get_current_org),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(
        Document.id == doc_id,
        Document.organization_id == org.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Audit log
    audit = AuditLog(
        organization_id=org.id,
        user_id=user.id,
        user_email=user.email,
        action="DOCUMENT_DELETED",
        resource_type="Document",
        resource_id=doc.id,
        details={"title": doc.title}
    )
    db.add(audit)
    db.delete(doc)
    db.commit()
    return {"status": "success", "message": f"Document '{doc.title}' deleted successfully."}
