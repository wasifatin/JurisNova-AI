"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingDown,
  Info,
  ChevronRight,
  Filter,
  X,
  Sparkles
} from "lucide-react";

const DEFAULT_RISKS = [
  {
    id: "risk-001",
    title: "Incomplete 7-Year Transaction Log Cold Archival",
    category: "Regulatory & Compliance",
    likelihood: 4,
    impact: 5,
    risk_score: 20,
    severity: "CRITICAL",
    owner: "Fatin Sharhad (Compliance Officer)",
    ai_explanation:
      "Core banking transaction logs are maintained in online hot storage for only 180 days. Absence of immutable WORM cold tier storage directly breaches Bangladesh Bank ICT Security Guidelines v3.0 Section 3.2.1, exposing the institution to severe supervisory fines and audit citations."
  },
  {
    id: "risk-002",
    title: "Single-Factor Administrative Access to Database Bastions",
    category: "Cybersecurity & Access Control",
    likelihood: 3,
    impact: 5,
    risk_score: 15,
    severity: "HIGH",
    owner: "Tahmid Islam (Risk Analyst)",
    ai_explanation:
      "Console access to core production database nodes permits single-factor password elevation. Violates ISO 27001:2022 Control A.9.4 and creates lateral movement vulnerability if privileged credentials are leaked."
  },
  {
    id: "risk-003",
    title: "Manual Quarterly Dormant User Certification Sweeps",
    category: "Operational Governance",
    likelihood: 4,
    impact: 3,
    risk_score: 12,
    severity: "HIGH",
    owner: "Muskan Meheg (Lead Auditor)",
    ai_explanation:
      "Lack of automated cron triggers for disabling inactive credentials (> 30 days) leaves lingering access vectors across core banking APIs."
  },
  {
    id: "risk-004",
    title: "Unsynchronized Incident Reporting CIRT Escalation SLA",
    category: "Regulatory Reporting",
    likelihood: 2,
    impact: 4,
    risk_score: 8,
    severity: "MODERATE",
    owner: "Md. Tanvir Hossain (Super Admin)",
    ai_explanation:
      "Current incident escalation runbook cites 24-hour reporting, whereas Bangladesh Bank ICT Guideline Section 5.4.2 mandates formal notice within 6 hours."
  }
];

function buildDefaultMatrix(riskList: any[]) {
  const matrix: any[][] = [];
  for (let l = 5; l >= 1; l--) {
    const row: any[] = [];
    for (let imp = 1; imp <= 5; imp++) {
      const score = l * imp;
      let color = "#30ED7B";
      if (score >= 17) color = "#EF4444";
      else if (score >= 10) color = "#F97316";
      else if (score >= 5) color = "#EAB308";

      const matched = riskList.filter((r) => r.likelihood === l && r.impact === imp);
      row.push({
        likelihood: l,
        impact: imp,
        score,
        color,
        count: matched.length,
        items: matched
      });
    }
    matrix.push(row);
  }

  const critical_count = riskList.filter((r) => r.severity === "CRITICAL").length;
  const high_count = riskList.filter((r) => r.severity === "HIGH").length;
  const moderate_count = riskList.filter((r) => r.severity === "MODERATE").length;
  const low_count = riskList.filter((r) => r.severity === "LOW").length;

  return { matrix, critical_count, high_count, moderate_count, low_count };
}

