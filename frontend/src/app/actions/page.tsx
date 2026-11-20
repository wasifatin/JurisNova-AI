"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import AnimatedCheckbox from "@/components/AnimatedCheckbox";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Building2,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
  PlusCircle,
  FileText
} from "lucide-react";

export default function GovernanceActionCenterPage() {
  const { language, t } = useLanguage();
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [activeInv, setActiveInv] = useState<any | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadInvestigations = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/governance/actions");
      setInvestigations(data || []);
      if (data && data.length > 0 && !activeInv) {
        setActiveInv(data[0]);
      }
    } catch (err) {
      console.error("Failed to load investigations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestigations();
  }, []);

  const handleStatusChange = async (invId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const res = await apiFetch(`/governance/actions/${invId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      setActiveInv(res.investigation);
      loadInvestigations();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChecklistToggle = async (chkId: string) => {
    if (!activeInv) return;
    const updatedChecklist = (activeInv.checklist || []).map((c: any) =>
      c.id === chkId ? { ...c, completed: !c.completed, verified_by: !c.completed ? "Md. Tanvir Hossain" : null } : c
    );
    try {
      setIsUpdating(true);
      const res = await apiFetch(`/governance/actions/${activeInv.id}`, {
        method: "PATCH",
        body: JSON.stringify({ checklist: updatedChecklist })
      });
      setActiveInv(res.investigation);
      loadInvestigations();
    } catch (err: any) {
      alert("Failed to update checklist: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeInv) return;
    try {
      setIsUpdating(true);
      const res = await apiFetch(`/governance/actions/${activeInv.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          comment: commentText.trim(),
          author: "Md. Tanvir Hossain",
          role: "Super Administrator"
        })
      });
      setActiveInv(res.investigation);
      setCommentText("");
      loadInvestigations();
    } catch (err: any) {
      alert("Failed to add comment: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApproveStep = async () => {
    if (!activeInv) return;
    try {
      setIsUpdating(true);
      const res = await apiFetch(`/governance/actions/${activeInv.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          approval: {
            step: `Supervisory Review (${activeInv.status})`,
            by: "Md. Tanvir Hossain (Super Administrator)",
            status: "Approved"
          }
        })
      });
      setActiveInv(res.investigation);
      loadInvestigations();
    } catch (err: any) {
      alert("Failed to submit approval: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = investigations.filter((inv) => {
    return selectedStatus === "ALL" || inv.status === selectedStatus;
  });

  const statuses = ["New", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                <ClipboardCheck className="w-5 h-5 text-brand-bright" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {language === "bn" ? "সুশাসন তদন্ত ও প্রতিকার কেন্দ্র" : "Governance Investigation & Action Center"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === "bn"
                    ? "অডিটযোগ্য মামলা ট্র্যাকিং, প্রতিকার চেকলিস্ট ও সুপারভাইজারি অনুমোদন"
                    : "Auditable Case Tracking, Remediation Checklists & Human-in-the-Loop Supervisory Sign-offs"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-mint bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
              {investigations.length} Active Cases Ingested
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["ALL", ...statuses].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? "bg-brand-emerald text-dark-bg font-bold shadow-glow-sm"
                  : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Main Layout: Cases List (Left 5 Cols) + Active Case Inspector (Right 7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cases Column */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map((inv) => {
              const isSelected = activeInv?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setActiveInv(inv)}
                  className={`p-5 rounded-2xl bg-[var(--bg-card)] border transition-all hemla-card space-y-3 cursor-pointer ${
                    isSelected
                      ? "border-brand-mint/50 shadow-glow-sm bg-[var(--bg-elevated)]/60"
                      : "border-[var(--border-color)] hover:border-brand-mint/30"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                    <span className="font-mono text-xs font-bold text-brand-bright">
                      {inv.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === "Closed" || inv.status === "Resolved"
                        ? "bg-emerald-500/20 text-brand-mint"
                        : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                      {inv.title}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
                      Signal: <span className="text-brand-mint">{inv.signal_code}</span> &bull; Dept: {inv.department}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                    <span>Assigned: <strong className="text-[var(--text-primary)]">{inv.assigned_to}</strong></span>
                    <span>Due: {inv.due_date?.split("T")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Case Workspace */}
          {activeInv ? (
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-5 hemla-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-bright">
                    Case Code: {activeInv.code}
                  </span>
                  <h2 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                    {activeInv.title}
                  </h2>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">Status:</span>
                  <select
                    value={activeInv.status}
                    disabled={isUpdating}
                    onChange={(e) => handleStatusChange(activeInv.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-brand-mint/40 text-xs font-bold text-brand-mint"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Case Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Assigned Inspector</span>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5">{activeInv.assigned_to}</p>
                  <span className="text-[9px] text-brand-mint">{activeInv.assigned_role}</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Responsible Department</span>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5 truncate">{activeInv.department}</p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Linked Wards</span>
                  <p className="font-bold text-brand-bright mt-0.5">{(activeInv.wards || []).join(", ")}</p>
                </div>
              </div>

              {/* Completion Criteria */}
              {activeInv.completion_criteria && (
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
                  <span className="text-[10px] font-bold text-brand-mint uppercase font-mono block">
                    Completion &amp; Remediation Criteria:
                  </span>
                  <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap font-sans leading-relaxed">
                    {activeInv.completion_criteria}
                  </pre>
                </div>
              )}

              {/* Interactive Verification Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-mint" />
                    <span>{language === "bn" ? "তদন্তমূলক পদক্ষেপ চেকলিস্ট" : "Investigative Action Checklist"}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {language === "bn" ? "যাচাই করতে ক্লিক করুন" : "Click to verify"}
                  </span>
                </div>

                <div className="space-y-2">
                  {(activeInv.checklist || []).map((chk: any) => (
                    <div
                      key={chk.id}
                      onClick={() => handleChecklistToggle(chk.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-all ${
                        chk.completed
                          ? "bg-brand-forest/20 border-brand-mint/40 text-brand-mint"
                          : "bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-brand-mint/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AnimatedCheckbox
                          checked={chk.completed}
                          onChange={() => handleChecklistToggle(chk.id)}
                        />
                        <span className={chk.completed ? "line-through opacity-80" : "font-medium"}>
                          {chk.label}
                        </span>
                      </div>
                      {chk.verified_by && (
                        <span className="text-[9px] font-mono text-brand-bright whitespace-nowrap">
                          {language === "bn" ? `যাচাইকারী: ${chk.verified_by}` : `Signed by ${chk.verified_by}`}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Supervisory Approval Section */}
              <div className="p-4 rounded-xl bg-brand-forest/15 border border-brand-mint/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-bright" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {language === "bn" ? "তত্ত্বাবধায়ক অনুমোদন ইতিহাস" : "Human Supervisory Sign-Off History"}
                    </span>
                  </div>
                  <button
                    onClick={handleApproveStep}
                    disabled={isUpdating}
                    className="btn-hard-turkey px-3.5 py-2 rounded-xl bg-brand-emerald text-dark-bg text-xs font-bold shadow-glow-sm hover:opacity-95 transition-all flex items-center gap-1.5"
                  >
                    <span>{language === "bn" ? "বর্তমান ধাপ অনুমোদন করুন" : "Approve Current Step"}</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(activeInv.approval_history || []).map((app: any, idx: number) => (
                    <div
                      key={idx}
                      className="text-[11px] font-mono flex items-center justify-between text-[var(--text-secondary)] border-b border-[var(--border-color)]/50 pb-1 last:border-0"
                    >
                      <span>{app.step} &bull; Signed by <strong className="text-[var(--text-primary)]">{app.approved_by}</strong></span>
                      <span className="text-brand-bright font-bold">{app.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments & Audit Log Trail */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[var(--text-primary)] block">
                  Inspector Review Log ({activeInv.comments?.length || 0})
                </span>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {(activeInv.comments || []).map((c: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                        <strong className="text-brand-mint">{c.author} ({c.role})</strong>
                        <span>{new Date(c.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[var(--text-primary)] text-xs mt-0.5">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter supervisory observation or audit note..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
                  />
                  <button
                    type="submit"
                    disabled={isUpdating || !commentText.trim()}
                    className="p-2 rounded-xl bg-brand-emerald text-dark-bg font-bold disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 py-20 text-center text-xs text-[var(--text-secondary)] font-mono">
              Select an investigation case to view action items.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
