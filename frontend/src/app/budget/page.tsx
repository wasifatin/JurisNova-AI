"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  Wallet,
  Building2,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  ChevronRight,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

export default function BudgetIntelligencePage() {
  const { language, t } = useLanguage();
  const [budgetData, setBudgetData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudget = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/governance/budget");
        setBudgetData(data);
      } catch (err) {
        console.error("Failed to load budget intelligence:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBudget();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                <Wallet className="w-5 h-5 text-brand-bright" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {language === "bn" ? "বাজেট ও আর্থিক সুশাসন বিশ্লেষণ" : "Budget & Financial Governance Intelligence"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === "bn"
                    ? "মূলধনী ব্যয় যাচাইকরণ • ১০টি বিভাগের আর্থিক বিতরণ ও ভৌত অগ্রগতির সামঞ্জস্য"
                    : "Capital Expenditure Verification • Disbursal-to-Physical Progress Alignment Across 10 Departments"}
                </p>
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-brand-mint bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
            Fiscal Year: FY2025-2026
          </span>
        </div>

        {/* Responsible Audit Disclaimer */}
        <div className="p-3.5 rounded-xl bg-brand-forest/15 border border-brand-mint/30 flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-brand-mint shrink-0" />
          <span>
            <strong>NEUTRAL VARIANCE NOTICE:</strong> Financial-to-physical progress variance represents an accounting-engineering milestone delta requiring evidentiary verification. It does not imply financial misconduct, corruption, or fraud.
          </span>
        </div>

        {/* 1. High-Level Financial KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel hemla-card space-y-1">
            <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase">Total Approved Allocation</span>
            <p className="text-3xl font-black text-[var(--text-primary)] font-mono">
              ৳{budgetData?.summary?.total_approved_cr || 306.0} Cr
            </p>
            <span className="text-[11px] text-[var(--text-secondary)]">Sanctioned FY2025-26</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel hemla-card space-y-1">
            <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase">Released Budget</span>
            <p className="text-3xl font-black text-brand-mint font-mono">
              ৳{budgetData?.summary?.total_released_cr || 238.7} Cr
            </p>
            <span className="text-[11px] text-[var(--text-secondary)]">78% release threshold</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel hemla-card space-y-1">
            <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase">Total Disbursed / Spent</span>
            <p className="text-3xl font-black text-brand-bright font-mono">
              ৳{budgetData?.summary?.total_spent_cr || 230.3} Cr
            </p>
            <span className="text-[11px] text-[var(--text-secondary)]">Verified in audit ledger</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel hemla-card space-y-1">
            <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase">Budget Utilization</span>
            <p className="text-3xl font-black text-amber-400 font-mono">
              {budgetData?.summary?.utilization_pct || 75.3}%
            </p>
            <span className="text-[11px] text-[var(--text-secondary)]">Overall expenditure index</span>
          </div>
        </div>

        {/* 2. Hero Demonstration Case: 75% Financial vs 39% Physical Progress */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[var(--bg-card)] to-brand-forest/10 border border-amber-500/40 shadow-glow-sm space-y-4 hemla-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                PRJ-2026-005
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                {budgetData?.hero_variance_case?.variance_label || "Financial-to-physical progress variance — Needs Review"}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              Variance Gap: 36.0 Percentage Points
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-3">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {budgetData?.hero_variance_case?.project_name || "Secondary Transfer Station Modernization"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {budgetData?.hero_variance_case?.neutral_explanation ||
                  "Financial-to-physical progress variance — Needs Review. Expended 75% of budget against 39% physical progress."}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase block">What Is Known (Verified):</span>
                  <p className="text-xs text-[var(--text-primary)]">
                    ৳21.0 Cr advance equipment payment verified in accounting ledger for imported hydraulic machinery under contract PROC-2026-005.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] text-amber-400 font-mono uppercase block">What Is Unverified (Pending Review):</span>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Physical site delivery confirmation and electrical substation transformer integration vouchers awaiting on-site engineering audit sign-off.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Progress Delta Comparison */}
            <div className="md:col-span-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-4 flex flex-col justify-center">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--text-secondary)]">Financial Progress:</span>
                  <strong className="text-amber-400 font-bold">75.0%</strong>
                </div>
                <div className="w-full bg-dark-bg/60 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--text-secondary)]">Physical Progress:</span>
                  <strong className="text-brand-bright font-bold">39.0%</strong>
                </div>
                <div className="w-full bg-dark-bg/60 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-emerald h-full rounded-full" style={{ width: "39%" }} />
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center justify-between">
                <span>Budget: ৳28.0 Cr</span>
                <span>Disbursed: ৳21.0 Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Department Allocations Table */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-4 hemla-card">
          <div className="border-b border-[var(--border-color)] pb-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Departmental Budget Allocation &amp; Execution Directory (10 Departments)
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Comparative analysis of approved allocations, disbursals, remaining budget, and physical alignment.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Approved (৳ Cr)</th>
                  <th className="py-2.5 px-3">Released (৳ Cr)</th>
                  <th className="py-2.5 px-3">Spent (৳ Cr)</th>
                  <th className="py-2.5 px-3">Remaining (৳ Cr)</th>
                  <th className="py-2.5 px-3">Financial %</th>
                  <th className="py-2.5 px-3">Physical %</th>
                  <th className="py-2.5 px-3">Status / Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] font-mono text-[11px]">
                {(budgetData?.department_allocations || []).map((b: any) => (
                  <tr key={b.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-[var(--text-primary)]">{b.department}</td>
                    <td className="py-3 px-3 text-[var(--text-primary)]">৳{b.approved_cr}</td>
                    <td className="py-3 px-3 text-brand-mint">৳{b.released_cr}</td>
                    <td className="py-3 px-3 text-brand-bright font-bold">৳{b.spent_cr}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">৳{b.remaining_cr}</td>
                    <td className="py-3 px-3 text-brand-mint font-bold">{b.financial_progress_pct}%</td>
                    <td className="py-3 px-3 text-[var(--text-primary)]">{b.physical_progress_pct}%</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                        {b.variance_label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
