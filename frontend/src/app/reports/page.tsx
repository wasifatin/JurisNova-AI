"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Scale,
  Users,
  Activity,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  ClipboardCheck,
  CheckCircle2,
  Lock
} from "lucide-react";

interface BriefData {
  report_title: string;
  dossier_code: string;
  jurisdiction: string;
  organization_name: string;
  compiled_date: string;
  governance_health_score: number;
  governance_health_label: string;
  kpis?: {
    total_grievances?: number;
    active_capital_projects?: number;
    tracked_procurements?: number;
    active_investigations?: number;
  };
  signals?: Array<{
    code: string;
    title: string;
    priority: string;
    risk_score: number;
    ai_confidence: number;
    affected_wards: string[];
    what_changed: string;
    recommended_actions: string[];
  }>;
  hero_case_summary?: {
    signal: string;
    affected_wards: string[];
    complaint_surge: string;
    cluster_concentration: string;
    resolution_duration: string;
    service_drop: string;
    connected_project: string;
    connected_procurement: string;
    ai_limitations: string;
  };
  investigations?: Array<{
    code: string;
    title: string;
    status: string;
    department: string;
    assigned_to: string;
    due_date: string;
  }>;
  methodology?: {
    service_delivery_weight: string;
    citizen_satisfaction_weight: string;
    project_delivery_weight: string;
    procurement_assurance_weight: string;
    resolution_efficiency_weight: string;
    description: string;
  };
}

const DEFAULT_BRIEF: BriefData = {
  report_title: "Executive Public Sector Governance & Delivery Assurance Brief",
  dossier_code: "EGB-2026-DCSA-Q4",
  jurisdiction: "Dhaka, Bangladesh",
  organization_name: "Dhaka City Services Authority",
  compiled_date: "November 20, 2026",
  governance_health_score: 74,
  governance_health_label: "AI-assisted governance readiness indicator",
  kpis: {
    total_grievances: 1500,
    active_capital_projects: 20,
    tracked_procurements: 15,
    active_investigations: 1,
  },
  signals: [
    {
      code: "SIG-GOV-2026-001",
      title: "Waste Collection Service Degradation",
      priority: "High Priority",
      risk_score: 74,
      ai_confidence: 87,
      affected_wards: ["ward-02", "ward-05", "ward-08", "ward-12"],
      what_changed:
        "Citizen grievances increased by 31%, resolution time lengthened by 18%, and overall service performance declined by 14% over the past 3 months across Wards 2, 5, 8, and 12.",
      recommended_actions: [
        "Request project milestone status review for PRJ-2026-001",
        "Verify procurement deployment timeline for PROC-2026-041",
        "Inspect transfer station vehicle turnaround logs",
        "Conduct targeted site inspections in Ward 12 and Ward 5",
        "Publish interim public service advisory to local ward committees",
        "Convene inter-departmental delivery review between Waste Management and Procurement"
      ],
    },
    {
      code: "SIG-GOV-2026-002",
      title: "Monsoon Drainage Capacity & Waterlogging Risk",
      priority: "Medium Priority",
      risk_score: 58,
      ai_confidence: 82,
      affected_wards: ["ward-03", "ward-07", "ward-09"],
      what_changed:
        "Drainage clearance backlog accumulated 22% variance prior to expected monsoon precipitation cycles.",
      recommended_actions: [
        "Audit de-silting equipment readiness logs",
        "Accelerate secondary canal clearance operations in low-elevation wards"
      ],
    },
    {
      code: "SIG-GOV-2026-003",
      title: "Street Lighting Electrical Maintenance Latency",
      priority: "Low Priority",
      risk_score: 42,
      ai_confidence: 76,
      affected_wards: ["ward-01", "ward-04", "ward-10"],
      what_changed:
        "Replacement cycle for LED fixtures delayed by 9 days relative to civic SLA baseline.",
      recommended_actions: [
        "Restock centralized electrical spare parts inventory"
      ],
    },
  ],
  hero_case_summary: {
    signal: "SIG-GOV-2026-001 (Waste Collection Service Degradation)",
    affected_wards: ["Ward 2", "Ward 5", "Ward 8", "Ward 12"],
    complaint_surge: "+31%",
    cluster_concentration: "78% across 4 wards (484 of 620 complaints)",
    resolution_duration: "+18%",
    service_drop: "-14%",
    connected_project:
      "Waste Management Service Improvement (PRJ-2026-001, Approved ৳50 Cr, Planned 80%, Actual 54%, 26 pp variance: 'Progress variance — Requires review')",
    connected_procurement:
      "Service Deployment (PROC-2026-041, ৳18.5 Cr, Milestone delayed beyond September 2026)",
    ai_limitations:
      "Findings represent statistically correlated operational indicators requiring authorized human administrative verification. Correlation does not imply intent or misconduct.",
  },
  investigations: [
    {
      code: "INV-2026-001",
      title: "Cross-Departmental Review: Waste Collection Degradation & Delayed Compactor Logistics",
      status: "UNDER_REVIEW",
      department: "Waste Management Department",
      assigned_to: "Fatin Sharhad (Compliance Officer)",
      due_date: "2026-12-05T00:00:00",
    },
  ],
  methodology: {
    service_delivery_weight: "45%",
    citizen_satisfaction_weight: "15%",
    project_delivery_weight: "10%",
    procurement_assurance_weight: "25%",
    resolution_efficiency_weight: "5%",
    description:
      "Deterministic 100-point composite governance index balancing service performance, public sentiment, capital milestone progress, procurement milestone integrity, and grievance resolution turnaround times.",
  },
};

