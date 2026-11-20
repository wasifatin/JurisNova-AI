"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  MapPin,
  Layers,
  Activity,
  AlertTriangle,
  Building2,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  FileText,
  Scale,
  Users,
  ShieldAlert,
  Info
} from "lucide-react";

export default function GovernanceTwinPage() {
  const { language, t } = useLanguage();
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<string>("ward-12"); // Default to hero Ward 12
  const [wardSnapshot, setWardSnapshot] = useState<any | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>("signals"); // complaints, performance, projects, procurement, signals
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadWards = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/governance/twin/wards");
        setWards(data || []);
      } catch (err) {
        console.error("Failed to load twin wards:", err);
      } finally {
        setLoading(false);
      }
    };
    loadWards();
  }, []);

  useEffect(() => {
    if (!selectedWardId) return;
    const loadSnapshot = async () => {
      try {
        const snap = await apiFetch(`/governance/twin/wards/${selectedWardId}`);
        setWardSnapshot(snap);
      } catch (err) {
        console.error("Failed to load snapshot for ward:", selectedWardId, err);
      }
    };
    loadSnapshot();
  }, [selectedWardId]);

  const selectedWard = wards.find((w) => w.id === selectedWardId) || wards[11];

  const getWardColor = (w: any) => {
    if (activeLayer === "signals") {
      if (w.active_signals_count >= 2) return "fill-red-500/25 stroke-red-500 hover:fill-red-500/40";
      if (w.active_signals_count === 1) return "fill-amber-500/20 stroke-amber-500 hover:fill-amber-500/35";
      return "fill-emerald-500/15 stroke-emerald-500/40 hover:fill-emerald-500/30";
    }
    if (activeLayer === "complaints") {
      if (w.complaint_growth_delta >= 25) return "fill-red-500/30 stroke-red-500";
      if (w.complaint_growth_delta > 5) return "fill-amber-500/25 stroke-amber-500";
      return "fill-emerald-500/15 stroke-emerald-500/40";
    }
    if (activeLayer === "performance") {
      if (w.service_performance_delta <= -10) return "fill-red-500/30 stroke-red-500";
      if (w.service_performance_delta < 0) return "fill-amber-500/20 stroke-amber-500";
      return "fill-emerald-500/20 stroke-brand-bright";
    }
    if (activeLayer === "projects") {
      if (w.delayed_projects_count >= 2) return "fill-orange-500/25 stroke-orange-500";
      return "fill-emerald-500/15 stroke-emerald-500/40";
    }
    return "fill-[var(--bg-elevated)] stroke-[var(--border-color)]";
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-slide-up">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                <MapPin className="w-5 h-5 text-brand-bright" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {language === "bn" ? "ঢাকা সিটি সুশাসন ডিজিটাল টুইন" : "Dhaka Municipal Governance Twin"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === "bn"
                    ? "১২টি ওয়ার্ডের ইন্টারেক্টিভ পরিচালনা প্ল্যাটফর্ম • নাগরিক অভিযোগ, প্রকল্প অগ্রগতি ও চুক্তি পর্যালোচনা"
                    : "12-Ward Interactive Operational Surface • Cross-correlating Citizen Grievances, Project Progress & Procurement Milestones"}
                </p>
              </div>
            </div>
          </div>

          {/* Layer Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] overflow-x-auto">
            {[
              { id: "signals", label: "Signals", icon: Activity },
              { id: "complaints", label: "Complaints", icon: Users },
              { id: "performance", label: "Performance", icon: TrendingUp },
              { id: "projects", label: "Projects", icon: Layers },
              { id: "procurement", label: "Procurement", icon: Scale },
            ].map((layer) => {
              const Icon = layer.icon;
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-brand-emerald text-dark-bg font-bold shadow-glow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Synthetic Data Disclaimer Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-forest/15 border border-brand-mint/30 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-brand-mint shrink-0" />
          <span>
            <strong>SYNTHETIC SERVICE-AREA VISUALIZATION:</strong> This map represents an illustrative, stylized Dhaka service-area layout created for the GovernanceIQ challenge. Boundaries and service datasets are synthetic models and do not represent official administrative GIS borders or actual citizen grievances.
          </span>
        </div>

        {/* Main Twin Grid: Map (Left 7 Cols) + Snapshot Slide-Over (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive SVG Dhaka Service Area Map */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel hemla-card space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-mint" />
                <span>Active Layer: {activeLayer.toUpperCase()} MAP VIEW</span>
              </h2>
              <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                Click any Ward cell to inspect
              </span>
            </div>

            {/* Stylized SVG Map */}
            <div className="relative w-full aspect-[4/3] bg-dark-bg/60 rounded-xl border border-[var(--border-color)]/60 p-4 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 520 380" className="w-full h-full select-none">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(134,250,175,0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="520" height="380" fill="url(#grid)" />

                {/* Draw 12 Ward Polygonal Grid Tiles */}
                {wards.map((w) => {
                  const x = w.coordinates?.x || ((w.ward_number - 1) % 4) * 115 + 25;
                  const y = w.coordinates?.y || Math.floor((w.ward_number - 1) / 4) * 105 + 25;
                  const isSelected = selectedWardId === w.id;
                  const isHero = w.ward_number === 12;

                  return (
                    <g
                      key={w.id}
                      onClick={() => setSelectedWardId(w.id)}
                      className="cursor-pointer group transition-all duration-300"
                    >
                      <rect
                        x={x}
                        y={y}
                        width="100"
                        height="85"
                        rx="12"
                        className={`transition-all duration-200 ${getWardColor(w)} ${
                          isSelected ? "stroke-brand-bright stroke-[2.5px] shadow-glow-sm" : "stroke-1"
                        }`}
                      />

                      {/* Ward Number Tag */}
                      <text
                        x={x + 12}
                        y={y + 24}
                        className="text-[12px] font-mono font-bold fill-[var(--text-primary)]"
                      >
                        W-{w.ward_number}
                      </text>

                      {/* Status indicator pill */}
                      {w.is_anomaly_ward && (
                        <circle cx={x + 85} cy={y + 18} r="4" className="fill-red-500 animate-pulse" />
                      )}

                      {/* Ward Subtext */}
                      <text
                        x={x + 12}
                        y={y + 45}
                        className="text-[9px] font-sans fill-[var(--text-secondary)] opacity-90"
                      >
                        Health: {w.health_score}
                      </text>

                      <text
                        x={x + 12}
                        y={y + 62}
                        className={`text-[9px] font-mono font-semibold ${
                          w.complaint_growth_delta > 10 ? "fill-red-400" : "fill-brand-mint"
                        }`}
                      >
                        {w.complaint_growth_delta > 0 ? `+${w.complaint_growth_delta}%` : `${w.complaint_growth_delta}%`} cmp
                      </text>

                      {isHero && (
                        <text
                          x={x + 12}
                          y={y + 76}
                          className="text-[8px] font-mono font-bold fill-brand-bright"
                        >
                          &bull; HERO FOCUS
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-500/80" /> Critical Anomaly (W2, W5, W8, W12)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/80" /> Review Required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/80" /> Operational Baseline
              </span>
            </div>
          </div>

          {/* Right Slide-Over Panel: Ward Snapshot */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel hemla-card space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-mint uppercase tracking-wider">
                  Ward Governance Snapshot
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {selectedWard?.name || "Ward 12 - Mirpur South & Kafrul"}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)]">
                Zone: {selectedWard?.geographic_zone?.split(" ")[0]}
              </span>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-secondary)]">Governance Health</span>
                <p className={`text-2xl font-black mt-0.5 ${
                  (selectedWard?.health_score || 0) < 70 ? "text-amber-400" : "text-brand-bright"
                }`}>
                  {selectedWard?.health_score || 67}
                </p>
                <span className="text-[9px] text-[var(--text-secondary)] font-mono">out of 100</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-secondary)]">Service Performance</span>
                <p className="text-2xl font-black text-red-400 mt-0.5">
                  {selectedWard?.service_performance_delta > 0 ? `+${selectedWard?.service_performance_delta}%` : `${selectedWard?.service_performance_delta || -11}%`}
                </p>
                <span className="text-[9px] text-red-400 font-mono flex items-center justify-center gap-0.5">
                  <TrendingDown className="w-3 h-3" /> Service Drop
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-secondary)]">Waste Complaints Growth</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5">
                  +{selectedWard?.complaint_growth_delta || 28}%
                </p>
                <span className="text-[9px] text-amber-400 font-mono">Vs Q3 Baseline</span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-secondary)]">Delayed Projects</span>
                <p className="text-2xl font-black text-[var(--text-primary)] mt-0.5">
                  {selectedWard?.delayed_projects_count || 2}
                </p>
                <span className="text-[9px] text-[var(--text-secondary)] font-mono">Requiring Review</span>
              </div>
            </div>

            {/* Active Governance Signals for this Ward */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-mint" />
                  <span>Active Governance Signals ({wardSnapshot?.signals?.length || selectedWard?.active_signals_count || 3})</span>
                </span>
              </div>

              {(wardSnapshot?.signals || [
                {
                  id: "sig-gov-2026-001",
                  signal_code: "SIG-GOV-2026-001",
                  title: "Waste Collection Service Degradation",
                  severity: "High",
                  risk_score: 74,
                  ai_confidence: 87
                }
              ]).map((sig: any) => (
                <Link
                  key={sig.id}
                  href={`/signals/${sig.id}`}
                  className="p-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)]/80 border border-brand-mint/30 hover:border-brand-mint flex items-center justify-between gap-2 text-xs transition-all block group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-brand-bright">
                        {sig.signal_code}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                        Score: {sig.risk_score}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-forest/30 text-brand-mint">
                        Conf: {sig.ai_confidence}%
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-brand-bright transition-colors line-clamp-1">
                      {sig.title}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-mint group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              ))}
            </div>

            {/* Related Delayed Projects */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-mint" />
                <span>Associated Capital Projects</span>
              </span>
              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">Waste Management Service Improvement</span>
                  <span className="text-[10px] font-mono text-red-400 font-bold">Delayed</span>
                </div>
                <div className="w-full bg-dark-bg/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "54%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <span>Planned: 80%</span>
                  <span>Actual: 54% (Variance: -26 pp)</span>
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <Link
              href="/signals/sig-gov-2026-001"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-mint to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all text-center"
            >
              <Activity className="w-4 h-4" />
              <span>Inspect Correlated Hero Signal &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
