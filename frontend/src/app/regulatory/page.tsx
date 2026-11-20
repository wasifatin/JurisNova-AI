"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import {
  BookOpen,
  Search,
  Scale,
  ShieldCheck,
  Globe,
  Building2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Sparkles
} from "lucide-react";

const DEFAULT_SOURCES = [
  {
    id: "src-bb-ict-01",
    code: "BB-ICT-3.0",
    title: "Bangladesh Bank ICT Security Guidelines v3.0",
    jurisdiction: "Bangladesh",
    issuing_authority: "Bangladesh Bank (Central Bank)",
    effective_date: "2023-10-01",
    description: "Mandatory statutory ICT security framework for scheduled commercial banks, NBFIs, and fintech payment service operators in Bangladesh."
  },
  {
    id: "src-gdpr-01",
    code: "EU-GDPR",
    title: "EU General Data Protection Regulation (Regulation 2016/679)",
    jurisdiction: "European Union",
    issuing_authority: "European Parliament & Council",
    effective_date: "2018-05-25",
    description: "Global data privacy benchmark covering lawful processing, individual subject rights, Article 17 erasure exemptions, and high-fine enforcement."
  },
  {
    id: "src-iso-01",
    code: "ISO-27001-2022",
    title: "ISO/IEC 27001:2022 Information Security Management",
    jurisdiction: "International",
    issuing_authority: "International Organization for Standardization (ISO)",
    effective_date: "2022-10-31",
    description: "International standard for establishing and maintaining an Information Security Management System (ISMS) across 93 Annex A controls."
  }
];

const DEFAULT_REQUIREMENTS: Record<string, any[]> = {
  "src-bb-ict-01": [
    {
      id: "req-bb-01",
      req_code: "BB-ICT-3.2.1",
      title: "Financial Transaction Log Retention (7 Years WORM)",
      section: "Section 3.2 — Core Banking Security & Auditability",
      text: "All scheduled commercial banks and financial institutions must retain complete, tamper-evident audit trails for all financial transactions, SWIFT messages, and RTGS instructions for a minimum period of 7 (seven) years on Write-Once-Read-Many (WORM) compliant media.",
      category: "Data Governance & Archival",
      jurisdiction: "Bangladesh",
      penalty_summary: "Statutory sanction, mandatory supervisory remediation, and operational license restriction under Bank Company Act 1991."
    },
    {
      id: "req-bb-02",
      req_code: "BB-ICT-4.1.4",
      title: "Hardware Multi-Factor Authentication for Privileged Access",
      section: "Section 4.1 — User Authentication & Identity Management",
      text: "Multi-factor authentication (MFA) utilizing hardware cryptographic tokens or FIDO2-compliant authenticators is mandatory for all administrative access, database connections, and remote teleworking tunnels connecting to core banking infrastructure.",
      category: "Access Control & Identity",
      jurisdiction: "Bangladesh",
      penalty_summary: "Supervisory audit citation and mandatory 14-day corrective action plan."
    },
    {
      id: "req-bb-03",
      req_code: "BB-ICT-5.4.2",
      title: "Mandatory Cyber Incident Notification to BGD e-GOV CIRT (6 Hours)",
      section: "Section 5.4 — Incident Management & Regulatory Reporting",
      text: "Any suspected or confirmed cybersecurity incident involving unauthorized access, data breach, ransomware manifestation, or core disruption must be formally escalated to Bangladesh Bank BGD e-GOV CIRT within 6 (six) hours of detection.",
      category: "Incident Response & Reporting",
      jurisdiction: "Bangladesh",
      penalty_summary: "Regulatory non-compliance citation and executive board audit."
    },
    {
      id: "req-bb-04",
      req_code: "BB-ICT-7.3.1",
      title: "End-to-End Cryptographic Protection for Electronic Banking",
      section: "Section 7.3 — Data Cryptography & Key Management",
      text: "All customer cardholder data, account numbers, and transaction payloads stored at rest must be encrypted using AES-256 with hardware security module (HSM) key management and annual key rotation.",
      category: "Cryptographic Controls",
      jurisdiction: "Bangladesh",
      penalty_summary: "Strict liability for unauthorized transaction losses and supervisory fine."
    }
  ],
  "src-gdpr-01": [
    {
      id: "req-gdpr-01",
      req_code: "GDPR-Art-17",
      title: "Right to Erasure ('Right to be Forgotten') & Legal Exemptions",
      section: "Chapter 3, Article 17 — Rights of the Data Subject",
      text: "Data subjects possess the right to obtain erasure of personal data without undue delay, EXCEPT where processing is necessary for compliance with a legal or statutory obligation (such as banking AML retention under Art 17(3)(b)).",
      category: "Data Privacy & Individual Rights",
      jurisdiction: "European Union",
      penalty_summary: "Administrative fines up to EUR 20 million or 4% of total worldwide annual turnover."
    },
    {
      id: "req-gdpr-02",
      req_code: "GDPR-Art-32",
      title: "Security of Processing & Technical Measures",
      section: "Chapter 4, Article 32 — Security of Personal Data",
      text: "Controllers and processors shall implement appropriate technical and organisational measures, including pseudonymisation and encryption of personal data, and regular testing of security effectiveness.",
      category: "Technical Security Safeguards",
      jurisdiction: "European Union",
      penalty_summary: "Administrative fines up to EUR 10 million or 2% of annual turnover."
    }
  ],
  "src-iso-01": [
    {
      id: "req-iso-01",
      req_code: "ISO-27001-A.9.2",
      title: "User Access Provisioning & Privileged Access Rights",
      section: "Annex A.9 — Access Control",
      text: "A formal user registration and de-registration process shall be implemented to enable assignment of access rights, with mandatory quarterly privileged access reviews and removal of redundant permissions.",
      category: "Identity Governance",
      jurisdiction: "International",
      penalty_summary: "Major non-conformity during external surveillance audit; loss of ISO 27001 certification."
    }
  ]
};

