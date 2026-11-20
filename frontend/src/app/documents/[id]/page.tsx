"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  Layers,
  Database,
  Hash,
  Clock,
  CheckCircle2,
  Bookmark,
  Sparkles
} from "lucide-react";
import { DEFAULT_SAMPLE_DOCUMENTS } from "@/lib/sampleData";

const SAMPLE_CHUNKS: Record<string, any[]> = {
  "doc-sample-01": [
    {
      id: "chk-01",
      chunk_index: 1,
      page_number: 14,
      token_count: 248,
      section_title: "Section 3.2.1 — Financial Transaction Log Archival & Integrity",
      content:
        "All scheduled commercial banks and financial institutions operating in Bangladesh must retain complete, tamper-evident audit trails for all financial transactions, SWIFT message transmissions, RTGS instructions, and core banking system events for a minimum period of 7 (seven) years. Archival must reside on Write-Once-Read-Many (WORM) compliant storage with cryptographic validation."
    },
    {
      id: "chk-02",
      chunk_index: 2,
      page_number: 22,
      token_count: 210,
      section_title: "Section 4.1.4 — Multi-Factor Authentication for Privileged Access",
      content:
        "Multi-factor authentication (MFA) utilizing hardware cryptographic tokens or FIDO2-compliant physical authenticators is mandatory for all administrative access, console sessions, database connections, and remote teleworking tunnels connecting to core banking or payment infrastructure."
    },
    {
      id: "chk-03",
      chunk_index: 3,
      page_number: 37,
      token_count: 195,
      section_title: "Section 5.4.2 — Mandatory Cyber Incident Reporting & Notification",
      content:
        "Any suspected or confirmed cybersecurity incident involving unauthorized access, data breach, ransomware manifestation, or distributed denial-of-service affecting core banking operations must be formally escalated to Bangladesh Bank BGD e-GOV CIRT within 6 (six) hours of initial detection."
    }
  ],
  "doc-sample-02": [
    {
      id: "chk-04",
      chunk_index: 1,
      page_number: 4,
      token_count: 180,
      section_title: "Policy Clause 2.1 — Retention Schedule for Core Ledger Records",
      content:
        "Customer accounts, general ledger journals, and balance histories must be retained in online active storage for 180 days, after which automated lifecycle policies shall transfer immutable snapshots to S3 Glacier Vault Lock in compliance mode for an additional 6.5 years."
    },
    {
      id: "chk-05",
      chunk_index: 2,
      page_number: 9,
      token_count: 165,
      section_title: "Policy Clause 4.3 — Cryptographic Hashing of Audit Registers",
      content:
        "Daily transaction journal digests must be cryptographically hashed using SHA-256 and anchored in the enterprise tamper-evident log ledger to facilitate independent regulatory review and compliance verification."
    }
  ]
};

export default function DocumentDetailsPage() {
  const params = useParams();
  const docId = params.id as string;
  const [doc, setDoc] = useState<any>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [docData, chunkData] = await Promise.all([
          apiFetch(`/documents/${docId}`),
          apiFetch(`/documents/${docId}/chunks`),
        ]);
        if (docData && docData.id) {
          setDoc(docData);
          setChunks(Array.isArray(chunkData) && chunkData.length > 0 ? chunkData : (SAMPLE_CHUNKS[docId] || []));
          return;
        }
      } catch (err) {
        console.warn("Using sample document chunks:", err);
      }

      // Fallback for sample documents
      const matched = DEFAULT_SAMPLE_DOCUMENTS.find((d) => d.id === docId) || DEFAULT_SAMPLE_DOCUMENTS[0];
      setDoc(matched);
      setChunks(SAMPLE_CHUNKS[docId] || SAMPLE_CHUNKS["doc-sample-01"] || []);
      setLoading(false);
    };

    if (docId) loadDetails();
  }, [docId]);

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 text-xs text-brand-mint hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Document Library</span>
        </Link>

        {doc && (
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-4 hemla-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-mint font-mono">
                  Document ID: {doc.id}
                </span>
                <h1 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
                  {doc.title}
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  File: {doc.file_name} &bull; {Math.round((doc.file_size || 1048576) / 1024)} KB &bull; Status:{" "}
                  <span className="text-brand-bright font-bold uppercase">{doc.status || "INDEXED"}</span>
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-forest/30 text-brand-mint border border-brand-mint/30 self-start sm:self-auto">
                {doc.category}
              </span>
            </div>
          </div>
        )}

        {/* Chunks List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-mint" />
              <span>Extracted Semantic Chunks ({chunks.length})</span>
            </h2>
            <span className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
              <span>Dimension: 384-dim Dense Normalized Embeddings</span>
            </span>
          </div>

          {chunks.map((chunk) => (
            <div
              key={chunk.id}
              className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 hemla-card"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-bright">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Chunk #{chunk.chunk_index}</span>
                  <span className="text-[var(--text-secondary)]">&bull;</span>
                  <span className="text-[var(--text-primary)]">Page {chunk.page_number}</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded">
                  ~{chunk.token_count} Tokens
                </span>
              </div>

              <div>
                <p className="text-[11px] font-bold text-brand-mint mb-1">
                  {chunk.section_title || "General Section"}
                </p>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-elevated)] p-3.5 rounded-lg border border-[var(--border-color)]">
                  {chunk.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
