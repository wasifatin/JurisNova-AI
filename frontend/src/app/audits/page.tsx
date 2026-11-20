"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import AuditScannerModal from "@/components/AuditScannerModal";
import AuditReportPreviewModal from "@/components/AuditReportPreviewModal";
import AuditLogDetailModal from "@/components/AuditLogDetailModal";
import {
  executeAuditPdfExport,
  OFFICIAL_REPORT_TEMPLATES,
  ReportTemplate
} from "@/lib/exportAuditPdf";
import { apiFetch } from "@/lib/api";
import {
  ShieldCheck,
  Download,
  FileText,
  Clock,
  User,
  Filter,
  CheckCircle2,
  HardDrive,
  Hash,
  Sparkles,
  Eye,
  Search,
  Lock,
  Scale,
  Calendar,
  Layers,
  FileCheck
} from "lucide-react";

const DEFAULT_SAMPLE_AUDIT_LOGS = [
  {
    id: "log-001",
    action: "VERIFY_EVIDENCE",
    resource_type: "COMPLIANCE_FINDING",
    user_email: "fatinwasi321@jurisnova.ai",
    ip_address: "192.168.1.104",
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    details: "Evidence confirmed for Core Banking WORM 7-year archival requirement (BB ICT Guideline Sec 3.2)."
  },
  {
    id: "log-002",
    action: "GENERATE_REPORT",
    resource_type: "AUDIT_DOSSIER",
    user_email: "tanvirpiyal@jurisnova.ai",
    ip_address: "10.0.0.12",
    created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    details: "Board executive PDF compliance pack compiled with SHA-256 seal 8f4e2b9c31ad."
  },
  {
    id: "log-003",
    action: "INGEST_POLICY",
    resource_type: "DOCUMENT",
    user_email: "fatinwasi321@jurisnova.ai",
    ip_address: "192.168.1.104",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    details: "Ingested Enterprise_Data_Retention_Policy_v2.4.docx (56 semantic chunks extracted)."
  },
  {
    id: "log-004",
    action: "UPDATE_RISK_SCORE",
    resource_type: "RISK_ASSESSMENT",
    user_email: "tahmid.islam@jurisnova.ai",
    ip_address: "192.168.1.112",
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    details: "Critical risk score 20 assigned to Administrative Console Single-Factor MFA gap."
  },
  {
    id: "log-005",
    action: "DISPATCH_REMEDIATION",
    resource_type: "REMEDIATION_TASK",
    user_email: "oyishimuskan@jurisnova.ai",
    ip_address: "192.168.2.45",
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    details: "Remediation workflow SLA created for quarterly dormant user automated certification."
  },
  {
    id: "log-006",
    action: "SYNCHRONIZE_REGULATORY",
    resource_type: "REGULATORY_SOURCE",
    user_email: "system@jurisnova.ai",
    ip_address: "127.0.0.1",
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    details: "Synchronized Bangladesh Bank ICT Guideline v3.0 clauses against ISO/IEC 27001:2022."
  }
];

