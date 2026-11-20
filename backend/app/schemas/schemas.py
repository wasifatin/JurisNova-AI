from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field

# ----------------- Authentication & Users -----------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization_name: Optional[str] = "Acme Financial Services"
    system_role: Optional[str] = "Compliance Officer"

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    system_role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Organizations -----------------
class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    domain: Optional[str] = None
    jurisdiction: str
    industry: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Documents -----------------
class DocumentChunkResponse(BaseModel):
    id: str
    chunk_index: int
    content: str
    page_number: int
    section_title: Optional[str] = None
    token_count: int

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: str
    organization_id: str
    title: str
    file_name: str
    file_type: str
    file_size: int
    category: str
    status: str
    page_count: int
    chunk_count: int
    doc_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Regulatory & Requirements -----------------
class RequirementResponse(BaseModel):
    id: str
    source_id: str
    req_code: str
    title: str
    description: str
    domain: str
    severity: str
    full_text: Optional[str] = None

    class Config:
        from_attributes = True

class RegulatorySourceResponse(BaseModel):
    id: str
    title: str
    code: str
    jurisdiction: str
    issuing_authority: str
    publication_date: Optional[str] = None
    effective_date: Optional[str] = None
    version: str
    category: str
    description: Optional[str] = None
    is_synthetic: bool
    requirements: List[RequirementResponse] = []

    class Config:
        from_attributes = True

# ----------------- Controls & Mappings -----------------
class ControlCreate(BaseModel):
    control_code: str
    title: str
    description: str
    category: Optional[str] = "Security Operations"
    implementation_status: Optional[str] = "Implemented"
    owner: Optional[str] = "CISO Office"
    policy_reference: Optional[str] = None

class ControlResponse(BaseModel):
    id: str
    organization_id: str
    control_code: str
    title: str
    description: str
    category: str
    implementation_status: str
    owner: str
    policy_reference: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Evidence & Findings -----------------
class EvidenceResponse(BaseModel):
    id: str
    document_id: str
    document_name: str
    chunk_id: Optional[str] = None
    page_number: int
    section_title: Optional[str] = None
    excerpt: str
    confidence_score: float
    verification_passed: bool

    class Config:
        from_attributes = True

class ComplianceFindingResponse(BaseModel):
    id: str
    assessment_id: str
    requirement_id: Optional[str] = None
    control_id: Optional[str] = None
    status: str  # Implemented, Partially Implemented, Missing, Not Verifiable
    confidence: float
    impact: str
    explanation: str
    recommended_action: str
    verification_status: str
    verification_notes: Optional[str] = None
    human_review_status: str
    human_reviewer: Optional[str] = None
    human_review_notes: Optional[str] = None
    requirement: Optional[RequirementResponse] = None
    control: Optional[ControlResponse] = None
    evidence_items: List[EvidenceResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

class FindingStatusUpdate(BaseModel):
    human_review_status: str  # Approved, Rejected, Overridden
    human_reviewer: str
    human_review_notes: Optional[str] = None
    override_status: Optional[str] = None  # Implemented, Partially Implemented, Missing, Not Verifiable

# ----------------- Compliance Assessment -----------------
class ComplianceAssessmentResponse(BaseModel):
    id: str
    organization_id: str
    title: str
    scope_jurisdiction: str
    status: str
    overall_score: float
    total_requirements: int
    compliant_count: int
    partial_count: int
    missing_count: int
    unverified_count: int
    agent_execution_id: Optional[str] = None
    assessment_summary: Optional[str] = None
    known_limitations: Optional[str] = None
    findings: List[ComplianceFindingResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Risk Intelligence -----------------
class RiskAssessmentResponse(BaseModel):
    id: str
    organization_id: str
    finding_id: Optional[str] = None
    title: str
    category: str
    likelihood: int
    impact: int
    risk_score: int
    severity: str
    rationale: str
    owner: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class RiskUpdate(BaseModel):
    likelihood: Optional[int] = Field(None, ge=1, le=5)
    impact: Optional[int] = Field(None, ge=1, le=5)
    owner: Optional[str] = None
    status: Optional[str] = None

# ----------------- Remediation Management -----------------
class RemediationTaskCreate(BaseModel):
    finding_id: Optional[str] = None
    title: str
    description: str
    priority: Optional[str] = "High"
    due_date: Optional[str] = None
    assigned_to: Optional[str] = "IT Infrastructure Team"
    suggested_owner: Optional[str] = "Lead Compliance Officer"

class RemediationTaskResponse(BaseModel):
    id: str
    organization_id: str
    finding_id: Optional[str] = None
    title: str
    description: str
    priority: str
    due_date: Optional[str] = None
    status: str
    assigned_to: str
    suggested_owner: str
    completion_evidence: Optional[str] = None
    approval_status: str
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RemediationStatusUpdate(BaseModel):
    status: Optional[str] = None
    completion_evidence: Optional[str] = None
    approval_status: Optional[str] = None
    approved_by: Optional[str] = None

# ----------------- Multi-Agent Orchestration -----------------
class AgentMessageResponse(BaseModel):
    id: str
    agent_name: str
    step_order: int
    message_type: str
    content: str
    metadata_json: Optional[Dict[str, Any]] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class AgentRunResponse(BaseModel):
    id: str
    organization_id: str
    workflow_name: str
    status: str
    input_params: Dict[str, Any]
    output_data: Dict[str, Any]
    verification_score: float
    latency_ms: int
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    messages: List[AgentMessageResponse] = []

    class Config:
        from_attributes = True

class RunInvestigationRequest(BaseModel):
    policy_scope: str = Field(..., description="e.g. Data Retention, Cloud Access, Incident Response")
    regulatory_source_id: str = Field(..., description="ID of the regulatory source e.g. Bangladesh Bank ICT Guidelines")
    document_ids: Optional[List[str]] = Field(default=[], description="Selected internal policy documents")
    jurisdiction: Optional[str] = "Bangladesh"

# ----------------- Assistant & RAG Chat -----------------
class CitationItem(BaseModel):
    document_id: str
    document_name: str
    page_number: int
    section: Optional[str] = None
    excerpt: str
    confidence: float
    source_type: str = "Internal Policy"

class GovernanceAssistantQuery(BaseModel):
    query: str
    jurisdiction_filter: Optional[str] = None
    document_filter: Optional[List[str]] = None
    conversation_history: Optional[List[Dict[str, str]]] = []

class GovernanceAssistantResponse(BaseModel):
    query: str
    evidence_found: bool
    retrieved_evidence: str
    interpretation: str
    recommendations: str
    citations: List[CitationItem] = []
    uncertainty_level: str  # None, Low, Moderate, High (Insufficient Evidence)
    disclaimer: str = "JurisNova AI outputs provide regulatory intelligence and evidence-backed compliance analysis; they do not constitute formal legal counsel."

# ----------------- Prompt Templates -----------------
class PromptTemplateResponse(BaseModel):
    id: str
    name: str
    version: str
    category: str
    template_text: str
    input_variables: List[str]
    description: Optional[str] = None
    defense_rules: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Audit Logs -----------------
class AuditLogResponse(BaseModel):
    id: str
    organization_id: str
    user_email: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Dict[str, Any]
    ip_address: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- AI Evaluation -----------------
class EvaluationResponse(BaseModel):
    id: str
    total_scenarios: int
    precision_at_k: float
    citation_accuracy: float
    faithfulness_score: float
    gap_detection_f1: float
    risk_consistency: float
    avg_latency_ms: int
    token_usage_avg: int
    pass_rate: float
    results_json: Dict[str, Any]
    methodology: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
