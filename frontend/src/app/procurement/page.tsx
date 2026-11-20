"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  Scale,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  FileText
} from "lucide-react";

export default function ProcurementWatchPage() {
  const { language, t } = useLanguage();
  const [procurements, setProcurements] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProcurements = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/governance/procurements");
        setProcurements(data || []);
      } catch (err) {
        console.error("Failed to load procurements:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProcurements();
  }, []);

  const filtered = procurements.filter((p) => {
    const isDelayed = p.status.toLowerCase().includes("delayed");
    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "DELAYED" && isDelayed) ||
      (selectedStatus === "COMPLETED" && !isDelayed);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.ref.toLowerCase().includes(q) ||
      p.contractor.toLowerCase().includes(q) ||
      p.project_name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                <Scale className="w-5 h-5 text-brand-bright" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {language === "bn" ? "ক্রয় গোয়েন্দা ও চুক্তি পর্যবেক্ষণ" : "Procurement Intelligence & Contract Watch"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === "bn"
                    ? "চুক্তির মাইলস্টোন নিশ্চিতকরণ • ১৫টি মূলধনী ক্রয় চুক্তির বাস্তবায়ন ও এসএলএ পর্যবেক্ষণ"
                    : "Contractual Milestone Verification • Tracking 15 Capital Procurement Agreements Against Operational SLAs"}
                </p>
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-brand-mint bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
            15 Contracts Ingested
          </span>
        </div>

        {/* Responsible AI Disclaimer */}
        <div className="p-3.5 rounded-xl bg-brand-forest/15 border border-brand-mint/30 flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-brand-mint shrink-0" />
          <span>
            <strong>NEUTRAL AUDIT NOTICE:</strong> Procurement milestone delays indicate operational schedule variance requiring administrative review. The platform does not infer wrongdoing, fraud, or misconduct from supplier delivery delays.
          </span>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {["ALL", "DELAYED", "COMPLETED"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? "bg-brand-emerald text-dark-bg font-bold shadow-glow-sm"
                    : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref (e.g. PROC-2026-041), contractor..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
            />
          </div>
        </div>

        {/* Procurements Cards Grid */}
        <div className="space-y-4">
          {filtered.map((pr) => {
            const isHero = pr.ref === "PROC-2026-041";
            const isDelayed = pr.status.toLowerCase().includes("delayed");

            return (
              <div
                key={pr.id}
                className={`p-6 rounded-2xl bg-[var(--bg-card)] border transition-all hemla-card space-y-4 ${
                  isHero
                    ? "border-brand-mint/50 shadow-glow-sm"
                    : "border-[var(--border-color)] hover:border-brand-mint/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-brand-bright bg-brand-forest/30 px-2.5 py-1 rounded-lg border border-brand-mint/30">
                      {pr.ref}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isDelayed ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {pr.status}
                    </span>
                    {isHero && (
                      <span className="text-[10px] font-extrabold uppercase bg-brand-emerald text-dark-bg px-2 py-0.5 rounded-full shadow-sm">
                        Hero Contract
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono block">Contract Amount</span>
                    <strong className="text-base font-black text-brand-mint font-mono">৳{pr.contract_amount_cr} Cr</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-2">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      {pr.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Contractor: <strong className="text-[var(--text-primary)]">{pr.contractor}</strong> &bull; Category: {pr.category}
                    </p>
                    <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs space-y-1">
                      <span className="font-bold text-[var(--text-primary)] block">Audit Review Observations:</span>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {pr.neutral_notes}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Target Milestone:</span>
                      <span className="font-bold text-[var(--text-primary)]">{pr.critical_milestone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Planned Date:</span>
                      <span className="text-brand-mint">{pr.milestone_planned_date?.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Delay Duration:</span>
                      <span className={pr.delay_duration_months > 0 ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {pr.delay_duration_months > 0 ? `+${pr.delay_duration_months} Months` : "On Schedule"}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Project Link:</span>
                      <span className="text-[10px] text-brand-bright font-bold truncate max-w-[150px]">{pr.project_name}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Link to Signal */}
                {isHero && (
                  <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-amber-400 flex items-center gap-1 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Correlated with Signal SIG-GOV-2026-001 (Waste Degradation)</span>
                    </span>
                    <Link
                      href="/signals/sig-gov-2026-001"
                      className="text-xs font-bold text-brand-mint hover:underline flex items-center gap-1"
                    >
                      <span>View Correlated Signal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
