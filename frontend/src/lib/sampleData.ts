export const DEFAULT_SAMPLE_DOCUMENTS = [
  {
    id: "doc-sample-01",
    title: "Bangladesh Bank ICT Security Guidelines v3.0",
    file_name: "BB_ICT_Security_Guidelines_2023_v3.pdf",
    file_type: "PDF",
    category: "Regulatory Baseline",
    page_count: 84,
    chunk_count: 142,
    status: "INDEXED",
    file_size: 2457600,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    description: "Official statutory baseline for cyber defense, operational resilience, and financial transaction log retention."
  },
  {
    id: "doc-sample-02",
    title: "Enterprise Core Banking Data Retention & Archival Policy",
    file_name: "Enterprise_Data_Retention_Policy_v2.4.docx",
    file_type: "DOCX",
    category: "Internal Policy",
    page_count: 28,
    chunk_count: 56,
    status: "INDEXED",
    file_size: 1120400,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    description: "Mandates 7-year write-once-read-many (WORM) storage for SWIFT, RTGS, and customer transaction audit logs."
  },
  {
    id: "doc-sample-03",
    title: "Access Control & Privileged Identity Governance Standard",
    file_name: "Identity_Governance_MFA_Standard_v3.1.pdf",
    file_type: "PDF",
    category: "Internal Policy",
    page_count: 36,
    chunk_count: 68,
    status: "INDEXED",
    file_size: 1843200,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    description: "Enforces FIDO2 hardware MFA tokens, just-in-time elevation, and quarterly dormant account sweeps."
  },
  {
    id: "doc-sample-04",
    title: "Cyber Incident Response & Regulatory Escalation Framework",
    file_name: "Incident_Escalation_Framework_v1.8.pdf",
    file_type: "PDF",
    category: "Procedure",
    page_count: 22,
    chunk_count: 44,
    status: "INDEXED",
    file_size: 980000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    description: "Defines 6-hour reporting mandate to Bangladesh Bank BGD e-GOV CIRT and Board escalation triggers."
  },
  {
    id: "doc-sample-05",
    title: "ISO/IEC 27001:2022 Statement of Applicability & Control Matrix",
    file_name: "ISO27001_Statement_of_Applicability_2026.pdf",
    file_type: "PDF",
    category: "Audit Evidence",
    page_count: 18,
    chunk_count: 38,
    status: "INDEXED",
    file_size: 840000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    description: "Formal mapping of 93 Annex A controls against internal IT, Cloud Infrastructure, and SOC operations."
  }
];