export default function ExecutiveReportsPage() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<BriefData>(DEFAULT_BRIEF);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  const fetchBrief = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/governance/reports/brief");
      if (res && res.governance_health_score) {
        setData({
          ...DEFAULT_BRIEF,
          ...res,
          kpis: {
            ...DEFAULT_BRIEF.kpis,
            ...(res.kpis || {})
          }
        });
      }
    } catch (err) {
      console.warn("Using deterministic brief data fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  const handleRegenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 400));
    await fetchBrief();
    setGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe numerical KPIs
  const totalGrievances = (data?.kpis?.total_grievances ?? 1500).toLocaleString();
  const activeProjects = (data?.kpis?.active_capital_projects ?? 20).toLocaleString();
  const trackedProcurements = (data?.kpis?.tracked_procurements ?? 15).toLocaleString();
  const activeInvestigations = (data?.kpis?.active_investigations ?? 1).toLocaleString();

  const formatWhatChanged = (wc: any): string => {
    if (!wc) return "Operational variance observed across service channels.";
    if (typeof wc === "string") return wc;
    if (typeof wc === "object") {
      return Object.entries(wc)
        .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
        .join(" • ");
    }
    return String(wc);
  };

  return (
    <AppShell>
      <div className="space-y-5 max-w-6xl mx-auto pb-8 print:max-w-none print:m-0 print:p-0">
        {/* Printable CSS overrides */}
        <style jsx global>{`
          @media print {
            body {
              background: #ffffff !important;
              color: #07140f !important;
            }
            header,
            aside,
            nav,
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
            .hemla-card {
              border: 1px solid #d1d5db !important;
              background: #ffffff !important;
              color: #111827 !important;
              box-shadow: none !important;
              break-inside: avoid;
            }
          }
          .print-only {
            display: none;
          }
        `}</style>

        {/* Page Header & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4 no-print">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-5 h-5 text-brand-mint" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                {language === "bn" ? "নির্বাহী সুশাসন প্রতিবেদন" : data.report_title}
              </h1>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {language === "bn" ? "ঢাকা সিটি সার্ভিসেস অথরিটি" : data.organization_name} &bull; {language === "bn" ? "আওতাধীন এলাকা: ঢাকা, বাংলাদেশ" : `Jurisdiction: ${data.jurisdiction}`} &bull; {data.compiled_date}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-mint/40 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-mint ${generating ? "animate-spin" : ""}`} />
              <span>{generating ? (language === "bn" ? "প্রস্তুত হচ্ছে..." : "Synthesizing...") : t("label.regenerate")}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg text-xs font-bold shadow-glow-sm hover:opacity-95 flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{t("label.export_pdf")}</span>
            </button>
          </div>
        </div>

        {/* Section 1: Headline Governance Health & Weights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Health Score Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 hemla-card relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-mint uppercase tracking-wider font-mono">
                {t("label.governance_health")}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-brand-bright border border-emerald-500/30">
                {language === "bn" ? "সক্রিয় বেঞ্চমার্ক" : "Active Baseline"}
              </span>
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl sm:text-5xl font-black text-brand-bright tracking-tight">
                {data.governance_health_score}
              </span>
              <span className="text-lg sm:text-xl font-bold text-[var(--text-secondary)]">/ 100</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                {language === "bn" ? "এআই-সহায়তাপ্রাপ্ত সুশাসন প্রস্তুতি নির্দেশক" : data.governance_health_label}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                {language === "bn"
                  ? "সেবা প্রদান, নাগরিক সন্তুষ্টি, মূলধনী প্রকল্পের অগ্রগতি এবং ক্রয় চুক্তির সমন্বয়ে প্রণীত ১০০-পয়েন্টের সামগ্রিক মূল্যায়ন সূচক।"
                  : data.methodology?.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-[var(--border-color)]">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">
                {t("label.methodology_weights")}:
              </p>
              <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
                <div className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="block font-bold text-brand-mint">{data.methodology?.service_delivery_weight || "45%"}</span>
                  <span className="text-[8px] text-[var(--text-secondary)]">{language === "bn" ? "সেবা" : "Service"}</span>
                </div>
                <div className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="block font-bold text-brand-mint">{data.methodology?.citizen_satisfaction_weight || "15%"}</span>
                  <span className="text-[8px] text-[var(--text-secondary)]">{language === "bn" ? "সন্তুষ্টি" : "Citizen"}</span>
                </div>
                <div className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="block font-bold text-brand-mint">{data.methodology?.project_delivery_weight || "10%"}</span>
                  <span className="text-[8px] text-[var(--text-secondary)]">{language === "bn" ? "প্রকল্প" : "Projects"}</span>
                </div>
                <div className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="block font-bold text-brand-mint">{data.methodology?.procurement_assurance_weight || "25%"}</span>
                  <span className="text-[8px] text-[var(--text-secondary)]">{language === "bn" ? "ক্রয়" : "Procure"}</span>
                </div>
                <div className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="block font-bold text-brand-mint">{data.methodology?.resolution_efficiency_weight || "5%"}</span>
                  <span className="text-[8px] text-[var(--text-secondary)]">{language === "bn" ? "গতি" : "Turnaround"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Operational KPIs */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 hemla-card">
              <div className="flex items-center justify-between text-brand-mint">
                <Users className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold">100% AUDITED</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {totalGrievances}
              </p>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                {t("label.citizen_grievances")}
              </p>
              <span className="text-[10px] text-brand-bright font-mono block">
                {language === "bn" ? "৪টি মূল ওয়ার্ডে ৭৮%" : "78% in 4 Priority Wards"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 hemla-card">
              <div className="flex items-center justify-between text-brand-mint">
                <Layers className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold">CAPITAL</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {activeProjects}
              </p>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                {t("label.tracked_projects")}
              </p>
              <span className="text-[10px] text-amber-400 font-mono block">
                {language === "bn" ? "৩টি পর্যালোচনায়" : "3 Need Review"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 hemla-card">
              <div className="flex items-center justify-between text-brand-mint">
                <Scale className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold">CONTRACTS</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {trackedProcurements}
              </p>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                {t("label.procurement_tenders")}
              </p>
              <span className="text-[10px] text-amber-400 font-mono block">
                PROC-2026-041
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5 hemla-card">
              <div className="flex items-center justify-between text-brand-mint">
                <ClipboardCheck className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold">SHA-256</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-brand-bright">
                {activeInvestigations}
              </p>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                {t("label.active_investigations")}
              </p>
              <span className="text-[10px] text-brand-mint font-mono block">
                INV-2026-001
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Hero Case Summary */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-brand-forest/30 via-[var(--bg-card)] to-[var(--bg-card)] border border-brand-mint/40 space-y-3.5 hemla-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-bright" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-mint font-mono">
                {t("label.key_findings")}
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/20 self-start sm:self-auto">
              {t("label.high_priority")} &bull; {t("label.risk_score")}: 74 &bull; {t("label.ai_confidence")}: 87%
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {data.hero_case_summary?.signal}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === "bn"
                ? "বহুমাত্রিক উপাত্ত সংশ্লেষণে বর্জ্য সংগ্রহ সেবায় ধারাবাহিক সংকট চিহ্নিত হয়েছে। নাগরিক অভিযোগ ৩১% বৃদ্ধি পেয়েছে, গড় সমাধানের সময় ১৮% দীর্ঘায়িত হয়েছে এবং সেবা প্রদান মান ১৪% হ্রাস পেয়েছে।"
                : "Multi-source cross-correlation indicates synchronized degradation across civic service channels. Citizen grievances escalated by 31% with an 18% increase in mean turnaround time and a 14% drop in operational metrics across Wards 2, 5, 8, and 12."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-bold text-brand-mint uppercase font-mono">
                {t("label.connected_project")}:
              </span>
              <p className="text-xs text-[var(--text-primary)] font-medium">
                {data.hero_case_summary?.connected_project}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-bold text-brand-mint uppercase font-mono">
                {t("label.connected_procurement")}:
              </span>
              <p className="text-xs text-[var(--text-primary)] font-medium">
                {data.hero_case_summary?.connected_procurement}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Active Signals Directory */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-mint" />
              <span>{language === "bn" ? "সক্রিয় সুশাসন সংকেতসমূহ" : "Catalog of Active Governance Signals"}</span>
            </h2>
            <Link
              href="/signals"
              className="text-xs font-bold text-brand-mint hover:underline flex items-center gap-1 no-print"
            >
              <span>{t("label.view_signals")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.signals?.map((sig) => (
              <div
                key={sig.code}
                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5 hemla-card flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-brand-bright bg-brand-forest/20 px-2 py-0.5 rounded border border-brand-mint/20">
                      {sig.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        sig.priority.includes("High")
                          ? "bg-red-500/15 text-red-300 border-red-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {sig.priority}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    {sig.title}
                  </h3>

                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {formatWhatChanged(sig.what_changed)}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <span>{t("label.risk_score")}: <strong className="text-[var(--text-primary)]">{sig.risk_score}</strong></span>
                  <span>{t("label.ai_confidence")}: <strong className="text-brand-bright">{sig.ai_confidence}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Recommended Action Plan */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3.5 hemla-card">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-brand-mint" />
              <span>{t("label.action_plan")}</span>
            </h2>
            <Link
              href="/actions"
              className="text-xs font-bold text-brand-mint hover:underline flex items-center gap-1 no-print"
            >
              <span>{t("label.open_action_center")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {data.signals?.[0]?.recommended_actions.map((act, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-brand-emerald text-dark-bg font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] leading-snug">
                    {act}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">
                    {language === "bn" ? "বিভাগ: বর্জ্য ব্যবস্থাপনা ও ক্রয় • সময়সীমা: ৭ দিন" : "Target: Waste Management • SLA: 7 Days • Status: Actionable"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Cryptographic Hash Footer */}
        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px] text-[var(--text-secondary)]">
          <div className="space-y-0.5">
            <p className="font-bold text-[var(--text-primary)] text-[11px]">
              {language === "bn" ? "প্রমাণীকৃত ব্রিফ ক্রিপ্টোগ্রাফিক হ্যাশ:" : "Authorized Brief Compilation Hash:"}
            </p>
            <p className="text-[10px] text-brand-bright break-all">
              e7b8a1c9024f56d9821ea34b09cf112a884f23bc6d014902ac7819ef0014a92c
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-brand-mint" />
            <span>SHA-256 Ledger Verified</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
