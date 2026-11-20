"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import IntroVideo from "@/components/IntroVideo";
import AuditScannerModal from "@/components/AuditScannerModal";
import { executeAuditPdfExport } from "@/lib/exportAuditPdf";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  SearchCode,
  AlertTriangle,
  FileCheck,
  ClipboardList,
  TrendingUp,
  Activity,
  Bot,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const DEFAULT_DASHBOARD_DATA = {
  overall_compliance_score: 84.5,
  total_requirements: 24,
  total_controls: 18,
  controls_summary: {
    compliant: 14,
    partial: 3,
    missing: 1
  },
  open_compliance_findings: 4,
  risks_summary: {
    critical: 1,
    high: 2,
    moderate: 4,
    low: 7
  },
  remediation_summary: {
    pending: 3,
    completed: 8
  },
  compliance_trends: [
    { month: "Q1 2025", score: 62 },
    { month: "Q2 2025", score: 71 },
    { month: "Q3 2025", score: 77 },
    { month: "Q4 2025", score: 81 },
    { month: "Q1 2026", score: 84.5 }
  ],
  risk_distribution: [
    { name: "Critical", value: 1, color: "#EF4444" },
    { name: "High", value: 2, color: "#F97316" },
    { name: "Moderate", value: 4, color: "#EAB308" },
    { name: "Low", value: 7, color: "#30ED7B" }
  ],
  recent_agent_runs: [
    {
      id: "run-001",
      workflow_name: "Regulatory Ingestion Agent — BB ICT Security Guidelines v3.0",
      verification_score: 0.98,
      latency_ms: 412,
      status: "COMPLETED"
    },
    {
      id: "run-002",
      workflow_name: "Evidence Grounding Agent — Enterprise Data Retention Policy",
      verification_score: 0.95,
      latency_ms: 580,
      status: "COMPLETED"
    },
    {
      id: "run-003",
      workflow_name: "Quantitative Risk Scoring Agent — Privileged Access Review",
      verification_score: 0.99,
      latency_ms: 320,
      status: "COMPLETED"
    },
    {
      id: "run-004",
      workflow_name: "Remediation Synthesizer Agent — FIDO2 MFA Hardware Enforcement",
      verification_score: 0.94,
      latency_ms: 490,
      status: "COMPLETED"
    }
  ],
  upcoming_deadlines: [
    {
      id: "task-01",
      title: "Implement 7-Year Transaction Log Immutable WORM Archival",
      assigned_to: "Fatin Sharhad",
      priority: "High",
      due_date: "Nov 28, 2026"
    },
    {
      id: "task-02",
      title: "Deploy FIDO2 Hardware Tokens for Core Banking Admin Console",
      assigned_to: "Tahmid Islam",
      priority: "Critical",
      due_date: "Dec 04, 2026"
    },
    {
      id: "task-03",
      title: "Automate Quarterly Dormant User Deprovisioning Certification",
      assigned_to: "Muskan Meheg",
      priority: "Moderate",
      due_date: "Dec 15, 2026"
    }
  ]
};

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<any>(DEFAULT_DASHBOARD_DATA);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isScanningExport, setIsScanningExport] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  useEffect(() => {
    // Only show intro if visiting directly in a fresh tab without having seen it
    const seen = sessionStorage.getItem("jurisnova_intro_seen");
    if (!seen) {
      setShowIntro(true);
    }

    const fetchDashboard = async () => {
      try {
        const res = await apiFetch("/dashboard/stats");
        if (res && res.total_requirements) {
          setData(res);
        }
      } catch (err: any) {
        console.warn("Using preloaded governance baseline data:", err);
      }
    };
    fetchDashboard();
  }, []);

  const handleExportPdf = async () => {
    setIsScanningExport(true);
    setScanStepIndex(0);
    try {
      await executeAuditPdfExport((stepIndex) => {
        setScanStepIndex(stepIndex);
      });
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setTimeout(() => {
        setIsScanningExport(false);
      }, 600);
    }
  };

  return (
    <>
      {showIntro && (
        <IntroVideo
          onComplete={() => {
            sessionStorage.setItem("jurisnova_intro_seen", "true");
            setShowIntro(false);
          }}
        />
      )}

      {/* Interactive Scanning & Data Ingestion Modal */}
      <AuditScannerModal isOpen={isScanningExport} currentStepIndex={scanStepIndex} />

      <AppShell>
        <div className="space-y-6">
          {/* Top Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="JurisNova AI"
                  width={40}
                  height={40}
                  className="rounded-xl shadow-glow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      {language === "bn" ? "নির্বাহী সুশাসন ড্যাশবোর্ড" : "Executive Governance Dashboard"}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-forest/20 text-brand-mint border border-brand-mint/20">
                      {language === "bn" ? "লাইভ সক্রিয়" : "LIVE PERSISTENCE"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Active Scope: Bangladesh Bank ICT Security Guidelines v3.0 &amp; EU GDPR Standards
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPdf}
                disabled={isScanningExport}
                className="btn-hard-turkey flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)]/80 border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition-all hover:border-brand-mint/40"
              >
                <Download className="w-4 h-4 text-brand-mint" />
                <span>{isScanningExport ? (language === "bn" ? "স্ক্যান ও প্রস্তুত হচ্ছে..." : "Scanning & Compiling...") : (language === "bn" ? "পিডিএফ অডিট ডাউনলোড" : "Export PDF Audit")}</span>
              </button>

              <Link
                href="/compliance/analyze"
                className="btn-hard-turkey flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all"
              >
                <SearchCode className="w-4 h-4" />
                <span>{language === "bn" ? "নতুন তদন্ত" : "New Investigation"}</span>
              </Link>
            </div>
          </div>

          {/* 1. Core Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Overall Score */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] relative overflow-hidden hemla-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {language === "bn" ? "অনুপালন সামগ্রিক অবস্থা" : "Compliance Posture"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-brand-forest/20 text-brand-mint flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-brand-bright" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                  {data?.overall_compliance_score || 84.5}%
                </span>
                <span className="text-xs font-semibold text-brand-mint flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +6.5% Q4
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-2">
                {data?.controls_summary?.compliant || 14} {language === "bn" ? "টি যাচাইকৃত (মোট " : "of "} {data?.total_controls || 18} {language === "bn" ? "টির মধ্যে)" : "controls verified"}
              </p>
            </div>

            {/* Card 2: Open Findings */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {language === "bn" ? "উন্মুক্ত ব্যবধান ফলাফল" : "Open Gap Findings"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                  {data?.open_compliance_findings || 4}
                </span>
                <span className="text-xs text-amber-400 font-medium">
                  {language === "bn" ? "অনুমোদনের অপেক্ষায়" : "Pending Sign-off"}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-2">
                {data?.controls_summary?.missing || 1} {language === "bn" ? "অনুপস্থিত" : "missing"} &bull; {data?.controls_summary?.partial || 3} {language === "bn" ? "আংশিক" : "partial"}
              </p>
            </div>

            {/* Card 3: Critical Risks */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {language === "bn" ? "জরুরি / উচ্চ ঝুঁকি" : "Critical / High Risks"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                  {(data?.risks_summary?.critical || 1) + (data?.risks_summary?.high || 2)}
                </span>
                <span className="text-xs text-red-400 font-medium">
                  {data?.risks_summary?.critical || 1} {language === "bn" ? "সংবেদনশীল ঝুঁকি" : "Critical Exposure"}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-2">
                {language === "bn" ? "ঝুঁকি সূত্র: সম্ভাব্যতা × প্রভাব (১-২৫)" : "Risk Score formula: Likelihood × Impact (1-25)"}
              </p>
            </div>

            {/* Card 4: Remediation Tasks */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {language === "bn" ? "সক্রিয় প্রতিকার ব্যবস্থা" : "Active Remediations"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-brand-forest/20 text-brand-mint flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-brand-bright" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                  {data?.remediation_summary?.pending || 3}
                </span>
                <span className="text-xs text-brand-mint font-medium">
                  {language === "bn" ? "এসএলএ সময়সীমায়" : "Under SLA"}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-2">
                {data?.remediation_summary?.completed || 8} {language === "bn" ? "পদক্ষেপ সম্পন্ন হয়েছে" : "completed actions verified"}
              </p>
            </div>
          </div>

          {/* 2. Charts Section: Trend & Risk Matrix Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Chart (2 columns) */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {language === "bn" ? "অনুপালন পরিপক্কতার ধারাবাহিকতা" : "Compliance Maturity Progression"}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {language === "bn" ? "বিগত ৫ প্রান্তিকের ঐতিহাসিক অডিট স্কোর বিশ্লেষণ" : "Historical audit score trajectory across 5 quarters"}
                  </p>
                </div>
                <span className="text-xs text-brand-mint font-mono font-semibold">
                  {language === "bn" ? "+২৪.৫% সার্বিক" : "+24.5% Overall"}
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.compliance_trends || []}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#30ED7B" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#00875F" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#617267" fontSize={11} tickLine={false} />
                    <YAxis stroke="#617267" fontSize={11} domain={[0, 100]} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-color)",
                        borderRadius: "8px",
                        color: "var(--text-primary)"
                      }}
                      itemStyle={{ color: "var(--text-primary)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#00D765"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#scoreGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Severity Distribution (1 column) */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between hemla-card">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                  {language === "bn" ? "ঝুঁকি প্রভাব বিন্যাস" : "Risk Exposure Distribution"}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  {language === "bn" ? "সম্ভাব্যতা × প্রভাব (৫x৫) বিশ্লেষণ" : "Enterprise 5x5 Likelihood × Impact breakdown"}
                </p>

                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.risk_distribution || []}
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {(data?.risk_distribution || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-color)",
                          borderRadius: "8px",
                          color: "var(--text-primary)"
                        }}
                        itemStyle={{ color: "var(--text-primary)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[var(--border-color)]">
                {(data?.risk_distribution || []).map((r: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                      {r.name}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {r.value} {language === "bn" ? "টি" : "items"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Operational Activity & Multi-Agent Tracing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Multi-Agent Runs */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-brand-mint" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {language === "bn" ? "সাম্প্রতিক মাল্টি-এজেন্ট কর্মপ্রবাহ" : "Recent Multi-Agent Workflows"}
                  </h3>
                </div>
                <Link href="/agents" className="text-xs text-brand-mint hover:underline flex items-center gap-1">
                  <span>{language === "bn" ? "সব দেখুন" : "View all"}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {(data?.recent_agent_runs || []).map((run: any) => (
                  <div
                    key={run.id}
                    className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{run.workflow_name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--text-secondary)]">
                        <span>{language === "bn" ? "যাচাইকরণ:" : "Verification:"} {Math.round(run.verification_score * 100)}%</span>
                        <span>&bull;</span>
                        <span>{language === "bn" ? "লেটেন্সি:" : "Latency:"} {run.latency_ms}ms</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-forest/20 text-brand-mint border border-brand-mint/20">
                      {run.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Remediation Deadlines */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {language === "bn" ? "আসন্ন প্রতিকার সময়সীমা" : "Upcoming Remediation SLAs"}
                  </h3>
                </div>
                <Link href="/remediation" className="text-xs text-brand-mint hover:underline flex items-center gap-1">
                  <span>{language === "bn" ? "টাস্ক পরিচালনা" : "Manage tasks"}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {(data?.upcoming_deadlines || []).map((task: any) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-between"
                  >
                    <div className="max-w-[70%]">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{task.title}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                        {language === "bn" ? "বরাদ্দকৃত:" : "Assigned:"} {task.assigned_to}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {language === "bn" ? "মেয়াদ:" : "Due:"} {task.due_date}
                      </span>
                      <p className="text-[9px] text-[var(--text-secondary)] mt-1">
                        {task.priority} {language === "bn" ? "অগ্রাধিকার" : "Priority"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
