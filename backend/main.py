import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base
from app.db.seed import seed_database
from app.db.governance_seed import seed_governance_data

# Routers
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.documents import router as documents_router
from app.api.regulatory import router as regulatory_router
from app.api.compliance import router as compliance_router
from app.api.risks import router as risks_router
from app.api.remediation import router as remediation_router
from app.api.assistant import router as assistant_router
from app.api.agents import router as agents_router
from app.api.audits import router as audits_router
from app.api.prompts import router as prompts_router
from app.api.evaluations import router as evaluations_router
from app.api.organizations import router as org_router
from app.api.governance import router as governance_router

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "JurisNova AI: Multi-Agent Governance, Risk and Compliance (GRC) Intelligence Platform. "
        "Built for AI Builders World Congress 2026 GovernanceIQ Challenge."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers under API v1
api_v1 = settings.API_V1_STR
app.include_router(auth_router, prefix=api_v1)
app.include_router(dashboard_router, prefix=api_v1)
app.include_router(documents_router, prefix=api_v1)
app.include_router(regulatory_router, prefix=api_v1)
app.include_router(compliance_router, prefix=api_v1)
app.include_router(risks_router, prefix=api_v1)
app.include_router(remediation_router, prefix=api_v1)
app.include_router(assistant_router, prefix=api_v1)
app.include_router(agents_router, prefix=api_v1)
app.include_router(audits_router, prefix=api_v1)
app.include_router(prompts_router, prefix=api_v1)
app.include_router(evaluations_router, prefix=api_v1)
app.include_router(org_router, prefix=api_v1)
app.include_router(governance_router, prefix=api_v1)

@app.on_event("startup")
def on_startup():
    print("[*] Starting JurisNova AI Platform...")
    Base.metadata.create_all(bind=engine)
    seed_database()
    seed_governance_data()
    print("[*] Backend startup sequence complete. Ready for requests.")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JurisNova AI Engine",
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "environment": settings.ENVIRONMENT
    }

@app.get("/")
def root():
    return {
        "project": "JurisNova AI",
        "tagline": "Governance Intelligence. Compliance Clarity. Trusted Decisions.",
        "category": "Legal, Compliance & Trust Technologies",
        "event": "AI Builders World Congress 2026",
        "challenge": "GovernanceIQ",
        "api_docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
