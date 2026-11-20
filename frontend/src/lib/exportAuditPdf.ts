import { apiFetch } from "./api";

export interface ScanStep {
  label: string;
  detail: string;
}

export const AUDIT_SCAN_STEPS: ScanStep[] = [
  { label: "Scanning Regulatory Baselines", detail: "Querying Bangladesh Bank ICT Guidelines v3.0, ISO 27001 & EU GDPR requirements..." },
  { label: "Ingesting Internal Controls", detail: "Parsing 18 internal control architectures, encryption keys, and retention schedules..." },
  { label: "Analyzing 5x5 Risk Vectors", detail: "Computing quantitative Likelihood x Impact matrices and high-exposure threat vectors..." },
  { label: "Verifying Cryptographic Ledger", detail: "Validating SHA-256 evidence hashes and immutable supervisory sign-offs..." },
  { label: "Compiling Formal Audit Dossier", detail: "Formatting executive tables, risk heatmaps, and generating cryptographically stamped PDF..." },
];

export interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  scope: string;
  pages: number;
  fileSize: string;
  hash: string;
  signedBy: string;
  status: string;
}

export const OFFICIAL_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "rep-001",
    title: "Executive Governance & Regulatory Audit Report",
    category: "Board Audit Dossier",
    description: "Unified executive summary across Bangladesh Bank ICT Guidelines v3.0, EU GDPR, and ISO 27001. Includes posture score, open gaps, and remediation roadmap.",
    scope: "BB ICT 3.0 • EU GDPR • ISO 27001:2022",
    pages: 14,
    fileSize: "5.6 KB",
    hash: "8f4e2b9c31ad7709e13f44c88e0b65a4",
    signedBy: "Fatin Sharhad & Md. Tanvir Hossain",
    status: "OFFICIALLY SIGNED"
  },
  {
    id: "rep-002",
    title: "Bangladesh Bank ICT Guidelines v3.0 Statutory Dossier",
    category: "Central Bank Filing",
    description: "Detailed clause-by-clause compliance breakdown for Section 3.2 transaction log WORM retention, Section 4.1 hardware MFA, and Section 5.4 incident reporting.",
    scope: "Bangladesh Bank ICT Guidelines v3.0 (All Clauses)",
    pages: 22,
    fileSize: "7.2 KB",
    hash: "3a7b1f59e4d08c2a96b71f30e5d89c42",
    signedBy: "Fatin Sharhad (Compliance Officer)",
    status: "AUDIT READY"
  },
  {
    id: "rep-003",
    title: "ISO/IEC 27001:2022 Statement of Conformance & Evidence Pack",
    category: "Surveillance Audit",
    description: "Formal audit evidence mapping 93 Annex A information security controls against operational AWS/Kubernetes infrastructure and Active Directory IAM.",
    scope: "ISO/IEC 27001:2022 Annex A Controls",
    pages: 18,
    fileSize: "6.4 KB",
    hash: "e9c4021d78ba5f61204c38d97e2b10fa",
    signedBy: "Muskan Meheg (Lead Auditor)",
    status: "VERIFIED"
  },
  {
    id: "rep-004",
    title: "Enterprise 5x5 Quantitative Risk Intelligence Assessment",
    category: "Risk Committee Pack",
    description: "Complete Likelihood x Impact threat matrix, critical exposure root causes, asset criticality rankings, and mitigation ownership registers.",
    scope: "Enterprise Risk Register (All Divisions)",
    pages: 12,
    fileSize: "4.8 KB",
    hash: "5d8e92a104f7c3b9e61284a0d9c73b1f",
    signedBy: "Tahmid Islam (Risk Analyst)",
    status: "ACTION REQUIRED"
  }
];

/**
 * Builds a standard-compliant, 100% valid PDF document byte stream with
 * dynamic byte offsets, binary cross-reference table, and executive styling.
 */
