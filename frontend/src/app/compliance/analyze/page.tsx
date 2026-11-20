"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import {
  SearchCode,
  Sparkles,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Layers,
  ChevronDown,
  UserCheck,
  FileCheck,
  RotateCcw,
  BookOpen,
  Scale,
  Clock,
  Download,
  AlertCircle
} from "lucide-react";

export default function ComplianceAnalyzePage() {
  const [regulatorySources, setRegulatorySources] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [policyScope, setPolicyScope] = useState<string>("Data Retention & Audit Log Archival");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [agentTrace, setAgentTrace] = useState<any[]>([]);
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  // Load available regulatory standards
  useEffect(() => {
    const loadSources = async () => {
      try {
        const sources = await apiFetch("/regulatory/sources");
        setRegulatorySources(sources);
        if (sources.length > 0) {
          setSelectedSource(sources[0].id);
        }
      } catch (err) {
        console.error("Failed to load regulatory sources:", err);
      }
    };
    loadSources();
  }, []);

  const agentSteps = [
    { name: "Document Intelligence Agent", desc: "Extracting internal policy clauses, page numbers & section boundaries..." },
    { name: "Regulatory Research Agent", desc: "Searching legal obligations & statutory baselines..." },
    { name: "Control Mapping Agent", desc: "Benchmarking controls against obligations & identifying operational gaps..." },
    { name: "Risk Assessment Agent", desc: "Calculating quantitative Likelihood x Impact on 1-5 matrix..." },
    { name: "Remediation Agent", desc: "Formulating corrective actions, departmental ownership & SLA deadlines..." },
    { name: "Independent Verification Agent", desc: "Adversarially validating source citations & detecting hallucinations..." },
    { name: "Human Review Gate", desc: "Packaging findings for authorized compliance officer sign-off..." },
  ];

  const handleRunInvestigation = async (scopeToUse?: string, sourceToUse?: string) => {
    const finalScope = scopeToUse || policyScope;
    const finalSource = sourceToUse || selectedSource;

    setIsExecuting(true);
    setCurrentStep(0);
    setResult(null);
    setReviewSuccessMsg(null);

    // Simulate animated step transitions while backend executes genuine LangGraph workflow
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 6) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const res = await apiFetch("/compliance/investigate", {
        method: "POST",
        body: JSON.stringify({
          policy_scope: finalScope,
          regulatory_source_id: finalSource,
        }),
      });

      clearInterval(stepInterval);
      setCurrentStep(6);
      setResult(res);

      // Fetch the execution trace from agent run
      if (res.agent_execution_id) {
        try {
          const runDetails = await apiFetch(`/agents/runs/${res.agent_execution_id}`);
          setAgentTrace(runDetails.messages || []);
        } catch (e) {
          console.error("Could not fetch trace:", e);
        }
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      alert("Investigation execution failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleHumanReview = async (findingId: string, statusDecision: string) => {
    try {
      await apiFetch(`/compliance/findings/${findingId}/review`, {
        method: "PATCH",
        body: JSON.stringify({
          human_review_status: statusDecision,
          human_reviewer: "Sarah Jenkins, Lead Compliance Officer",
          human_review_notes: reviewNotes || "Finding audited against live operational logs. Formally authorized."
        }),
      });

      // Update local state
      if (result) {
        const updatedFindings = result.findings.map((f: any) => {
          if (f.id === findingId) {
            return {
              ...f,
              human_review_status: statusDecision,
              human_reviewer: "Sarah Jenkins, Lead Compliance Officer"
            };
          }
          return f;
        });
        setResult({ ...result, findings: updatedFindings });
      }
      setReviewSuccessMsg(`Finding status updated to: ${statusDecision}`);
      setTimeout(() => setReviewSuccessMsg(null), 4000);
    } catch (err: any) {
      alert("Human review update failed: " + err.message);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-bright animate-ping" />
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Compliance Investigation Lab
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-brand-mint to-brand-bright text-dark-bg">
                SIGNATURE ENGINE
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Evidence-First Multi-Agent LangGraph Workflow: Policy Extraction → Mandate Mapping → Gap Detection → Risk Matrix → Citation Verification → Human Review.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-brand-mint" />
            <span>Anti-Hallucination Gate Active</span>
          </div>
        </div>

        {/* 1. Investigation Configuration Card */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <SearchCode className="w-4 h-4 text-brand-mint" />
            <span>Launch Evidence Investigation</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Input 1: Policy Scope */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Target Policy or Control Scope
              </label>
              <input
                type="text"
                value={policyScope}
                onChange={(e) => setPolicyScope(e.target.value)}
                placeholder="e.g. Data Retention, Cloud Access, Incident Response..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              />
            </div>

            {/* Input 2: Regulatory Source */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Benchmark Regulatory Source
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              >
                {regulatorySources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.jurisdiction})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-5">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] mr-2">Quick Presets:</span>
            <div className="inline-flex flex-wrap gap-2 mt-1">
              {[
                "Data Retention & Audit Log Archival",
                "Administrative Multi-Factor Access",
                "Cyber Incident Notification Timeline",
                "Customer Data Erasure & Privacy Rights"
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPolicyScope(preset)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] hover:bg-brand-mint/10 border border-[var(--border-color)] text-[11px] text-[var(--text-primary)] transition-all"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={() => handleRunInvestigation()}
            disabled={isExecuting}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-extrabold text-xs shadow-glow-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all ${
              isExecuting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isExecuting ? (
              <>
                <Bot className="w-4 h-4 animate-spin text-dark-bg" />
                <span>Executing LangGraph Multi-Agent Workflow...</span>
              </>
            ) : (
              <>
                <SearchCode className="w-4 h-4" />
                <span>Execute Multi-Agent Investigation</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Live Agent Execution Stepper */}
        {isExecuting && (
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-brand-mint/30 shadow-glow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-brand-mint uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-4 h-4 animate-bounce" />
                Multi-Agent Orchestration Pipeline
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono">
                Step {currentStep + 1} of 7
              </span>
            </div>

            <div className="space-y-3">
              {agentSteps.map((s, idx) => {
                const isPassed = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isCurrent
                        ? "bg-brand-emerald/15 border-brand-mint text-brand-mint"
                        : isPassed
                        ? "bg-[var(--bg-elevated)] border-brand-bright/20 text-[var(--text-secondary)] opacity-80"
                        : "bg-[var(--bg-elevated)]/40 border-[var(--border-color)] text-[var(--text-secondary)] opacity-40"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? "bg-brand-bright text-dark-bg animate-pulse"
                          : isPassed
                          ? "bg-brand-forest/40 text-brand-mint"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{s.name}</p>
                      <p className="text-[10px] opacity-80">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Investigation Results View */}
        {result && (
          <div className="space-y-6">
            {/* Success Toast */}
            {reviewSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-brand-forest/30 border border-brand-mint text-brand-mint text-xs font-semibold flex items-center gap-2 shadow-glow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-bright" />
                <span>{reviewSuccessMsg}</span>
              </div>
            )}

            {/* Assessment Summary Header */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-mint">
                    Assessment ID: {result.id}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                    {result.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Audit Scope: {result.scope_jurisdiction}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-[var(--text-secondary)]">Compliance Score</span>
                    <div className="text-2xl font-black text-brand-bright">
                      {result.overall_score}%
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                    {result.status}
                  </span>
                </div>
              </div>

              {/* Summary Statement */}
              <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-color)]">
                {result.assessment_summary}
              </p>
            </div>

            {/* Findings & Evidence Grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-bright" />
                <span>Evidentiary Gap Findings ({result.findings?.length || 0})</span>
              </h3>

              {(result.findings || []).map((finding: any) => {
                const isImplemented = finding.status === "Implemented";
                const isPartial = finding.status === "Partially Implemented";
                const isMissing = finding.status === "Missing";

                return (
                  <div
                    key={finding.id}
                    className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-brand-mint border border-brand-mint/20">
                          {finding.requirement?.req_code || "MANDATE"}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">
                          {finding.requirement?.title || "Regulatory Obligation"}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isImplemented
                              ? "bg-brand-forest/30 text-brand-mint border border-brand-mint/30"
                              : isPartial
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {finding.status}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                          Impact: {finding.impact}
                        </span>
                      </div>
                    </div>

                    {/* AI Explanation */}
                    <div>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                        AI Gap Explanation:
                      </span>
                      <p className="text-xs text-[var(--text-primary)] mt-1 leading-relaxed">
                        {finding.explanation}
                      </p>
                    </div>

                    {/* Primary Evidence Box */}
                    {finding.evidence_items && finding.evidence_items.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-brand-mint font-mono flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Primary Document Citation (Page {finding.evidence_items[0].page_number})
                          </span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {finding.verification_status}: {Math.round(finding.confidence * 100)}% Confidence
                          </span>
                        </div>
                        <p className="text-xs italic font-serif text-[var(--text-secondary)] border-l-2 border-brand-bright pl-2.5">
                          &quot;{finding.evidence_items[0].excerpt}&quot;
                        </p>
                      </div>
                    )}

                    {/* Recommended Remediation Action */}
                    <div className="p-3 rounded-xl bg-brand-forest/10 border border-brand-mint/20">
                      <span className="text-[10px] font-bold text-brand-mint uppercase">
                        Recommended Corrective Action:
                      </span>
                      <p className="text-xs text-[var(--text-primary)] mt-0.5">
                        {finding.recommended_action}
                      </p>
                    </div>

                    {/* Human Review Authorization Actions */}
                    <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-brand-mint" />
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">
                          Human Review Status:{" "}
                          <span className="text-[var(--text-primary)] font-bold">
                            {finding.human_review_status}
                          </span>
                          {finding.human_reviewer && ` (${finding.human_reviewer})`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleHumanReview(finding.id, "Approved")}
                          className="px-3 py-1.5 rounded-lg bg-brand-emerald/20 hover:bg-brand-emerald/30 border border-brand-mint/30 text-brand-mint text-xs font-semibold transition-all"
                        >
                          Approve Finding
                        </button>
                        <button
                          onClick={() => handleHumanReview(finding.id, "Overridden")}
                          className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)]/80 border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-semibold transition-all"
                        >
                          Override Posture
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step-by-Step Agent Execution Inspector */}
            {agentTrace.length > 0 && (
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Bot className="w-4 h-4 text-brand-mint" />
                  <span>Agent Execution Trace (LangGraph Observability)</span>
                </h3>
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2 font-mono text-xs">
                  {agentTrace.map((msg: any) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-brand-bright font-bold text-[11px]">
                          [{msg.agent_name}]
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase">
                          {msg.message_type}
                        </span>
                      </div>
                      <p className="text-[var(--text-primary)] text-xs leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
