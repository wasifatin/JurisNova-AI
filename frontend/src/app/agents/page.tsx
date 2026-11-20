"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import {
  Bot,
  Layers,
  Network,
  ShieldCheck,
  FileText,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function AgentsActivityPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRuns = async () => {
      try {
        const data = await apiFetch("/agents/runs");
        setRuns(data);
        if (data.length > 0) {
          const firstRun = await apiFetch(`/agents/runs/${data[0].id}`);
          setSelectedRun(firstRun);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadRuns();
  }, []);

  const handleSelectRun = async (runId: string) => {
    try {
      const run = await apiFetch(`/agents/runs/${runId}`);
      setSelectedRun(run);
    } catch (e) {
      console.error(e);
    }
  };

  const agentsList = [
    { name: "Document Intelligence Agent", role: "Extraction & Section Preservation", icon: FileText },
    { name: "Regulatory Research Agent", role: "Obligation Traverser & Scope Finder", icon: BookOpen },
    { name: "Control Mapping Agent", role: "Gap Identifier & Alignment Classifier", icon: Network },
    { name: "Risk Assessment Agent", role: "1-5 Likelihood x Impact Calculator", icon: BarChart3 },
    { name: "Remediation Agent", role: "Corrective Action & SLA Planner", icon: Layers },
    { name: "Independent Verification Agent", role: "Adversarial Citation & Anti-Hallucination", icon: ShieldCheck },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Multi-Agent Architecture & Execution Traces
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              LangGraph State Orchestrator • 6 Autonomous Collaborative Agents • Observable Thoughts & Actions.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-forest/20 text-brand-mint border border-brand-mint/20 self-start sm:self-auto">
            LangGraph StateGraph Engine
          </span>
        </div>

        {/* 1. Agent Network Roster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agentsList.map((ag, i) => {
            const Icon = ag.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-forest/20 text-brand-mint flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand-bright" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{ag.name}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)]">{ag.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Run History & Trace Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Runs Sidebar */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-mint flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-bright" />
              <span>Execution Runs ({runs.length})</span>
            </h2>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {runs.map((r) => {
                const isSelected = selectedRun?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRun(r.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-brand-emerald/15 border-brand-mint shadow-sm"
                        : "bg-[var(--bg-elevated)] border-[var(--border-color)] hover:border-brand-mint/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-brand-mint">
                        {r.status}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                        {r.latency_ms}ms
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {r.workflow_name}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                      Verification: {Math.round(r.verification_score * 100)}%
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trace Detail View */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
            {selectedRun ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {selectedRun.workflow_name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      ID: {selectedRun.id} • Latency: {selectedRun.latency_ms}ms
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-brand-mint bg-brand-forest/30 px-2.5 py-1 rounded-full border border-brand-mint/30">
                      Evidentiary Score: {Math.round(selectedRun.verification_score * 100)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {(selectedRun.messages || []).map((msg: any) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-brand-bright flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          {msg.agent_name}
                        </span>
                        <span className="font-mono text-[10px] uppercase text-[var(--text-secondary)] bg-[var(--bg-card)] px-2 py-0.5 rounded">
                          {msg.message_type} • Step #{msg.step_order}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-xs text-[var(--text-secondary)]">
                Select an execution run to inspect its step-by-step trace.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
