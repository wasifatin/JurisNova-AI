"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  MapPin,
  Scale,
  X,
  FileText,
  TrendingDown,
  Info
} from "lucide-react";

export default function PublicProjectsPage() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectModal, setSelectedProjectModal] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/governance/projects");
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const openProjectDetail = async (prj: any) => {
    try {
      setModalLoading(true);
      const detail = await apiFetch(`/governance/projects/${prj.id}`);
      setSelectedProjectModal(detail);
    } catch (err) {
      console.error("Failed to fetch project detail:", err);
      setSelectedProjectModal({ project: prj, milestones: [], procurements: [], budgets: [] });
    } finally {
      setModalLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesDept = selectedDept === "ALL" || p.department_id === selectedDept;
    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.project_code.toLowerCase().includes(q) ||
      (p.department || "").toLowerCase().includes(q);
    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                <Layers className="w-5 h-5 text-brand-bright" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {language === "bn" ? "প্রকল্প বাস্তবায়ন ও অগ্রগতি বিশ্লেষণ" : "Project Performance Intelligence"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === "bn"
                    ? "২০টি সিটি প্রকল্পের বাস্তবায়ন ট্র্যাকিং • মাইলস্টোন যাচাই ও অগ্রগতি ব্যবধান অডিট"
                    : "Capital Execution Tracking Across 20 Municipal Projects • Milestone Verification & Variance Auditing"}
                </p>
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-brand-mint bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
            20 Capital Projects Tracked
          </span>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="On Schedule">On Schedule</option>
              <option value="Delayed">Delayed</option>
              <option value="In Progress">In Progress</option>
              <option value="Requires Review">Requires Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project name, code, dept..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((prj) => {
            const isHero = prj.project_code === "PRJ-2026-001";
            const isBudgetHero = prj.project_code === "PRJ-2026-005";
            const isDelayed = prj.status === "Delayed" || prj.status === "Requires Review";

            return (
              <div
                key={prj.id}
                onClick={() => openProjectDetail(prj)}
                className={`p-5 rounded-2xl bg-[var(--bg-card)] border transition-all hemla-card space-y-3 cursor-pointer ${
                  isHero
                    ? "border-brand-mint/50 shadow-glow-sm"
                    : isBudgetHero
                    ? "border-amber-500/40 shadow-sm"
                    : "border-[var(--border-color)] hover:border-brand-mint/30"
                }`}
              >
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-bright bg-brand-forest/30 px-2 py-0.5 rounded border border-brand-mint/20">
                      {prj.project_code}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                      {prj.department}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isDelayed ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}>
                    {prj.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                    {prj.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Wards: {(prj.ward_associations || []).join(", ") || "City-wide"}
                  </p>
                </div>

                {/* Progress Comparison Bars */}
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[var(--text-secondary)]">Physical Progress:</span>
                      <span>
                        <strong className={isDelayed ? "text-amber-400" : "text-brand-mint"}>
                          {prj.actual_physical_progress}%
                        </strong>
                        <span className="text-[var(--text-secondary)]"> / {prj.planned_physical_progress}% planned</span>
                      </span>
                    </div>
                    <div className="w-full bg-dark-bg/60 h-2 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isDelayed ? "bg-amber-500" : "bg-brand-emerald"
                        }`}
                        style={{ width: `${prj.actual_physical_progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Variance Callout */}
                  {prj.variance_label && (
                    <div className={`p-2 rounded-lg text-[10px] font-mono flex items-center justify-between ${
                      isDelayed ? "bg-red-500/10 text-red-300 border border-red-500/20" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                    }`}>
                      <span>{prj.variance_label}</span>
                      {prj.variance_gap > 0 && <span className="font-bold">Gap: -{prj.variance_gap} pp</span>}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                  <span>Approved: <strong className="text-[var(--text-primary)]">৳{prj.approved_budget_cr} Cr</strong></span>
                  <span>Financial: <strong className="text-brand-mint">{prj.financial_progress}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Detail Modal */}
        {selectedProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-slide-up">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-[var(--bg-card)] border border-brand-mint/40 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-bright">
                    {selectedProjectModal.project?.project_code}
                  </span>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    {selectedProjectModal.project?.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Core Stats */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono">Approved Budget</span>
                  <p className="text-base font-bold text-[var(--text-primary)] mt-0.5">৳{selectedProjectModal.project?.approved_budget_cr} Cr</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono">Planned Progress</span>
                  <p className="text-base font-bold text-brand-mint mt-0.5">{selectedProjectModal.project?.planned_physical_progress}%</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono">Actual Progress</span>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{selectedProjectModal.project?.actual_physical_progress}%</p>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--text-primary)]">Project Execution Milestones</h4>
                <div className="space-y-2">
                  {(selectedProjectModal.milestones || []).map((m: any) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{m.title}</p>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">Target: {m.target_date?.split("T")[0]}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        m.status === "Delayed" ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        {m.status} {m.delay_days > 0 ? `(+${m.delay_days}d)` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Procurements */}
              {selectedProjectModal.procurements && selectedProjectModal.procurements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">Linked Procurement Contracts</h4>
                  {selectedProjectModal.procurements.map((pr: any) => (
                    <div key={pr.id} className="p-3 rounded-xl bg-brand-forest/15 border border-brand-mint/30 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-brand-bright font-mono">{pr.ref} &bull; {pr.title}</strong>
                        <span className="font-mono text-amber-400 font-bold">৳{pr.contract_amount_cr} Cr</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">{pr.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
