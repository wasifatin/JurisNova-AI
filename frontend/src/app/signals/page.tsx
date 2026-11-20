"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  Activity,
  Flame,
  Search,
  Filter,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  MapPin,
  Building2,
  Calendar,
  Layers,
  TrendingDown,
  Info
} from "lucide-react";

export default function GovernanceSignalsPage() {
  const { language, t } = useLanguage();
  const [signals, setSignals] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedWard, setSelectedWard] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSignals = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/governance/signals");
        setSignals(data || []);
      } catch (err) {
        console.error("Failed to load signals:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSignals();
  }, []);

  const filteredSignals = signals.filter((sig) => {
    const matchesSev = selectedSeverity === "ALL" || sig.severity.toUpperCase() === selectedSeverity;
    const matchesWard = selectedWard === "ALL" || (sig.affected_wards || []).includes(selectedWard);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      sig.title.toLowerCase().includes(q) ||
      sig.signal_code.toLowerCase().includes(q) ||
      sig.description.toLowerCase().includes(q);
    return matchesSev && matchesWard && matchesSearch;
  });

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                <Activity className="w-5 h-5 text-brand-bright" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {language === "bn" ? "সমন্বিত সুশাসন সংকেতসমূহ" : "Unified Governance Signals"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === "bn"
                    ? "নাগরিক সেবা, প্রকল্পের সময়সীমা ও ক্রয় চুক্তির মধ্যে এআই-শনাক্তকৃত পরিচালন অসঙ্গতি"
                    : "AI-Correlated Operational Anomalies across Service Grievances, Project Schedulers & Procurement Ledgers"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-brand-mint bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
              {filteredSignals.length} Active Signals Detected
            </span>
          </div>
        </div>

        {/* Severity Scale Guide Banner */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-mint shrink-0" />
            <span>Deterministic Risk Severity Scale:</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-500" /> Critical (76-100)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" /> High (51-75)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-yellow-500" /> Medium (26-50)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-brand-bright" /> Low (0-25)
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSeverity === sev
                    ? "bg-brand-emerald text-dark-bg font-bold shadow-glow-sm"
                    : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search signal code, keyword, topic..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
            />
          </div>
        </div>

        {/* Signals List */}
        <div className="space-y-4">
          {filteredSignals.map((sig) => {
            const isHero = sig.signal_code === "SIG-GOV-2026-001";
            const sevBadge =
              sig.severity === "Critical"
                ? "bg-red-500/20 text-red-300 border-red-500/40"
                : sig.severity === "High"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";

            return (
              <div
                key={sig.id}
                className={`p-6 rounded-2xl bg-[var(--bg-card)] border transition-all hemla-card space-y-4 ${
                  isHero
                    ? "border-brand-mint/40 shadow-glow-sm"
                    : "border-[var(--border-color)] hover:border-brand-mint/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-brand-bright bg-brand-forest/30 px-2.5 py-1 rounded-lg border border-brand-mint/30">
                      {sig.signal_code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sevBadge}`}>
                      {sig.priority} &bull; Severity: {sig.severity}
                    </span>
                    {isHero && (
                      <span className="text-[10px] font-extrabold uppercase bg-brand-emerald text-dark-bg px-2 py-0.5 rounded-full shadow-sm">
                        Hero Scenario
                      </span>
                    )}
                  </div>

                  {/* Dual Score & Confidence Separated */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--text-secondary)] block font-mono">Risk Score</span>
                      <strong className="text-sm font-black text-amber-400 font-mono">{sig.risk_score}/100</strong>
                    </div>
                    <div className="w-[1px] h-6 bg-[var(--border-color)]" />
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--text-secondary)] block font-mono">AI Confidence</span>
                      <strong className="text-sm font-black text-brand-bright font-mono">{sig.ai_confidence}%</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">
                    {sig.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {sig.description}
                  </p>
                </div>

                {/* Key Metrics / Observed Changes Chips */}
                {sig.what_changed && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {Object.entries(sig.what_changed).map(([k, val]: any) => (
                      <span
                        key={k}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      >
                        <strong className="text-brand-mint">{k.replace("_", " ")}: </strong>
                        <span>{String(val)}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Meta & Actions */}
                <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-mint" />
                      <span>{(sig.affected_wards || []).join(", ")}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-brand-mint" />
                      <span>{(sig.affected_departments || []).join(" &bull; ")}</span>
                    </span>
                  </div>

                  <Link
                    href={`/signals/${sig.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-forest/25 hover:bg-brand-forest/40 border border-brand-mint/30 text-brand-mint text-xs font-bold transition-all self-end sm:self-auto hover:border-brand-mint shadow-sm"
                  >
                    <span>Inspect Signal &amp; Create Investigation</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
