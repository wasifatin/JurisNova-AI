"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutDashboard,
  SearchCode,
  FileText,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  Bot,
  ShieldCheck,
  Settings,
  MapPin,
  Activity,
  Users,
  Layers,
  Scale,
  Wallet,
  ClipboardCheck,
  FileSpreadsheet,
  X
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const sections: NavSection[] = [
    {
      label: t("nav.section_exec"),
      items: [
        { title: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
        { title: t("nav.investigation_lab"), href: "/compliance/analyze", icon: SearchCode },
      ],
    },
    {
      label: t("nav.section_gov"),
      items: [
        { title: t("nav.governance_twin"), href: "/twin", icon: MapPin },
        { title: t("nav.signals"), href: "/signals", icon: Activity },
        { title: t("nav.citizen_insights"), href: "/citizen-insights", icon: Users },
        { title: t("nav.projects"), href: "/projects", icon: Layers },
        { title: t("nav.procurement"), href: "/procurement", icon: Scale },
        { title: t("nav.budget"), href: "/budget", icon: Wallet },
        { title: t("nav.actions"), href: "/actions", icon: ClipboardCheck },
        { title: t("nav.reports"), href: "/reports", icon: FileSpreadsheet },
      ],
    },
    {
      label: t("nav.section_knowledge"),
      items: [
        { title: t("nav.documents"), href: "/documents", icon: FileText },
        { title: t("nav.regulatory"), href: "/regulatory", icon: BookOpen },
        { title: t("nav.findings"), href: "/compliance/findings", icon: CheckCircle2 },
      ],
    },
    {
      label: t("nav.section_risk"),
      items: [
        { title: t("nav.risks"), href: "/risks", icon: AlertTriangle },
        { title: t("nav.remediation"), href: "/remediation", icon: ClipboardList },
      ],
    },
    {
      label: t("nav.section_agents"),
      items: [
        { title: t("nav.assistant"), href: "/assistant", icon: Sparkles },
        { title: t("nav.agents"), href: "/agents", icon: Bot },
      ],
    },
    {
      label: t("nav.section_audit"),
      items: [
        { title: t("nav.audits"), href: "/audits", icon: ShieldCheck },
        { title: t("nav.settings"), href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 h-full min-h-screen border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col justify-between shrink-0 transition-all select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/logo.jpg"
              alt="JurisNova AI"
              width={34}
              height={34}
              className="rounded-xl shadow-glow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[var(--text-primary)] font-sans">
                  Juris<span className="text-brand-bright">Nova</span>
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-forest/30 text-brand-mint border border-brand-mint/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] tracking-wider uppercase font-medium">
                GovernanceIQ 2026
              </p>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-3 space-y-5 overflow-y-auto max-h-[calc(100vh-125px)]">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-semibold tracking-wider text-[var(--text-secondary)] opacity-60 uppercase mb-1.5">
                {sec.label}
              </p>
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-brand-emerald/15 text-brand-mint border border-brand-mint/30 shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-brand-mint/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-brand-bright"
                            : "text-[var(--text-secondary)] group-hover:text-brand-mint"
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]/50">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-bright animate-pulse" />
            <span className="font-mono text-[10px]">v2.6 &bull; Online</span>
          </div>
          <span className="font-mono text-[9px] text-[var(--text-secondary)]">
            Dhaka DCSA
          </span>
        </div>
      </div>
    </aside>
  );
}
