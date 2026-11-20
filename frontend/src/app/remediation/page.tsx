"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from "lucide-react";

const DEFAULT_REMEDIATION_TASKS = [
  {
    id: "rem-001",
    title: "Implement 7-Year Transaction Log Immutable WORM Archival",
    description:
      "Configure AWS S3 Glacier Vault Lock in compliance mode with Write-Once-Read-Many (WORM) retention for all core banking SWIFT and RTGS transaction logs per BB ICT Guideline Sec 3.2.1.",
    priority: "High",
    assigned_to: "Fatin Sharhad (Compliance Officer)",
    due_date: "Nov 28, 2026 (5 Days)",
    status: "In Progress",
    approval_status: "Approved",
    approved_by: "Md. Tanvir Hossain (Super Admin)"
  },
  {
    id: "rem-002",
    title: "Deploy FIDO2 Hardware Tokens for Core Banking Admin Console",
    description:
      "Enforce WebAuthn / FIDO2 physical cryptographic keys across 100% of sysadmin and database bastion consoles to satisfy ISO 27001 Control A.9.4.",
    priority: "Critical",
    assigned_to: "Tahmid Islam (Risk Analyst)",
    due_date: "Dec 04, 2026 (9 Days)",
    status: "Approved",
    approval_status: "Approved",
    approved_by: "Muskan Meheg (Lead Auditor)"
  },
  {
    id: "rem-003",
    title: "Automate Quarterly Dormant User Deprovisioning Certification",
    description:
      "Deploy automated cron trigger connecting Okta/Active Directory to suspend accounts with > 30 days inactivity and notify compliance leads.",
    priority: "Moderate",
    assigned_to: "Muskan Meheg (Lead Auditor)",
    due_date: "Dec 15, 2026 (14 Days)",
    status: "Proposed Action",
    approval_status: "Pending Review",
    approved_by: null
  },
  {
    id: "rem-004",
    title: "BGD e-GOV CIRT Incident Escalation 6-Hour SLA Runbook Update",
    description:
      "Synchronize incident notification runbook Section 3.2 to establish immediate automated paging to the designated CIRT liaison within 6 hours of severity classification.",
    priority: "High",
    assigned_to: "Md. Tanvir Hossain (Super Admin)",
    due_date: "Completed",
    status: "Completed",
    approval_status: "Approved",
    approved_by: "Fatin Sharhad (Compliance Officer)",
    completion_evidence: "Runbook v2.1 published to wiki; automated webhook ping verified on 2026-11-19."
  }
];

