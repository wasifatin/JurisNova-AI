"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Bot, Layers, Sparkles } from "lucide-react";
import { AUDIT_SCAN_STEPS, ScanStep } from "@/lib/exportAuditPdf";

interface AuditScannerModalProps {
  isOpen: boolean;
  currentStepIndex: number;
}

export default function AuditScannerModal({ isOpen, currentStepIndex }: AuditScannerModalProps) {
  if (!isOpen) return null;

  const progressPct = Math.min(100, Math.round(((currentStepIndex + 1) / AUDIT_SCAN_STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-slide-up">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--bg-card)] border border-brand-mint/40 shadow-glow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-forest/20 text-brand-mint flex items-center justify-center shrink-0 border border-brand-mint/30 animate-pulse">
            <ShieldCheck className="w-6 h-6 text-brand-bright" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Autonomous Governance Scanner
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-forest/30 text-brand-mint border border-brand-mint/30">
                ACTIVE AUDIT
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Scanning live compliance controls & compiling executive PDF dossier...
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--text-secondary)]">Data Ingestion & Verification</span>
            <span className="text-brand-bright font-bold">{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden border border-[var(--border-color)]">
            <div
              className="h-full bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-2.5 pt-2">
          {AUDIT_SCAN_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                  isCurrent
                    ? "bg-brand-emerald/10 border-brand-mint/50 shadow-sm"
                    : isDone
                    ? "bg-[var(--bg-elevated)] border-brand-mint/20 opacity-80"
                    : "bg-[var(--bg-elevated)]/40 border-transparent opacity-40"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-brand-bright" />
                  ) : isCurrent ? (
                    <span className="w-4 h-4 rounded-full border-2 border-brand-mint border-t-transparent animate-spin block" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-[var(--border-color)] block" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold ${isCurrent ? "text-brand-bright" : "text-[var(--text-primary)]"}`}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] text-center">
          <p className="text-[10px] text-[var(--text-secondary)] flex items-center justify-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
            <span>Cryptographic SHA-256 evidence chain verification in progress</span>
          </p>
        </div>
      </div>
    </div>
  );
}
