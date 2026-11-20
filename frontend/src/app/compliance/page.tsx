"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  SearchCode,
  ArrowRight,
  TrendingUp,
  FileCheck
} from "lucide-react";

export default function ComplianceOverviewPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [asmList, dashStats] = await Promise.all([
          apiFetch("/compliance/assessments"),
          apiFetch("/dashboard/stats"),
        ]);
        setAssessments(asmList);
        setStats(dashStats);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Compliance Governance Overview
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Active Control Posture Benchmarked Against Bangladesh Bank ICT Security Guidelines & International Standards.
            </p>
          </div>

          <Link
            href="/compliance/analyze"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-mint to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all self-start sm:self-auto"
          >
            <SearchCode className="w-4 h-4" />
            <span>Launch Investigation</span>
          </Link>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-secondary)]">Compliant Controls</span>
            <div className="text-3xl font-extrabold text-brand-bright mt-2">
              {stats?.controls_summary?.compliant || 2}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Fully documented and operational</p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-secondary)]">Partially Implemented</span>
            <div className="text-3xl font-extrabold text-yellow-400 mt-2">
              {stats?.controls_summary?.partial || 1}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Procedural gaps identified</p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-secondary)]">Missing Controls</span>
            <div className="text-3xl font-extrabold text-red-400 mt-2">
              {stats?.controls_summary?.missing || 1}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Immediate remediation required</p>
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Recent Formal Assessments</h2>
            <Link href="/compliance/findings" className="text-xs text-brand-mint hover:underline font-semibold">
              View All Findings →
            </Link>
          </div>

          {assessments.map((asm) => (
            <div
              key={asm.id}
              className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{asm.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Scope: {asm.scope_jurisdiction}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-brand-bright">{asm.overall_score}% Compliant</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20">
                    {asm.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border-color)]">
                {asm.assessment_summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
