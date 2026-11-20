from typing import TypedDict, List, Dict, Any, Optional

class InvestigationState(TypedDict):
    """
    Shared typed state for the JurisNova LangGraph multi-agent governance pipeline.
    """
    investigation_id: str
    organization_id: str
    policy_scope: str
    regulatory_source_id: str
    document_ids: List[str]
    jurisdiction: str
    
    # Agent 1: Document Intelligence output
    extracted_policies: List[Dict[str, Any]]
    
    # Agent 2: Regulatory Research output
    retrieved_requirements: List[Dict[str, Any]]
    
    # Agent 3: Control Mapping output
    control_mappings: List[Dict[str, Any]]
    
    # Agent 4: Risk Assessment output
    risk_assessments: List[Dict[str, Any]]
    
    # Agent 5: Remediation Planning output
    remediation_plans: List[Dict[str, Any]]
    
    # Agent 6: Independent Verification output
    verification_results: List[Dict[str, Any]]
    verification_passed: bool
    verification_score: float
    flagged_citations: List[Dict[str, Any]]
    
    # Human Review & Final State
    human_review_required: bool
    human_approved: bool
    execution_trace: List[Dict[str, Any]]
    final_summary: str
    status: str
    error: Optional[str]
