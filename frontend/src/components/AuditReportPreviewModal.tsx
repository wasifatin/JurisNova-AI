"use client";

import React from "react";
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  Layers,
  Scale
} from "lucide-react";
import { ReportTemplate } from "@/lib/exportAuditPdf";

interface AuditReportPreviewModalProps {
  report: ReportTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (report: ReportTemplate) => void;
}

export default function AuditReportPreviewModal({
  report,
  isOpen,
  onClose,
  onDownload
}: AuditReportPreviewModalProps) {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-slide-up overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[var(--bg-card)] border border-brand-mint/40 shadow-2xl overflow-hidden">
        {/* Top Action Toolbar */}
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-elevated)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-forest/20 text-brand-mint flex items-center justify-center border border-brand-mint/30">
              <FileText className="w-4 h-4 text-brand-bright" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {report.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-brand-forest/30 text-brand-mint border border-brand-mint/30">
                  {report.status}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                SHA-256 Digest: {report.hash} &bull; {report.fileSize} &bull; {report.pages} Pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card)]/80 border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition-all"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5 text-brand-mint" />
              <span className="hidden sm:inline">Print / Save</span>
            </button>

            <button
              onClick={() => onDownload(report)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-mint to-brand-emerald text-dark-bg text-xs font-bold shadow-glow-sm hover:opacity-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400 border border-[var(--border-color)] transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body Styled as Official Enterprise Dossier */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
          {/* Document Letterhead */}
          <div className="border-b-2 border-brand-mint/40 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-bright animate-pulse" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gradient">
                  JURISNOVA AI — GOVERNANCE INTELLIGENCE
                </h1>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                AUTONOMOUS MULTI-AGENT GOVERNANCE, RISK &amp; COMPLIANCE SYSTEM
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Official Regulatory Assessment &amp; Supervisory Verification Dossier
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-[11px] space-y-0.5 text-[var(--text-secondary)]">
              <p>Reference: <strong className="text-brand-bright font-mono">{report.id.toUpperCase()}-2026</strong></p>
              <p>Classification: <strong className="text-[var(--text-primary)]">CONFIDENTIAL / BOARD ONLY</strong></p>
              <p>Date: <strong className="text-[var(--text-primary)]">{new Date().toLocaleDateString()}</strong></p>
            </div>
          </div>

          {/* Metadata Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Organization</span>
              <p className="font-bold text-[var(--text-primary)] mt-0.5">PrimeTrust Financial &amp; Cloud</p>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Regulatory Scope</span>
              <p className="font-bold text-brand-mint mt-0.5">BB ICT 3.0 &bull; EU GDPR &bull; ISO 27001</p>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Compliance Posture</span>
              <p className="font-bold text-brand-bright mt-0.5">84.5% Substantial Conformity</p>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Cryptographic Proof</span>
              <p className="font-mono text-brand-mint text-[11px] mt-0.5 truncate">{report.hash}</p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-bright flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
              <span>1. Executive Governance Summary</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              JurisNova AI performed continuous evidence-first verification across enterprise IT environments, policy archives, and operational access consoles against statutory requirements set forth by Bangladesh Bank ICT Security Guidelines v3.0, ISO/IEC 27001:2022, and the European Union General Data Protection Regulation (Regulation 2016/679).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-center">
                <span className="text-2xl font-black text-brand-bright">84.5%</span>
                <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">Overall Posture</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-center">
                <span className="text-2xl font-black text-[var(--text-primary)]">18</span>
                <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">Controls Verified</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-center">
                <span className="text-2xl font-black text-amber-400">4</span>
                <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">Open Findings</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-center">
                <span className="text-2xl font-black text-brand-mint">100%</span>
                <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">MFA Implemented</p>
              </div>
            </div>
          </div>

          {/* Section 2: Statutory Findings Breakdown */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-bright flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <Scale className="w-4 h-4 text-brand-mint" />
              <span>2. Clause-by-Clause Audit Findings &amp; Evidence Grounding</span>
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20">
                      BB-ICT-3.2.1
                    </span>
                    <span className="text-xs font-bold">Financial Transaction Log WORM Archival (7 Years)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    PARTIALLY IMPLEMENTED
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Primary Evidence: <em className="text-[var(--text-primary)] font-serif">&ldquo;Enterprise_Data_Retention_Policy_v2.4.docx (Clause 2.1)&rdquo;</em> confirms 180-day online ledger retention. Cold-tier S3 Glacier Vault WORM enforcement is scheduled for deployment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20">
                      BB-ICT-4.1.4
                    </span>
                    <span className="text-xs font-bold">Mandatory Hardware MFA for Privileged Consoles</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20 font-mono">
                    FULLY IMPLEMENTED
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Primary Evidence: <em className="text-[var(--text-primary)] font-serif">&ldquo;Identity_Governance_MFA_Standard_v3.1.pdf (Clause 4.1)&rdquo;</em> validated through cryptographic trace. 100% of administrative console sessions require hardware FIDO2 authentication keys.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20">
                      GDPR-Art-17
                    </span>
                    <span className="text-xs font-bold">Right to Erasure vs Statutory Banking AML Retention</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20 font-mono">
                    FULLY IMPLEMENTED
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Primary Evidence: <em className="text-[var(--text-primary)] font-serif">&ldquo;EU_GDPR_Regulation_2016_679.pdf (Art 17(3)(b))&rdquo;</em> legal router confirmed. Financial records are held on statutory regulatory retention while personal telemetry is redacted.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Signatures & Certification */}
          <div className="pt-6 border-t-2 border-[var(--border-color)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4 font-mono">
              OFFICIAL SIGN-OFF &amp; SUPERVISORY ATTESTATION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-secondary)] font-mono">Lead Compliance Officer</span>
                <p className="text-xs font-bold text-[var(--text-primary)] mt-1">Fatin Sharhad</p>
                <div className="mt-2 pt-2 border-t border-[var(--border-color)]/60 text-[10px] text-brand-bright font-mono">
                  &radic; Digitally Verified &bull; Active
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-secondary)] font-mono">Super Administrator</span>
                <p className="text-xs font-bold text-[var(--text-primary)] mt-1">Md. Tanvir Hossain</p>
                <div className="mt-2 pt-2 border-t border-[var(--border-color)]/60 text-[10px] text-brand-bright font-mono">
                  &radic; Digitally Verified &bull; Active
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-secondary)] font-mono">Lead Regulatory Auditor</span>
                <p className="text-xs font-bold text-[var(--text-primary)] mt-1">Muskan Meheg</p>
                <div className="mt-2 pt-2 border-t border-[var(--border-color)]/60 text-[10px] text-brand-bright font-mono">
                  &radic; Digitally Verified &bull; Active
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-brand-forest/15 border border-brand-mint/20 text-center text-[10px] text-brand-mint font-mono flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Immutable cryptographic block anchored in SHA-256 ledger. Tamper-proof regulatory record.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
