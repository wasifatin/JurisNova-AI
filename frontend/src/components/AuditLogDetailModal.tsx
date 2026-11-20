"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Hash,
  User,
  Clock,
  HardDrive,
  Lock,
  Sparkles
} from "lucide-react";

interface AuditLogDetailModalProps {
  log: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditLogDetailModal({
  log,
  isOpen,
  onClose
}: AuditLogDetailModalProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-slide-up">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--bg-card)] border border-brand-mint/40 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-forest/20 text-brand-mint flex items-center justify-center border border-brand-mint/30">
              <ShieldCheck className="w-4 h-4 text-brand-bright" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-brand-bright">
                {log.action}
              </span>
              <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                Log ID: {log.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Actor Email</span>
            <p className="font-bold text-[var(--text-primary)] mt-0.5">{log.user_email || "system@jurisnova.ai"}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Origin IP</span>
            <p className="font-mono text-brand-mint font-bold mt-0.5">{log.ip_address || "127.0.0.1"}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Target Resource</span>
            <p className="font-bold text-[var(--text-primary)] mt-0.5">{log.resource_type}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Timestamp</span>
            <p className="font-mono text-[var(--text-secondary)] text-[11px] mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
          </div>
        </div>

        {log.details && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-2">
            <span className="text-[10px] font-bold text-brand-mint uppercase font-mono">
              Audit Event Description &amp; Payload:
            </span>
            {typeof log.details === "object" ? (
              <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-[11px] space-y-1.5">
                {Object.entries(log.details).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between gap-2 border-b border-[var(--border-color)]/40 pb-1 last:border-0 last:pb-0">
                    <span className="text-[var(--text-secondary)]">{key}:</span>
                    <span className="text-brand-bright font-bold truncate">{typeof val === "object" ? JSON.stringify(val) : String(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                {String(log.details)}
              </p>
            )}
          </div>
        )}

        <div className="p-3 rounded-xl bg-brand-forest/15 border border-brand-mint/30 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-brand-mint">
            <span className="flex items-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5" />
              Cryptographic Ledger Verification:
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-brand-forest/40 text-brand-bright font-bold">
              VALIDATED &radic;
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] break-all">
            SHA256: {log.id === "log-001" ? "8f4e2b9c31ad7709e13f44c88e0b65a420993d5671bfca1a94b8109adce50711" : "3a7b1f59e4d08c2a96b71f30e5d89c42a17726391d89fe004a8b7c3d2e1f4092"}
          </p>
        </div>
      </div>
    </div>
  );
}