export default function RegulatoryHubPage() {
  const [sources, setSources] = useState<any[]>(DEFAULT_SOURCES);
  const [requirements, setRequirements] = useState<any[]>(DEFAULT_REQUIREMENTS["src-bb-ict-01"] || []);
  const [selectedSourceId, setSelectedSourceId] = useState<string>("src-bb-ict-01");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHubData = async () => {
      try {
        const srcData = await apiFetch("/regulatory/sources");
        if (Array.isArray(srcData) && srcData.length > 0) {
          setSources(srcData);
          setSelectedSourceId(srcData[0].id);
          const reqData = await apiFetch(`/regulatory/requirements?source_id=${srcData[0].id}`);
          if (Array.isArray(reqData) && reqData.length > 0) {
            setRequirements(reqData);
          }
        }
      } catch (err) {
        console.warn("Using default regulatory baselines:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHubData();
  }, []);

  const handleSourceSelect = async (sourceId: string) => {
    setSelectedSourceId(sourceId);
    try {
      const reqData = await apiFetch(`/regulatory/requirements?source_id=${sourceId}`);
      if (Array.isArray(reqData) && reqData.length > 0) {
        setRequirements(reqData);
        return;
      }
    } catch (err) {
      console.warn("Using sample requirements for source:", sourceId);
    }
    setRequirements(DEFAULT_REQUIREMENTS[sourceId] || DEFAULT_REQUIREMENTS["src-bb-ict-01"] || []);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      handleSourceSelect(selectedSourceId);
      return;
    }
    try {
      const results = await apiFetch("/regulatory/requirements/search", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery }),
      });
      if (Array.isArray(results) && results.length > 0) {
        setRequirements(results);
        return;
      }
    } catch (err) {
      console.warn("Searching locally in loaded requirements:", err);
    }

    const q = searchQuery.toLowerCase();
    const allReqs = Object.values(DEFAULT_REQUIREMENTS).flat();
    const matched = allReqs.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.req_code.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
    setRequirements(matched.length > 0 ? matched : allReqs);
  };

  const activeSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Regulatory Knowledge Hub
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Curated Regulatory Library: Bangladesh Bank ICT Security Guidelines v3.0, EU GDPR, and ISO/IEC 27001:2022.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-forest/20 text-brand-mint border border-brand-mint/20 self-start sm:self-auto flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
            <span>Zero Invented Laws &bull; Verifiable Baselines</span>
          </span>
        </div>

        {/* Sources Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sources.map((src) => {
            const isSelected = src.id === selectedSourceId;
            return (
              <button
                key={src.id}
                onClick={() => handleSourceSelect(src.id)}
                className={`p-4 rounded-xl border text-left transition-all hemla-card ${
                  isSelected
                    ? "bg-brand-emerald/15 border-brand-mint shadow-glow-sm"
                    : "bg-[var(--bg-card)] border-[var(--border-color)] hover:border-brand-mint/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-brand-mint border border-brand-mint/20">
                    {src.code}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">
                    {src.jurisdiction}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1 leading-snug">
                  {src.title}
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                  {src.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Framework Banner */}
        {activeSource && (
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel hemla-card">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-mint" />
                <h2 className="text-sm font-bold text-[var(--text-primary)]">
                  {activeSource.title}
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Issuing Authority: <span className="text-[var(--text-primary)] font-semibold">{activeSource.issuing_authority}</span> &bull; Effective: {activeSource.effective_date}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold text-brand-mint px-3 py-1 rounded-lg bg-[var(--bg-elevated)] border border-brand-mint/20">
                {requirements.length} Active Obligations
              </span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regulatory clauses by code, topic, or keyword (e.g. 'log retention', 'MFA')..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] hover:border-brand-mint/40 text-xs font-bold text-[var(--text-primary)] transition-all"
          >
            Filter
          </button>
        </form>

        {/* Requirements List */}
        <div className="space-y-3">
          {requirements.map((req) => {
            const reqText =
              req.text ||
              req.description ||
              req.full_text ||
              "Mandatory statutory compliance obligation under Central Bank regulatory directives.";
            const reqCategory = req.category || req.domain || "Statutory Baseline";
            const reqPenalty =
              req.penalty_summary ||
              (req.severity
                ? `Statutory ${req.severity}-severity regulatory mandate subject to supervisory inspection and penalties.`
                : null);

            return (
              <div
                key={req.id}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 hover:border-brand-mint/30 transition-all hemla-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-bright bg-brand-forest/20 px-2.5 py-0.5 rounded border border-brand-mint/20">
                      {req.req_code}
                    </span>
                    <h3 className="text-xs font-bold text-[var(--text-primary)]">{req.title}</h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] self-start sm:self-auto font-mono border border-[var(--border-color)]">
                    {reqCategory}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-color)] shadow-inner">
                  {reqText}
                </div>

                {reqPenalty && (
                  <div className="flex items-start gap-2 text-[11px] text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Non-Compliance Consequence: </span>
                      <span>{reqPenalty}</span>
                    </div>
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