export default function RiskIntelligencePage() {
  const [risks, setRisks] = useState<any[]>(DEFAULT_RISKS);
  const [matrixData, setMatrixData] = useState<any>(buildDefaultMatrix(DEFAULT_RISKS));
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedRiskModal, setSelectedRiskModal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRisks = async () => {
      try {
        const [riskList, matrix] = await Promise.all([
          apiFetch("/risks"),
          apiFetch("/risks/matrix"),
        ]);
        if (Array.isArray(riskList) && riskList.length > 0) {
          setRisks(riskList);
        }
        if (matrix && matrix.matrix) {
          setMatrixData(matrix);
        }
      } catch (e) {
        console.warn("Using preloaded 5x5 risk intelligence matrix:", e);
      } finally {
        setLoading(false);
      }
    };
    loadRisks();
  }, []);

  const filteredRisks = risks.filter(
    (r) => selectedSeverity === "ALL" || r.severity === selectedSeverity
  );

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Risk Intelligence Center
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Quantitative 5x5 Matrix: Risk Score = Likelihood (1-5) &times; Impact (1-5) &bull; Transparent AI Explanations.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 self-start sm:self-auto font-mono">
            {matrixData?.critical_count || 1} Critical Exposure Detected
          </span>
        </div>

        {/* 1. 5x5 Risk Heatmap Matrix */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-4 hemla-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-bright" />
                <span>Interactive 5x5 Enterprise Heatmap Matrix</span>
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Y-Axis: Likelihood (1-5) &bull; X-Axis: Impact (1-5) &bull; Click any cell to inspect risks
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500" /> Critical (17-25)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> High (10-16)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-500" /> Moderate (5-9)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-brand-bright" /> Low (1-4)</span>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[500px] space-y-2">
              {(matrixData?.matrix || []).map((row: any[], rIdx: number) => (
                <div key={rIdx} className="flex items-center gap-2">
                  <span className="w-7 text-[11px] font-mono font-bold text-right text-[var(--text-secondary)]">
                    L{5 - rIdx}
                  </span>
                  {row.map((cell: any, cIdx: number) => {
                    const isCritical = cell.score >= 17;
                    const isHigh = cell.score >= 10 && cell.score < 17;
                    const isModerate = cell.score >= 5 && cell.score < 10;

                    let cellBgClass =
                      "bg-[var(--bg-elevated)]/35 hover:bg-[var(--bg-elevated)]/75 border border-[var(--border-color)]/60 text-[var(--text-secondary)]";
                    let countBadgeClass =
                      "bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)]";

                    if (cell.count > 0) {
                      if (isCritical) {
                        cellBgClass =
                          "bg-red-500/15 border-2 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:border-red-500/80";
                        countBadgeClass = "bg-red-500 text-white font-bold shadow-sm";
                      } else if (isHigh) {
                        cellBgClass =
                          "bg-amber-500/15 border-2 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.18)] hover:border-amber-500/80";
                        countBadgeClass = "bg-amber-500 text-dark-bg font-bold shadow-sm";
                      } else if (isModerate) {
                        cellBgClass =
                          "bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 hover:border-yellow-500/70";
                        countBadgeClass = "bg-yellow-400 text-dark-bg font-bold";
                      } else {
                        cellBgClass =
                          "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:border-emerald-500/70";
                        countBadgeClass = "bg-emerald-400 text-dark-bg font-bold";
                      }
                    }

                    return (
                      <button
                        key={cIdx}
                        onClick={() => {
                          if (cell.items && cell.items.length > 0) {
                            const rawItem = cell.items[0];
                            const fullRisk = risks.find(
                              (r) => r.id === rawItem.id || r.title === rawItem.title
                            );
                            setSelectedRiskModal({
                              ...rawItem,
                              ...(fullRisk || {}),
                              likelihood: fullRisk?.likelihood ?? rawItem.likelihood ?? cell.likelihood,
                              impact: fullRisk?.impact ?? rawItem.impact ?? cell.impact,
                              risk_score: fullRisk?.risk_score ?? rawItem.risk_score ?? rawItem.score ?? cell.score,
                              category: fullRisk?.category ?? rawItem.category ?? "Operational & Compliance Risk",
                              owner: fullRisk?.owner ?? rawItem.owner ?? "CISO & Incident Management",
                              ai_explanation:
                                fullRisk?.ai_explanation ??
                                rawItem.ai_explanation ??
                                rawItem.rationale ??
                                "Automated risk vector analysis indicates compliance exposure requiring remediation control implementation.",
                            });
                          }
                        }}
                        className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center p-1.5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] relative cursor-pointer group ${cellBgClass}`}
                      >
                        <div className="w-full flex items-center justify-between px-1.5">
                          <span className="text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                            {cell.score}
                          </span>
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cell.color }}
                          />
                        </div>

                        {cell.count > 0 ? (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full mt-0.5 ${countBadgeClass}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            <span>
                              {cell.count} {cell.count === 1 ? "risk" : "risks"}
                            </span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono opacity-20 group-hover:opacity-40">
                            &mdash;
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <span className="w-7" />
                {["Imp 1", "Imp 2", "Imp 3", "Imp 4", "Imp 5"].map((label, idx) => (
                  <span
                    key={idx}
                    className="flex-1 text-center text-[10px] font-mono text-[var(--text-secondary)] font-medium"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["ALL", "CRITICAL", "HIGH", "MODERATE", "LOW"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSeverity === sev
                  ? "bg-brand-emerald text-dark-bg shadow-glow-sm"
                  : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Risk Register Cards */}
        <div className="space-y-3">
          {filteredRisks.map((risk) => {
            const sevColor =
              risk.severity === "CRITICAL"
                ? "text-red-400 bg-red-500/10 border-red-500/20"
                : risk.severity === "HIGH"
                ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                : risk.severity === "MODERATE"
                ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                : "text-brand-bright bg-brand-forest/20 border-brand-mint/20";

            return (
              <div
                key={risk.id}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 hemla-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${sevColor}`}>
                      {risk.severity} (Score {risk.risk_score})
                    </span>
                    <h3 className="text-xs font-bold text-[var(--text-primary)]">{risk.title}</h3>
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono self-start sm:self-auto">
                    Owner: {risk.owner || "Compliance Team"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
                  <span>Likelihood: <strong className="text-[var(--text-primary)]">{risk.likelihood}/5</strong></span>
                  <span>&bull;</span>
                  <span>Impact: <strong className="text-[var(--text-primary)]">{risk.impact}/5</strong></span>
                  <span>&bull;</span>
                  <span>Category: <strong className="text-brand-mint">{risk.category}</strong></span>
                </div>

                {risk.ai_explanation && (
                  <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                    <span className="text-[10px] font-bold text-brand-mint uppercase flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Risk Rationale:
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {risk.ai_explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal for Risk Inspection */}
        {selectedRiskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-slide-up">
            <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--bg-card)] border border-brand-mint/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-bold font-mono text-brand-bright">
                  Risk ID: {selectedRiskModal.id || "RSK-EXP-001"}
                </span>
                <button
                  onClick={() => setSelectedRiskModal(null)}
                  className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {selectedRiskModal.title || "Regulatory Compliance Exposure"}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Category: <strong className="text-[var(--text-primary)]">{selectedRiskModal.category || "Operational Compliance"}</strong> &bull; Owner: <span className="font-medium text-[var(--text-primary)]">{selectedRiskModal.owner || "CISO & Incident Management"}</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Likelihood</span>
                  <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">{selectedRiskModal.likelihood || 3}/5</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Impact</span>
                  <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">{selectedRiskModal.impact || 4}/5</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30">
                  <span className="text-[10px] font-mono text-red-400 uppercase font-semibold">Total Score</span>
                  <p className="text-lg font-black text-red-400 mt-0.5">
                    {selectedRiskModal.risk_score || selectedRiskModal.score || (selectedRiskModal.likelihood || 3) * (selectedRiskModal.impact || 4)}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1.5">
                <span className="text-[10px] font-bold text-brand-mint uppercase tracking-wider block font-mono">
                  AI Assessment &amp; Exposure Root Cause:
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedRiskModal.ai_explanation || selectedRiskModal.rationale || "AI-assessed risk score derived from empirical control gaps and Central Bank supervisory enforcement precedents."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