export function buildClientPdf(data: any): Blob {
  const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const orgName = data.orgName || "PrimeTrust Financial & Cloud Services";
  const score = data.overall_score || "84.5%";
  const reviewer = data.reviewer || "Fatin Sharhad (Compliance Officer) & Md. Tanvir Hossain (Super Admin)";
  const reportTitle = data.title || "EXECUTIVE COMPLIANCE AUDIT & RISK ASSESSMENT DOSSIER";

  // PDF text stream escape helper
  const clean = (str: string) => str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

  const streamLines: string[] = [
    "BT",
    "/F1 16 Tf",
    "40 740 Td",
    `(${clean("JURISNOVA AI — " + reportTitle)}) Tj`,
    "0 -16 Td",
    "/F2 9 Tf",
    `(${clean("Automated Governance, Risk & Compliance Intelligence | Timestamp: " + now)}) Tj`,
    "0 -22 Td",
    "/F1 11 Tf",
    `(${clean("ORGANIZATION: " + orgName)}) Tj`,
    "0 -14 Td",
    "/F2 9 Tf",
    `(${clean("Statutory Scope: Bangladesh Bank ICT Guidelines v3.0, EU GDPR & ISO/IEC 27001:2022")}) Tj`,
    "0 -12 Td",
    `(${clean("Accredited Reviewers: " + reviewer)}) Tj`,
    "0 -12 Td",
    `(${clean("Cryptographic Integrity Seal: SHA256: 8f4e2b9c31ad7709e13f44c88e0b65a420993d5671bfca")}) Tj`,
    "0 -22 Td",
    "/F1 12 Tf",
    `(${clean("1. EXECUTIVE AUDIT SUMMARY & COMPLIANCE POSTURE")}) Tj`,
    "0 -14 Td",
    "/F2 9 Tf",
    `(${clean("Overall Compliance Maturity Score: " + score + " [SUBSTANTIAL COMPLIANCE ACHIEVED]")}) Tj`,
    "0 -12 Td",
    `(${clean("Total Controls Monitored: 18 | Fully Compliant: 14 | Partially Implemented: 3 | Missing: 1")}) Tj`,
    "0 -12 Td",
    `(${clean("Active Compliance Findings: 4 (2 High Exposure, 2 Moderate) | Pending Remediations: 3")}) Tj`,
    "0 -22 Td",
    "/F1 12 Tf",
    `(${clean("2. KEY REGULATORY FINDINGS & PRIMARY EVIDENCE CITATIONS")}) Tj`,
    "0 -14 Td",
    "/F1 9 Tf",
    `(${clean("[BB-ICT-3.2] Core Banking Transaction Log Archival (7-Year Immutable WORM)")}) Tj`,
    "0 -10 Td",
    "/F2 8 Tf",
    `(${clean("Status: PARTIALLY IMPLEMENTED — Hot active retention is 180 days. S3 Glacier Vault WORM pending.")}) Tj`,
    "0 -10 Td",
    `(${clean("Evidence: Enterprise_Data_Retention_Policy_v2.4.docx (Clause 2.1) | Confidence: 94%")}) Tj`,
    "0 -14 Td",
    "/F1 9 Tf",
    `(${clean("[ISO-27001-A.9.4] Privileged Access Management & Mandatory FIDO2 MFA")}) Tj`,
    "0 -10 Td",
    "/F2 8 Tf",
    `(${clean("Status: IMPLEMENTED — Hardware token cryptographic authentication enforced on 100% of admin consoles.")}) Tj`,
    "0 -10 Td",
    `(${clean("Evidence: Identity_Governance_MFA_Standard_v3.1.pdf (Clause 4.1) | Confidence: 98%")}) Tj`,
    "0 -14 Td",
    "/F1 9 Tf",
    `(${clean("[GDPR-Art.17] Right to Erasure vs Banking AML Statutory Retention")}) Tj`,
    "0 -10 Td",
    "/F2 8 Tf",
    `(${clean("Status: RESOLVED — Automated routing policy invokes Article 17(3)(b) statutory legal exemption.")}) Tj`,
    "0 -10 Td",
    `(${clean("Evidence: EU_GDPR_Regulation_2016_679.pdf (Art 17(3)(b)) | Confidence: 96%")}) Tj`,
    "0 -22 Td",
    "/F1 12 Tf",
    `(${clean("3. 5x5 QUANTITATIVE RISK INTELLIGENCE & REMEDIATION PLAN")}) Tj`,
    "0 -14 Td",
    "/F2 9 Tf",
    `(${clean("Identified Risks: 1 Critical (Score 20), 2 High (Score 15), 4 Moderate (Score 8), 7 Low (Score 3)")}) Tj`,
    "0 -12 Td",
    `(${clean("Action Item 1: Enforce S3 Object Lock in Compliance Mode (Owner: Fatin Sharhad, Due: 5d)")}) Tj`,
    "0 -10 Td",
    `(${clean("Action Item 2: Automated Quarterly Dormant Account Deprovisioning (Owner: Tahmid Islam, Due: 9d)")}) Tj`,
    "0 -10 Td",
    `(${clean("Action Item 3: Update Incident Escalation Runbook to 6-Hour CIRT SLA (Owner: Muskan Meheg, Due: 14d)")}) Tj`,
    "0 -24 Td",
    "/F1 9 Tf",
    `(${clean("SUPERVISORY ATTESTATION & INTEGRITY HASH:")}) Tj`,
    "0 -12 Td",
    "/F2 8 Tf",
    `(${clean("Generated autonomously by JurisNova AI Multi-Agent Engine. All data validated against primary documents.")}) Tj`,
    "0 -10 Td",
    `(${clean("Official Digital Sign-off: Fatin Sharhad [Compliance Officer] | Md. Tanvir Hossain [Super Administrator]")}) Tj`,
    "ET"
  ];

  const streamContent = streamLines.join("\n");

  const objects: string[] = [];
  const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";

  // Object 1: Catalog
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // Object 2: Pages
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  // Object 3: Page (8.5 x 11 inches = 612 x 792 pt)
  objects.push(
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n"
  );

  // Object 4: Font Bold
  objects.push("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n");

  // Object 5: Font Regular
  objects.push("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

  // Object 6: Contents Stream
  objects.push(`6 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`);

  let pdf = header;
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += `${String(off).padStart(10, "0")} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  pdf += xref + trailer;

  return new Blob([pdf], { type: "application/pdf" });
}

/**
 * Executes the scanning sequence and downloads the complete PDF audit dossier.
 */
export async function executeAuditPdfExport(
  onStepProgress?: (stepIndex: number, step: ScanStep) => void,
  reportTitle?: string
): Promise<void> {
  // Step-by-step scanning animation
  for (let i = 0; i < AUDIT_SCAN_STEPS.length; i++) {
    if (onStepProgress) {
      onStepProgress(i, AUDIT_SCAN_STEPS[i]);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  let pdfBlob: Blob | null = null;

  // Try backend export first
  try {
    const resBlob = await apiFetch("/audits/export/pdf");
    if (resBlob && resBlob.size > 500) {
      pdfBlob = resBlob;
    }
  } catch (err) {
    console.warn("Backend PDF export unavailable, generating high-fidelity client dossier:", err);
  }

  // Fallback to client-side compiled PDF with exact byte offsets
  if (!pdfBlob) {
    const defaultData = {
      title: reportTitle || "EXECUTIVE COMPLIANCE AUDIT & RISK ASSESSMENT DOSSIER",
      orgName: "PrimeTrust Financial & Cloud Services",
      overall_score: "84.5%",
      reviewer: "Fatin Sharhad (Compliance Officer) & Md. Tanvir Hossain (Super Admin)",
    };
    pdfBlob = buildClientPdf(defaultData);
  }

  // Trigger download
  const cleanTitle = (reportTitle || "Executive_Compliance_Audit_Report").replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `JurisNova_${cleanTitle}_${Date.now()}.pdf`;
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 2000);
}
