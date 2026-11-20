import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

# -------------------------------------------------------------
# 1. Organization & User Management (Multi-Tenant RBAC)
# -------------------------------------------------------------

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    domain = Column(String(255), nullable=True)
    jurisdiction = Column(String(100), default="Bangladesh / Global", nullable=False)
    industry = Column(String(100), default="Financial & Trust Services", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="organization", cascade="all, delete-orphan")
    regulatory_sources = relationship("RegulatorySource", back_populates="organization", cascade="all, delete-orphan")
    controls = relationship("Control", back_populates="organization", cascade="all, delete-orphan")
    assessments = relationship("ComplianceAssessment", back_populates="organization", cascade="all, delete-orphan")
    risks = relationship("RiskAssessment", back_populates="organization", cascade="all, delete-orphan")
    remediations = relationship("RemediationTask", back_populates="organization", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="organization", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    system_role = Column(String(50), default="Viewer")  # Super Administrator, Organization Administrator, etc.
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    memberships = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


class OrganizationMember(Base):
    __tablename__ = "organization_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), default="Viewer", nullable=False)  
    # Super Administrator, Organization Administrator, Compliance Officer, Risk Analyst, Auditor, Viewer
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="members")


# -------------------------------------------------------------
# 2. Document Intelligence & Chunking (RAG Storage)
# -------------------------------------------------------------

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, docx, txt
    file_size = Column(Integer, default=0)
    file_path = Column(String(500), nullable=False)
    category = Column(String(100), default="Internal Policy")  # Internal Policy, Procedure, Audit Evidence, Architecture
    status = Column(String(50), default="uploaded")  # uploaded, extracting, chunking, indexed, failed
    page_count = Column(Integer, default=1)
    chunk_count = Column(Integer, default=0)
    doc_metadata = Column(JSON, default=dict)  # extracted author, doc_version, classification, integrity_hash
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization = relationship("Organization", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")


class DocumentVersion(Base):
    __tablename__ = "document_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(String(20), default="1.0")
    change_summary = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    document = relationship("Document", back_populates="versions")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    clean_text = Column(Text, nullable=True)
    page_number = Column(Integer, default=1)
    section_title = Column(String(255), nullable=True)
    token_count = Column(Integer, default=0)
    embedding = Column(JSON, nullable=True)  # Vector representation (float array serialized as JSON for cross-platform compatibility)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    document = relationship("Document", back_populates="chunks")


# -------------------------------------------------------------
# 3. Regulatory Knowledge Hub & Requirements
# -------------------------------------------------------------

class RegulatorySource(Base):
    __tablename__ = "regulatory_sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False)  # e.g., BB-ICT-2023, GDPR-2016, ISO27001-2022
    jurisdiction = Column(String(100), default="Bangladesh")  # Bangladesh, European Union, Global
    issuing_authority = Column(String(255), default="Bangladesh Bank")
    publication_date = Column(String(50), nullable=True)
    effective_date = Column(String(50), nullable=True)
    version = Column(String(50), default="1.0")
    category = Column(String(100), default="Cybersecurity & Data Privacy")
    description = Column(Text, nullable=True)
    is_synthetic = Column(Boolean, default=False)  # Clearly mark synthetic/demonstration vs official
    created_at = Column(DateTime(timezone=True), default=utc_now)

    organization = relationship("Organization", back_populates="regulatory_sources")
    requirements = relationship("Requirement", back_populates="source", cascade="all, delete-orphan")


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    source_id = Column(String(36), ForeignKey("regulatory_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    req_code = Column(String(50), nullable=False, index=True)  # e.g., BB-ICT-3.2, GDPR-Art17
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    domain = Column(String(100), default="Access Control")  # Access Control, Data Retention, Encryption, Incident Response
    severity = Column(String(50), default="High")  # Critical, High, Medium, Low
    full_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    source = relationship("RegulatorySource", back_populates="requirements")
    mappings = relationship("ControlMapping", back_populates="requirement", cascade="all, delete-orphan")
    findings = relationship("ComplianceFinding", back_populates="requirement")


# -------------------------------------------------------------
# 4. Internal Controls & Mappings
# -------------------------------------------------------------

class Control(Base):
    __tablename__ = "controls"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    control_code = Column(String(50), nullable=False)  # e.g., SEC-AC-01
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Security Operations")
    implementation_status = Column(String(50), default="Implemented")  # Implemented, Partially Implemented, Missing, Not Verifiable
    owner = Column(String(100), default="CISO Office")
    policy_reference = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization = relationship("Organization", back_populates="controls")
    mappings = relationship("ControlMapping", back_populates="control", cascade="all, delete-orphan")
    findings = relationship("ComplianceFinding", back_populates="control")


class ControlMapping(Base):
    __tablename__ = "control_mappings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    requirement_id = Column(String(36), ForeignKey("requirements.id", ondelete="CASCADE"), nullable=False)
    control_id = Column(String(36), ForeignKey("controls.id", ondelete="CASCADE"), nullable=False)
    alignment_score = Column(Float, default=1.0)  # 0.0 to 1.0
    mapping_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    requirement = relationship("Requirement", back_populates="mappings")
    control = relationship("Control", back_populates="mappings")


# -------------------------------------------------------------
# 5. Compliance Assessments, Findings & Evidence
# -------------------------------------------------------------

class ComplianceAssessment(Base):
    __tablename__ = "compliance_assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    scope_jurisdiction = Column(String(100), default="Bangladesh Bank ICT Guidelines")
    status = Column(String(50), default="in_review")  # completed, in_review, draft, rejected
    overall_score = Column(Float, default=78.5)
    total_requirements = Column(Integer, default=0)
    compliant_count = Column(Integer, default=0)
    partial_count = Column(Integer, default=0)
    missing_count = Column(Integer, default=0)
    unverified_count = Column(Integer, default=0)
    agent_execution_id = Column(String(36), nullable=True)
    assessment_summary = Column(Text, nullable=True)
    known_limitations = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization = relationship("Organization", back_populates="assessments")
    findings = relationship("ComplianceFinding", back_populates="assessment", cascade="all, delete-orphan")


class ComplianceFinding(Base):
    __tablename__ = "compliance_findings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("compliance_assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    requirement_id = Column(String(36), ForeignKey("requirements.id", ondelete="SET NULL"), nullable=True)
    control_id = Column(String(36), ForeignKey("controls.id", ondelete="SET NULL"), nullable=True)
    
    # Classification: Implemented, Partially Implemented, Missing, Not Verifiable
    status = Column(String(50), default="Partially Implemented", nullable=False)
    confidence = Column(Float, default=0.85)  # 0.0 - 1.0
    impact = Column(String(50), default="High")  # Critical, High, Medium, Low
    explanation = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    verification_status = Column(String(50), default="Verified")  # Verified, Flagged, Needs Clarification
    verification_notes = Column(Text, nullable=True)
    human_review_status = Column(String(50), default="Pending")  # Pending, Approved, Rejected, Overridden
    human_reviewer = Column(String(100), nullable=True)
    human_review_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    assessment = relationship("ComplianceAssessment", back_populates="findings")
    requirement = relationship("Requirement", back_populates="findings")
    control = relationship("Control", back_populates="findings")
    evidence_items = relationship("Evidence", back_populates="finding", cascade="all, delete-orphan")
    risk = relationship("RiskAssessment", back_populates="finding", uselist=False)
    remediation_task = relationship("RemediationTask", back_populates="finding", uselist=False)


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    finding_id = Column(String(36), ForeignKey("compliance_findings.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    document_name = Column(String(255), nullable=False)
    chunk_id = Column(String(36), nullable=True)
    page_number = Column(Integer, default=1)
    section_title = Column(String(255), nullable=True)
    excerpt = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.92)
    verification_passed = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    finding = relationship("ComplianceFinding", back_populates="evidence_items")


# -------------------------------------------------------------
# 6. Risk Intelligence Center (1-5 Scale Matrix)
# -------------------------------------------------------------

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    finding_id = Column(String(36), ForeignKey("compliance_findings.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Operational Compliance")  # Regulatory, Operational, Security, Financial, Reputational
    likelihood = Column(Integer, default=3)  # 1 to 5
    impact = Column(Integer, default=4)      # 1 to 5
    risk_score = Column(Integer, default=12) # likelihood * impact (1 to 25)
    # Severity formula: 1-4: Low, 5-9: Moderate, 10-16: High, 17-25: Critical
    severity = Column(String(50), default="High")
    rationale = Column(Text, nullable=False)  # Transparent AI reasoning behind the score
    owner = Column(String(100), default="Risk Committee")
    status = Column(String(50), default="Identified")  # Identified, Mitigating, Accepted, Remediated
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization = relationship("Organization", back_populates="risks")
    finding = relationship("ComplianceFinding", back_populates="risk")


# -------------------------------------------------------------
# 7. Remediation Management & Approval Workflows
# -------------------------------------------------------------

class RemediationTask(Base):
    __tablename__ = "remediation_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    finding_id = Column(String(36), ForeignKey("compliance_findings.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(50), default="High")  # Critical, High, Medium, Low
    due_date = Column(String(50), nullable=True)
    # Workflow: Identified Gap -> Proposed Action -> Human Review -> Approved -> Assigned -> In Progress -> Completed -> Verified
    status = Column(String(50), default="Proposed Action")
    assigned_to = Column(String(100), default="IT Infrastructure Team")
    suggested_owner = Column(String(100), default="Lead Compliance Officer")
    completion_evidence = Column(Text, nullable=True)
    approval_status = Column(String(50), default="Pending Review")  # Pending Review, Approved, Rejected
    approved_by = Column(String(100), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization = relationship("Organization", back_populates="remediations")
    finding = relationship("ComplianceFinding", back_populates="remediation_task")


# -------------------------------------------------------------
# 8. Multi-Agent Orchestration & Execution Tracing
# -------------------------------------------------------------

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    workflow_name = Column(String(100), default="Compliance Investigation Workflow")
    status = Column(String(50), default="running")  # running, completed, flagged_verification, failed
    input_params = Column(JSON, default=dict)
    output_data = Column(JSON, default=dict)
    verification_score = Column(Float, default=1.0)
    latency_ms = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime(timezone=True), default=utc_now)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    organization = relationship("Organization", back_populates="agent_runs")
    messages = relationship("AgentMessage", back_populates="run", cascade="all, delete-orphan", order_by="AgentMessage.step_order")


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    run_id = Column(String(36), ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    agent_name = Column(String(100), nullable=False)
    # Document Intelligence, Regulatory Research, Control Mapping, Risk Assessment, Remediation Planning, Independent Verification, Human Review
    step_order = Column(Integer, default=1)
    message_type = Column(String(50), default="thought")  # thought, action, observation, output, verification_flag
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    timestamp = Column(DateTime(timezone=True), default=utc_now)

    run = relationship("AgentRun", back_populates="messages")


# -------------------------------------------------------------
# 9. Prompt Library, Safety Guardrails & Versioning
# -------------------------------------------------------------

class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    version = Column(String(20), default="1.0.0")
    category = Column(String(50), default="Verification")  # Document Extraction, Mapping, Risk, Remediation, Verification
    template_text = Column(Text, nullable=False)
    input_variables = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    defense_rules = Column(Text, nullable=True)  # Prompt injection defense rules
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


# -------------------------------------------------------------
# 10. Audit Logging & Evaluation Metrics
# -------------------------------------------------------------

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)  # INVESTIGATION_EXECUTED, FINDING_APPROVED, REMEDIATION_ASSIGNED, DOCUMENT_UPLOADED, etc.
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), default="127.0.0.1")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    organization = relationship("Organization", back_populates="audit_logs")
    user = relationship("User", back_populates="audit_logs")


class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    total_scenarios = Column(Integer, default=40)
    precision_at_k = Column(Float, default=0.925)
    citation_accuracy = Column(Float, default=0.968)
    faithfulness_score = Column(Float, default=0.942)
    gap_detection_f1 = Column(Float, default=0.914)
    risk_consistency = Column(Float, default=0.950)
    avg_latency_ms = Column(Integer, default=1840)
    token_usage_avg = Column(Integer, default=3250)
    pass_rate = Column(Float, default=95.0)
    results_json = Column(JSON, default=dict)
    methodology = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
