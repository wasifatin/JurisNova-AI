"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sun,
  Moon,
  Building2,
  SearchCode,
  Languages,
  Menu
} from "lucide-react";

export default function Header({ onToggleMobileMenu }: { onToggleMobileMenu?: () => void }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Menu Toggle & Organization Context */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-brand-mint"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] max-w-[200px] sm:max-w-none truncate">
          <Building2 className="w-4 h-4 text-brand-mint shrink-0" />
          <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
            {user?.organization_name || t("header.organization")}
          </span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--border-color)] mx-1" />
          <span className="hidden sm:inline-block text-[10px] text-emerald-950 dark:text-brand-mint font-bold dark:font-medium bg-emerald-100 dark:bg-brand-forest/30 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-brand-mint/20 shrink-0">
            {t("header.jurisdiction")}
          </span>
        </div>
      </div>

      {/* Right: Actions, Language Switch, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher Button (EN | বাংলা) */}
        <button
          onClick={toggleLanguage}
          title={t("header.switch_language")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] hover:border-brand-mint/40 text-xs font-bold text-[var(--text-primary)] transition-all"
        >
          <Languages className="w-3.5 h-3.5 text-brand-mint" />
          <span className={language === "en" ? "text-brand-bright font-extrabold" : "text-[var(--text-secondary)]"}>
            EN
          </span>
          <span className="text-[var(--border-color)]">|</span>
          <span className={language === "bn" ? "text-brand-bright font-extrabold font-sans" : "text-[var(--text-secondary)] font-sans"}>
            বাংলা
          </span>
        </button>

        {/* Quick Launch CTA */}
        <Link
          href="/compliance/analyze"
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-semibold text-xs shadow-glow-sm hover:opacity-95 transition-all"
        >
          <SearchCode className="w-3.5 h-3.5" />
          <span>{t("header.run_investigation")}</span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={(e) => toggleTheme(e)}
          title={t("header.switch_theme")}
          className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-brand-mint transition-all"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-dark-bg" />
          )}
        </button>

        {/* User Profile & Role */}
        <div className="flex items-center gap-2.5 pl-1.5 sm:pl-2 border-l border-[var(--border-color)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-forest to-brand-bright flex items-center justify-center text-dark-bg font-bold text-xs shadow-sm">
            {user?.full_name ? user.full_name[0] : "T"}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold leading-tight text-[var(--text-primary)]">
              {user?.full_name || "Md. Tanvir Hossain"}
            </p>
            <p className="text-[10px] text-brand-mint font-medium leading-tight">
              {user?.system_role || "Super Administrator"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