export default function RemediationManagementPage() {
  const [tasks, setTasks] = useState<any[]>(DEFAULT_REMEDIATION_TASKS);
  const [filter, setFilter] = useState<string>("ALL");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDesc, setNewTaskDesc] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] = useState<string>("High");
  const [newTaskAssigned, setNewTaskAssigned] = useState<string>("Fatin Sharhad");
  const [evidenceInput, setEvidenceInput] = useState<{ [id: string]: string }>({});

  const loadTasks = async () => {
    try {
      const data = await apiFetch("/remediation/tasks");
      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
      }
    } catch (e) {
      console.warn("Using sample remediation tasks:", e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      assigned_to: newTaskAssigned,
      due_date: "30 Days",
      status: "Proposed Action",
      approval_status: "Pending Review",
      approved_by: null
    };

    try {
      await apiFetch("/remediation/tasks", {
        method: "POST",
        body: JSON.stringify(newTask),
      });
      loadTasks();
    } catch (err: any) {
      // Local fallback
      setTasks((prev) => [newTask, ...prev]);
    } finally {
      setShowCreateModal(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
    }
  };

  const handleApproveAction = async (taskId: string, action: string) => {
    try {
      await apiFetch(`/remediation/tasks/${taskId}/approve`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      loadTasks();
    } catch (err: any) {
      // Local state update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                approval_status: action,
                status: action === "Approved" ? "Approved" : "Rejected",
                approved_by: "Fatin Sharhad (Compliance Officer)"
              }
            : t
        )
      );
    }
  };

  const handleSubmitEvidence = async (taskId: string) => {
    const evText = evidenceInput[taskId];
    if (!evText || !evText.trim()) {
      alert("Please provide completion evidence notes or URL.");
      return;
    }

    try {
      await apiFetch(`/remediation/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "Completed",
          completion_evidence: evText,
        }),
      });
      loadTasks();
    } catch (err: any) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "Completed", completion_evidence: evText } : t
        )
      );
    }
  };

  const filteredTasks = tasks.filter(
    (t) => filter === "ALL" || t.status === filter || t.priority === filter
  );

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Remediation Action Management
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Workflow: Identified Gap &rarr; Proposed Action &rarr; Human Review &rarr; Approved &rarr; Assigned &rarr; In Progress &rarr; Completed &rarr; Verified.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-mint to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Remediation Task</span>
          </button>
        </div>

        {/* Governance Banner */}
        <div className="p-4 rounded-xl bg-brand-forest/15 border border-brand-mint/20 flex items-center justify-between text-xs text-brand-mint">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-brand-bright" />
            <span>AI Governance Rule Enforced: AI proposes corrective actions; Human Officers must authorize execution.</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-forest/30">
            RBAC Verified
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["ALL", "Proposed Action", "Approved", "In Progress", "Completed", "Critical"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === st
                  ? "bg-brand-emerald text-dark-bg font-bold shadow-glow-sm"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4 hemla-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">{task.title}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Assigned: <span className="text-brand-mint font-semibold">{task.assigned_to}</span> &bull; Due: {task.due_date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                      task.priority === "Critical"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-brand-forest/20 text-brand-mint border border-brand-mint/20"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] font-mono">
                    Status: {task.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border-color)]">
                {task.description}
              </p>

              {/* Completion Evidence if present */}
              {task.completion_evidence && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs">
                  <span className="text-[10px] font-bold text-brand-bright uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submitted Completion Evidence:
                  </span>
                  <p className="text-[var(--text-primary)] mt-1 font-mono text-[11px]">
                    {task.completion_evidence}
                  </p>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--border-color)] text-xs">
                <span className="text-[var(--text-secondary)]">
                  Human Approval:{" "}
                  <span className="font-bold text-brand-mint">{task.approval_status}</span>
                  {task.approved_by && ` (${task.approved_by})`}
                </span>

                <div className="flex items-center gap-2">
                  {task.approval_status === "Pending Review" && (
                    <>
                      <button
                        onClick={() => handleApproveAction(task.id, "Approved")}
                        className="px-3 py-1.5 rounded-lg bg-brand-emerald text-dark-bg hover:opacity-90 font-bold text-xs"
                      >
                        Authorize Action
                      </button>
                      <button
                        onClick={() => handleApproveAction(task.id, "Rejected")}
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-red-500/20 text-red-400 border border-[var(--border-color)] text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {task.status !== "Completed" && task.approval_status === "Approved" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Log completion evidence hash or PR..."
                        value={evidenceInput[task.id] || ""}
                        onChange={(e) =>
                          setEvidenceInput({ ...evidenceInput, [task.id]: e.target.value })
                        }
                        className="px-2.5 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
                      />
                      <button
                        onClick={() => handleSubmitEvidence(task.id)}
                        className="px-3 py-1 rounded bg-brand-forest/30 hover:bg-brand-forest/50 border border-brand-mint/30 text-brand-mint text-xs font-semibold whitespace-nowrap"
                      >
                        Verify &amp; Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-slide-up">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-card-subtle space-y-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Create Proposed Remediation Task
              </h2>
              <form onSubmit={handleCreateTask} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Enforce Hardware MFA on Core Switches"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Description &amp; Remediation Plan
                  </label>
                  <textarea
                    rows={3}
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Specific technical steps required to close the compliance gap..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Priority
                    </label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Assignee
                    </label>
                    <input
                      type="text"
                      value={newTaskAssigned}
                      onChange={(e) => setNewTaskAssigned(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-mint to-brand-emerald text-dark-bg font-bold text-xs"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
