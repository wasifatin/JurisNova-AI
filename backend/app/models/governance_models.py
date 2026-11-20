import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

# -------------------------------------------------------------
# 1. Geographic & Service Areas (Dhaka 12 Wards)
# -------------------------------------------------------------
class ServiceArea(Base):
    __tablename__ = "service_areas"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    ward_number = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    geographic_zone = Column(String(50), default="Dhaka North / South")
    area_sq_km = Column(Float, default=5.2)
    population = Column(Integer, default=145000)
    health_score = Column(Integer, default=74)
    service_performance_delta = Column(Float, default=-2.5)  # percentage
    complaint_growth_delta = Column(Float, default=4.0)      # percentage
    delayed_projects_count = Column(Integer, default=1)
    active_signals_count = Column(Integer, default=1)
    is_anomaly_ward = Column(Boolean, default=False)         # Wards 2, 5, 8, 12
    svg_path = Column(Text, nullable=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    # Relationships
    complaints = relationship("CitizenComplaint", back_populates="ward", cascade="all, delete-orphan")
    service_metrics = relationship("MonthlyServicePerformance", back_populates="ward", cascade="all, delete-orphan")


# -------------------------------------------------------------
# 2. Operational Public Departments (10 Departments)
# -------------------------------------------------------------
class PublicDepartment(Base):
    __tablename__ = "public_departments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    lead_officer = Column(String(100), default="Chief Departmental Engineer")
    allocated_budget_cr = Column(Float, default=25.0)  # in Crores BDT
    spent_budget_cr = Column(Float, default=18.5)      # in Crores BDT
    active_projects_count = Column(Integer, default=2)
    open_complaints_count = Column(Integer, default=45)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    complaints = relationship("CitizenComplaint", back_populates="department")
    projects = relationship("PublicProject", back_populates="department")
    procurements = relationship("PublicProcurement", back_populates="department")
    budget_allocations = relationship("BudgetAllocation", back_populates="department")


# -------------------------------------------------------------
# 3. Citizen Complaints Dataset (Exactly 1,500 records)
# -------------------------------------------------------------
class CitizenComplaint(Base):
    __tablename__ = "citizen_complaints"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    complaint_ref = Column(String(50), unique=True, nullable=False, index=True)
    ward_id = Column(String(36), ForeignKey("service_areas.id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(String(36), ForeignKey("public_departments.id", ondelete="CASCADE"), nullable=False, index=True)
    service_category = Column(String(50), nullable=False, index=True)  # Waste Collection, Road Condition, Water Service, Street Lighting, Other
    service_id = Column(String(50), default="SRV-GEN-01")
    submission_date = Column(DateTime(timezone=True), nullable=False, index=True)
    resolution_date = Column(DateTime(timezone=True), nullable=True)
    resolution_duration_days = Column(Integer, nullable=True)
    priority = Column(String(20), default="Medium")  # Critical, High, Medium, Low
    status = Column(String(20), default="Open")      # Resolved, In Progress, Open, Under Investigation
    description = Column(Text, nullable=False)
    source_reference = Column(String(100), nullable=True)
    sentiment = Column(String(20), default="Frustrated")
    evidence_reference = Column(String(100), nullable=True)
    is_anomaly_cluster = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    ward = relationship("ServiceArea", back_populates="complaints")
    department = relationship("PublicDepartment", back_populates="complaints")


# -------------------------------------------------------------
# 4. Public Projects Dataset (Exactly 20 records)
# -------------------------------------------------------------
class PublicProject(Base):
    __tablename__ = "public_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_code = Column(String(50), unique=True, nullable=False, index=True)
    project_name = Column(String(200), nullable=False)
    department_id = Column(String(36), ForeignKey("public_departments.id", ondelete="CASCADE"), nullable=False, index=True)
    service_category = Column(String(50), default="General Infrastructure")
    ward_associations = Column(JSON, default=list)  # list of ward numbers or IDs
    approved_budget_cr = Column(Float, nullable=False)   # in Crores BDT
    allocated_budget_cr = Column(Float, nullable=False)
    released_amount_cr = Column(Float, default=0.0)
    spent_amount_cr = Column(Float, default=0.0)
    planned_physical_progress = Column(Float, default=0.0)  # e.g. 80.0
    actual_physical_progress = Column(Float, default=0.0)   # e.g. 54.0
    financial_progress = Column(Float, default=0.0)        # e.g. 65.0
    start_date = Column(DateTime(timezone=True), nullable=False)
    planned_completion_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(30), default="In Progress")  # Delayed, On Schedule, Completed, Requires Review
    variance_label = Column(String(100), nullable=True)
    evidence_references = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    department = relationship("PublicDepartment", back_populates="projects")
    milestones = relationship("ProjectMilestone", back_populates="project", cascade="all, delete-orphan")
    procurements = relationship("PublicProcurement", back_populates="project")
    budget_allocations = relationship("BudgetAllocation", back_populates="project")


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("public_projects.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    target_date = Column(DateTime(timezone=True), nullable=False)
    actual_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(30), default="Pending")  # Completed, Delayed, In Progress
    delay_days = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("PublicProject", back_populates="milestones")


# -------------------------------------------------------------
# 5. Procurement Intelligence Dataset (Exactly 15 records)
# -------------------------------------------------------------
class PublicProcurement(Base):
    __tablename__ = "public_procurements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    procurement_ref = Column(String(50), unique=True, nullable=False, index=True)  # e.g. PROC-2026-041
    project_id = Column(String(36), ForeignKey("public_projects.id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(String(36), ForeignKey("public_departments.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    procurement_category = Column(String(50), default="Goods & Equipment")
    contractor_name = Column(String(150), default="Consortium for Urban Environmental Logistics")
    estimated_amount_cr = Column(Float, default=19.0)
    contract_amount_cr = Column(Float, default=18.5)  # e.g. 18.5 Cr
    tender_date = Column(DateTime(timezone=True), nullable=False)
    award_date = Column(DateTime(timezone=True), nullable=False)
    contract_start_date = Column(DateTime(timezone=True), nullable=False)
    critical_milestone = Column(String(150), default="Service Deployment")
    milestone_planned_date = Column(DateTime(timezone=True), nullable=False)
    milestone_actual_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="Delayed beyond September 2026")
    delay_duration_months = Column(Integer, default=4)
    neutral_notes = Column(Text, default="Milestone delayed. Requires review.")
    supporting_records = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    project = relationship("PublicProject", back_populates="procurements")
    department = relationship("PublicDepartment", back_populates="procurements")


# -------------------------------------------------------------
# 6. Monthly Ward Service Performance (Time-Series)
# -------------------------------------------------------------
class MonthlyServicePerformance(Base):
    __tablename__ = "monthly_service_performance"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    ward_id = Column(String(36), ForeignKey("service_areas.id", ondelete="CASCADE"), nullable=False, index=True)
    service_category = Column(String(50), nullable=False, index=True)
    month_period = Column(String(20), nullable=False, index=True)  # e.g. "Jun 2026", "Nov 2026"
    service_availability_pct = Column(Float, default=85.0)
    service_completion_rate_pct = Column(Float, default=80.0)
    avg_resolution_time_days = Column(Float, default=3.5)
    complaint_volume = Column(Integer, default=40)
    backlog_count = Column(Integer, default=8)
    service_satisfaction_score = Column(Float, default=70.0)
    performance_percentage = Column(Float, default=78.0)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    ward = relationship("ServiceArea", back_populates="service_metrics")


# -------------------------------------------------------------
# 7. Budget Governance & Allocation
# -------------------------------------------------------------
class BudgetAllocation(Base):
    __tablename__ = "budget_allocations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    department_id = Column(String(36), ForeignKey("public_departments.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("public_projects.id", ondelete="SET NULL"), nullable=True, index=True)
    fiscal_year = Column(String(20), default="FY2025-2026")
    approved_allocation_cr = Column(Float, nullable=False)
    released_budget_cr = Column(Float, nullable=False)
    expenditure_cr = Column(Float, nullable=False)
    remaining_allocation_cr = Column(Float, nullable=False)
    financial_progress_pct = Column(Float, default=0.0)
    physical_progress_pct = Column(Float, default=0.0)
    variance_pct = Column(Float, default=0.0)
    variance_label = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    department = relationship("PublicDepartment", back_populates="budget_allocations")
    project = relationship("PublicProject", back_populates="budget_allocations")


# -------------------------------------------------------------
# 8. Unified Governance Signals
# -------------------------------------------------------------
class GovernanceSignal(Base):
    __tablename__ = "governance_signals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    signal_code = Column(String(50), unique=True, nullable=False, index=True)  # e.g. SIG-GOV-2026-001
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Service Delivery & Operational Governance")
    priority = Column(String(30), default="High Priority")
    severity = Column(String(20), default="High")  # Low (0-25), Medium (26-50), High (51-75), Critical (76-100)
    risk_score = Column(Float, default=74.0)       # Deterministic score
    ai_confidence = Column(Float, default=87.0)    # Explicitly separated confidence indicator
    detection_time = Column(DateTime(timezone=True), default=utc_now)
    affected_wards = Column(JSON, default=list)    # ["Ward 2", "Ward 5", "Ward 8", "Ward 12"]
    affected_departments = Column(JSON, default=list)
    related_projects = Column(JSON, default=list)
    related_procurements = Column(JSON, default=list)
    what_changed = Column(JSON, default=dict)       # {"complaints_growth": "+31%", "resolution_time": "+18%", "service_performance": "-14%"}
    score_breakdown = Column(JSON, default=dict)    # {"severity": 28, "trend": 19, "population": 14, "persistence": 8, "confidence": 5, "total": 74}
    possible_explanations = Column(JSON, default=list)
    alternative_explanations = Column(JSON, default=list)
    limitations_and_unknowns = Column(JSON, default=list)
    recommended_actions = Column(JSON, default=list)
    evidence_graph = Column(JSON, default=dict)
    investigation_status = Column(String(30), default="Ready for Investigation")  # Ready, Investigating, Resolved
    created_at = Column(DateTime(timezone=True), default=utc_now)

    investigations = relationship("GovernanceInvestigation", back_populates="signal", cascade="all, delete-orphan")


# -------------------------------------------------------------
# 9. Governance Investigation & Action Center
# -------------------------------------------------------------
class GovernanceInvestigation(Base):
    __tablename__ = "governance_investigations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_code = Column(String(50), unique=True, nullable=False, index=True)  # e.g. INV-2026-001
    signal_id = Column(String(36), ForeignKey("governance_signals.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    organization_name = Column(String(100), default="Dhaka City Services Authority")
    responsible_department = Column(String(150), nullable=False)
    related_wards = Column(JSON, default=list)
    priority = Column(String(30), default="High Priority")
    status = Column(String(30), default="New")  # New, Under Review, Assigned, In Progress, Resolved, Closed
    assigned_to = Column(String(100), default="Lead Governance Inspector")
    assigned_role = Column(String(100), default="Lead Auditor & Inspection Lead")
    due_date = Column(DateTime(timezone=True), nullable=False)
    completion_criteria = Column(Text, nullable=True)
    evidence_records = Column(JSON, default=list)
    checklist = Column(JSON, default=list)
    proposed_actions = Column(JSON, default=list)
    comments = Column(JSON, default=list)
    approval_history = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    signal = relationship("GovernanceSignal", back_populates="investigations")


# -------------------------------------------------------------
# 10. Immutable Append-Only Governance Audit Log
# -------------------------------------------------------------
class GovernanceAuditLog(Base):
    __tablename__ = "governance_audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    event_id = Column(String(50), unique=True, nullable=False, index=True)
    entity_type = Column(String(50), nullable=False)  # SIGNAL, INVESTIGATION, ACTION, EVIDENCE, REPORT
    entity_id = Column(String(50), nullable=False, index=True)
    organization_id = Column(String(50), default="org-dhaka-gov-01")
    actor_id = Column(String(100), nullable=False)
    actor_name = Column(String(150), nullable=False)
    actor_role = Column(String(100), nullable=False)
    event_type = Column(String(100), nullable=False)  # SIGNAL_DETECTED, INVESTIGATION_CREATED, ACTION_ASSIGNED, etc.
    timestamp = Column(DateTime(timezone=True), default=utc_now, index=True)
    details = Column(JSON, default=dict)
    previous_state = Column(JSON, default=dict)
    new_state = Column(JSON, default=dict)
    associated_evidence_ids = Column(JSON, default=list)
    previous_hash = Column(String(64), nullable=True)
    current_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