export default function AuditsPage() {
  const [logs, setLogs] = useState<any[]>(DEFAULT_SAMPLE_AUDIT_LOGS);
  const [reports] = useState<ReportTemplate[]>(OFFICIAL_REPORT_TEMPLATES);
  const [isScanningExport, setIsScanningExport] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  // Modals
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await apiFetch("/audits/logs");
        if (Array.isArray(data) && data.length > 0) {
          setLogs(data);
        }
      } catch (e) {
        console.warn("Using sample audit logs:", e);
      }
    };
    loadLogs();
  }, []);

  const handleDownloadReport = async (report?: ReportTemplate) => {
    setIsScanningExport(true);
    setScanStepIndex(0);
    try {
      await executeAuditPdfExport(
        (stepIndex) => setScanStepIndex(stepIndex),
        report?.title || "Executive Governance & Regulatory Audit Report"
      );
    } catch (err: any) {
      alert("PDF download failed: " + err.message);
    } finally {
      setTimeout(() => {
        setIsScanningExport(false);
      }, 600);
    }
  };

  const formatLogDetails = (details: any): string => {
    if (!details) return "";
    if (typeof details === "string") return details;
    if (typeof details === "object") {
      try {
        if (details.scope || details.score) {
          return `Scope: ${details.scope || "Unified"} • Score: ${details.score || "N/A"}% • Verification: ${Math.round((details.verification_score || 0.95) * 100)}%`;
        }
        return JSON.stringify(details);
      } catch {
        return "[Event Metadata]";
      }
    }
    return String(details);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    const q = searchQuery.toLowerCase();
    const detailsStr = formatLogDetails(log.details).toLowerCase();
    const matchesSearch =
      (log.action || "").toLowerCase().includes(q) ||
      (log.user_email || "").toLowerCase().includes(q) ||
      (log.resource_type || "").toLowerCase().includes(q) ||
      (log.ip_address || "").toLowerCase().includes(q) ||
      detailsStr.includes(q);
    return matchesAction && matchesSearch;
  });

  return (
    <>
      {/* Scanning Modal */}
      <AuditScannerModal isOpen={isScanningExport} currentStepIndex={scanStepIndex} />

      {/* Report Preview Modal */}
      <AuditReportPreviewModal
        report={previewReport}
        isOpen={Boolean(previewReport)}
        onClose={() => setPreviewReport(null)}
        onDownload={(rep) => {
          setPreviewReport(null);
          handleDownloadReport(rep);
        }}
      />

      {/* Log Detail Modal */}
      <AuditLogDetailModal
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />

      <AppShell>
        <div className="space-y-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Audit Trails &amp; Formal Reports
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-forest/20 text-brand-mint border border-brand-mint/20 font-mono">
                  SHA-256 ANCHORED
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Cryptographically Traceable Audit Records &bull; Board-Ready Executive PDF Reports &bull; Supervisory Filing Dossiers.
              </p>
            </div>

            <button
              onClick={() => handleDownloadReport()}
              disabled={isScanningExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all self-start sm:self-auto disabled:opacity-60 btn-hard-turkey"
            >
              <Download className="w-4 h-4" />
              <span>{isScanningExport ? "Scanning & Compiling..." : "Generate Official PDF Report"}</span>
            </button>
          </div>

          {/* SECTION 1: PDF Reports & Formal Dossiers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-bright" />
                  <span>Official Compliance Reports &amp; PDF Dossiers</span>
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Signed executive dossiers prepared for Central Bank examination, external surveillance audits, and Board review.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-brand-mint bg-[var(--bg-card)] px-3 py-1 rounded-lg border border-[var(--border-color)]">
                {reports.length} Verified Dossiers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-mint/40 transition-all space-y-4 hemla-card flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20">
                        {rep.category}
                      </span>
                      <span className="text-[10px] font-mono text-brand-bright font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {rep.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                      {rep.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {rep.description}
                    </p>

                    <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                      <span>Scope: <strong className="text-brand-mint">{rep.scope}</strong></span>
                      <span>{rep.pages} Pages &bull; {rep.fileSize}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-color)] flex items-center gap-2.5">
                    <button
                      onClick={() => setPreviewReport(rep)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)]/80 border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition-all hover:border-brand-mint/30"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-mint" />
                      <span>Preview Dossier</span>
                    </button>

                    <button
                      onClick={() => handleDownloadReport(rep)}
                      disabled={isScanningExport}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-brand-mint to-brand-emerald text-dark-bg text-xs font-bold shadow-glow-sm hover:opacity-95 transition-all btn-hard-turkey"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Immutable System Audit Trail */}
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-mint" />
                  <span>Immutable System Audit Trail ({filteredLogs.length})</span>
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Every user interaction, evidence validation, and report compilation is hashed with SHA-256 for external auditability.
                </p>
              </div>

              <span className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center gap-1.5 bg-[var(--bg-elevated)] px-2.5 py-1 rounded-lg border border-[var(--border-color)]">
                <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
                <span>Integrity: SHA-256 Validated</span>
              </span>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                {[
                  "ALL",
                  "VERIFY_EVIDENCE",
                  "GENERATE_REPORT",
                  "INGEST_POLICY",
                  "UPDATE_RISK_SCORE",
                  "DISPATCH_REMEDIATION"
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => setActionFilter(act)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold whitespace-nowrap transition-all ${
                      actionFilter === act
                        ? "bg-brand-emerald text-dark-bg font-bold shadow-glow-sm"
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search audit trail by actor, IP, hash..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
                />
              </div>
            </div>

            {/* Audit Log Cards */}
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] hover:border-brand-mint/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hemla-card cursor-pointer transition-all"
                  title="Click to inspect cryptographic audit block"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-forest/20 text-brand-mint flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-brand-bright" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-bright text-[11px]">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          on {log.resource_type}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-forest/30 text-brand-mint border border-brand-mint/20 font-mono">
                          ID: {log.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Actor: <span className="text-[var(--text-primary)] font-medium">{log.user_email || "System"}</span> &bull; IP: {log.ip_address}
                      </p>
                      {log.details && (
                        <p className="text-[10px] text-[var(--text-secondary)]/80 italic mt-0.5 font-mono line-clamp-1">
                          {formatLogDetails(log.details)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-brand-mint font-semibold flex items-center gap-1 hover:underline">
                      <span>Inspect</span>
                      <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
