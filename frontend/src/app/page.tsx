"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  SearchCode,
  ArrowRight,
  Bot,
  Database,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileCheck,
  FileText,
  BookOpen,
  Lock,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  BarChart3,
  Network,
  Languages
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const isBn = language === "bn";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors selection:bg-brand-emerald selection:text-dark-bg">
      {/* 1. Navigation Header */}
      <nav className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="JurisNova AI Logo"
              width={40}
              height={40}
              className="rounded-xl shadow-glow-sm object-cover"
              priority
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight font-sans">
                  Juris<span className="text-brand-bright">Nova</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-forest/30 text-brand-mint border border-brand-mint/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] tracking-wider uppercase font-semibold">
                GovernanceIQ 2026
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-xs font-medium text-[var(--text-secondary)]">
            <a href="#problem" className="hover:text-brand-mint transition-colors">
              {isBn ? "সমস্যা ও চ্যালেঞ্জ" : "Problem"}
            </a>
            <a href="#agents" className="hover:text-brand-mint transition-colors">
              {isBn ? "মাল্টি-এজেন্ট ইঞ্জিন" : "Multi-Agent Engine"}
            </a>
            <a href="#rag" className="hover:text-brand-mint transition-colors">
              {isBn ? "প্রমাণভিত্তিক আরএজি" : "Evidence RAG"}
            </a>
            <a href="#workflow" className="hover:text-brand-mint transition-colors">
              {isBn ? "তদন্ত ব্যবস্থা" : "Investigation"}
            </a>
            <Link href="/audits" className="hover:text-brand-mint transition-colors">
              {isBn ? "অডিট ও প্রতিবেদন" : "Audit & Reports"}
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Switch Language / ভাষা পরিবর্তন করুন"
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

            <Link
              href="/login"
              className="btn-hard-turkey px-3.5 sm:px-4 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)]/80 border border-[var(--border-color)] text-xs font-semibold transition-all"
            >
              <span>{isBn ? "প্রবেশ করুন" : "Sign In"}</span>
            </Link>

            <Link
              href="/compliance/analyze"
              className="btn-hard-turkey hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all"
            >
              <span>{isBn ? "প্ল্যাটফর্ম অন্বেষণ" : "Explore Platform"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-24 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-brand-bright/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Brand Logo Showcase */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3.5 p-2 pr-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] shadow-glow-sm hover:scale-[1.02] transition-all">
              <Image
                src="/logo.jpg"
                alt="JurisNova AI Logo"
                width={50}
                height={50}
                className="rounded-xl shadow-sm object-cover"
                priority
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[var(--text-primary)]">
                    Juris<span className="text-brand-bright">Nova</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-forest/30 text-brand-mint border border-brand-mint/20">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-brand-mint font-medium tracking-wide">
                  {isBn ? "ন্যায়বিচার • বুদ্ধিমত্তা • ভবিষ্যৎ" : "Justice • Intelligence • Future"}
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest/20 border border-brand-mint/20 text-brand-mint text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-bright" />
            <span>
              {isBn
                ? "এআই বিল্ডার্স ওয়ার্ল্ড কংগ্রেস ২০২৬ • চ্যালেঞ্জ: গভর্ন্যান্সআইকিউ"
                : "AI Builders World Congress 2026 • Challenge: GovernanceIQ"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6">
            {isBn ? (
              <>
                সুশাসনে অনুমানের <br className="hidden sm:inline" />
                <span className="text-gradient">কোনো স্থান নেই।</span>
              </>
            ) : (
              <>
                Governance deserves <br className="hidden sm:inline" />
                <span className="text-gradient">more than guesswork.</span>
              </>
            )}
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed mb-10">
            {isBn
              ? "জুরিসনোভা এআই-এর মাধ্যমে জটিল নিয়ন্ত্রক বিধিনিষেধকে প্রমাণ-সমর্থিত সুশাসন বুদ্ধিমত্তায় রূপান্তর করুন। নীতিমালার বাস্তবায়ন যাচাই, ঝুঁকি মূল্যায়ন এবং মানব-পর্যবেক্ষিত প্রতিকার কর্মপরিকল্পনা তৈরি করুন।"
              : "Transform complex regulations into evidence-backed compliance intelligence with JurisNova AI. Interpret mandates, benchmark internal policies, score operational risks, and formulate human-verifiable corrective actions."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link
              href="/compliance/analyze"
              className="btn-hard-turkey flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-bold text-sm shadow-glow-md transition-all"
            >
              <SearchCode className="w-4 h-4" />
              <span>{isBn ? "বুদ্ধিমত্তা অন্বেষণ করুন" : "Explore Intelligence"}</span>
            </Link>

            <Link
              href="/dashboard"
              className="btn-hard-turkey flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)]/80 border border-[var(--border-color)] text-sm font-semibold transition-all"
            >
              <span>{isBn ? "ড্যাশবোর্ডে প্রবেশ করুন" : "Sign In to Dashboard"}</span>
              <ChevronRight className="w-4 h-4 text-brand-mint" />
            </Link>
          </div>

          {/* Platform Preview Card */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 shadow-card-subtle text-left max-w-5xl mx-auto glass-panel">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.jpg"
                  alt="JurisNova"
                  width={22}
                  height={22}
                  className="rounded-md shadow-sm"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 ml-1" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-brand-bright/80" />
                <span className="text-xs text-[var(--text-secondary)] font-mono ml-2 hidden sm:inline">
                  jurisnova://investigation-workspace/q4-audit
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-brand-mint bg-brand-forest/30 px-2.5 py-0.5 rounded-full border border-brand-mint/20">
                {isBn ? "ল্যাংগ্রাফ স্টেট যাচাইকৃত" : "LangGraph State Verified"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {isBn ? "বিধিমালা কাভারেজ" : "Mandate Coverage"}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-brand-bright" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">78.5%</div>
                <p className="text-[11px] text-brand-mint mt-1">
                  {isBn ? "বাংলাদেশ ব্যাংক আইসিটি গাইডলাইন ৩.০" : "Bangladesh Bank ICT Guidelines v3.0"}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {isBn ? "প্রমাণ সাইটেশন হার" : "Evidentiary Citation Rate"}
                  </span>
                  <FileCheck className="w-4 h-4 text-brand-mint" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">96.8%</div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {isBn ? "শূন্য অমূলক দাবি সহনশীলতা" : "Zero Hallucination Tolerance"}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {isBn ? "মানব পর্যালোচনা গেট" : "Human Review Gate"}
                  </span>
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {isBn ? "বাধ্যতামূলক" : "Enforced"}
                </div>
                <p className="text-[11px] text-amber-300 mt-1">
                  {isBn ? "এআই প্রস্তাব করে • মানুষ অনুমোদন দেয়" : "AI Proposes • Humans Authorize"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Governance Problem */}
      <section id="problem" className="py-16 sm:py-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-mint">
              {isBn ? "শিল্পের চ্যালেঞ্জ" : "Industry Challenge"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold mt-2 mb-3">
              {isBn ? "চিরাচরিত জিআরসি ব্যবস্থা কেন ব্যর্থ হয়" : "Why Modern GRC Systems Fail"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {isBn
                ? "গতানুগতিক অনুপালন ব্যবস্থা বিচ্ছিন্ন স্প্রেডশীট, ফাইল এবং সাধারণ জেনেরিক চ্যাটবটের উপর নির্ভর করে যা অমূলক আইন উদ্ভাবনে প্ররোচিত হয়।"
                : "Traditional compliance relies on disconnected spreadsheets, fragmented PDF policies, and generic LLM chatbots prone to legal hallucination."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">
                {isBn ? "অমূলক তথ্য ও বিভ্রান্তি" : "Unanchored Hallucinations"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isBn
                  ? "সাধারণ চ্যাটবট কাল্পনিক আইন ও ধারা তৈরি করে। নিয়ন্ত্রক পরিদর্শনে একটি ভুল ধারা বিশাল জরিমানা ডেকে আনে।"
                  : "Standard chatbots invent legal statutes and section references. In compliance, a fabricated clause can trigger catastrophic audit penalties."}
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">
                {isBn ? "কাগুজে অনুপালনের বিভ্রান্তি" : "Paper Compliance Illusion"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isBn
                  ? "কেবলমাত্র নথিপত্র থাকা বাস্তবায়ন নির্দেশ করে না। প্রকৃত অনুপালনের জন্য প্রমাণ-ভিত্তিক ব্যবস্থার যাচাই আবশ্যক।"
                  : "Having a 40-page security document is not operational implementation. Real compliance requires verifying controls against tangible system evidence."}
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hemla-card">
              <div className="w-10 h-10 rounded-xl bg-brand-forest/20 text-brand-mint flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">
                {isBn ? "অনিয়ন্ত্রিত স্বয়ংক্রিয়তার ঝুঁকি" : "Autonomous Action Risk"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isBn
                  ? "এআই এজেন্টদের কখনই মানুষের তদারকি ছাড়া স্বাধীনভাবে অনুমোদন দেওয়ার ক্ষমতা দেওয়া উচিত নয়।"
                  : "AI agents should never independently approve their own remediation findings without human compliance officer verification and sign-off."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Multi-Agent AI Architecture */}
      <section id="agents" className="py-16 sm:py-20 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-mint">
              {isBn ? "ল্যাংগ্রাফ সমন্বয়" : "LangGraph Orchestration"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold mt-2 mb-3">
              {isBn ? "৬টি বিশেষায়িত এআই এজেন্ট একক দলের ন্যায় কর্মরত" : "6 Specialized AI Agents Working As One"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {isBn
                ? "জুরিসনোভা এআই শেয়ার্ড স্টেট ও শর্তযুক্ত রাউটিংয়ের মাধ্যমে প্রমাণভিত্তিক সিদ্ধান্ত নিশ্চিত করে।"
                : "JurisNova AI uses genuine multi-agent orchestration with typed shared state, adversarial verification, and conditional routing."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                title: isBn ? "১. ডকুমেন্ট ইন্টেলিজেন্স এজেন্ট" : "1. Document Intelligence Agent",
                desc: isBn
                  ? "পিডিএফ, ডকএক্স ফাইল বিশ্লেষণ করে সুনির্দিষ্ট পৃষ্ঠা এবং অনুচ্ছেদ রেফারেন্স সংরক্ষণ করে।"
                  : "Parses PDF, DOCX, and TXT files. Extracts clauses and preserves exact page and section references.",
                icon: FileText
              },
              {
                title: isBn ? "২. নিয়ন্ত্রক গবেষণা এজেন্ট" : "2. Regulatory Research Agent",
                desc: isBn
                  ? "বাংলাদেশ ব্যাংক আইসিটি এবং বৈশ্বিক মানদণ্ড থেকে বাধ্যতামূলক দায়বদ্ধতা পুনরুদ্ধার করে।"
                  : "Traverses Bangladesh Bank ICT and global standards. Retrieves legally binding obligations and effective dates.",
                icon: BookOpen
              },
              {
                title: isBn ? "৩. কন্ট্রোল ম্যাপিং এজেন্ট" : "3. Control Mapping Agent",
                desc: isBn
                  ? "অভ্যন্তরীণ নিয়ন্ত্রণের সাথে বিধিমালা তুলনা করে ব্যবধান চিহ্নিত করে।"
                  : "Compares mandates against internal controls. Classifies into Implemented, Partial, Missing, or Not Verifiable.",
                icon: Network
              },
              {
                title: isBn ? "৪. ঝুঁকি মূল্যায়ন এজেন্ট" : "4. Risk Assessment Agent",
                desc: isBn
                  ? "১-৫ ম্যাট্রিক্সে সম্ভাব্যতা ও প্রভাব হিসাব করে স্বচ্ছ এআই ব্যাখ্যা প্রদান করে।"
                  : "Calculates Likelihood x Impact on 1-5 matrix. Provides transparent AI rationales behind every score.",
                icon: BarChart3
              },
              {
                title: isBn ? "৫. প্রতিকার এজেন্ট" : "5. Remediation Agent",
                desc: isBn
                  ? "বিভাগীয় দায়িত্ব ও এসএলএ সহ বাস্তবসম্মত সংশোধনমূলক পদক্ষেপ তৈরি করে।"
                  : "Formulates corrective actions with departmental assignments, SLAs, and completion evidence requirements.",
                icon: Layers
              },
              {
                title: isBn ? "৬. স্বাধীন যাচাইকরণ এজেন্ট" : "6. Independent Verification Agent",
                desc: isBn
                  ? "উদ্ধৃতিসমূহ পুনরায় পরীক্ষা করে ভিত্তিহীন দাবি প্রতিরোধ করে।"
                  : "Adversarially validates citations, detects unsupported claims, and flags potential hallucinations before human review.",
                icon: ShieldCheck
              },
            ].map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div key={i} className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-mint/30 transition-all hemla-card">
                  <div className="w-8 h-8 rounded-lg bg-brand-forest/20 text-brand-mint flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-brand-bright" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold mb-1.5">{agent.title}</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">{agent.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Call to Action & Footer */}
      <section className="py-16 sm:py-20 border-t border-[var(--border-color)] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex justify-center mb-5">
            <Image
              src="/logo.jpg"
              alt="JurisNova AI Logo"
              width={56}
              height={56}
              className="rounded-2xl shadow-glow-md object-cover border border-brand-mint/30"
            />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold mb-3">
            {isBn ? (
              <>
                সুশাসন বুদ্ধিমত্তার <span className="text-gradient">ভবিষ্যতে পদার্পণ করুন।</span>
              </>
            ) : (
              <>
                Step Into The Future of <span className="text-gradient">Governance Intelligence.</span>
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto mb-7">
            {isBn
              ? "বাস্তব ডকুমেন্ট আপলোড, লাইভ আরএজি রিট্রিভাল এবং মানব-অনুমোদিত ওয়ার্কফ্লো সহ সম্পূর্ণ মাল্টি-এজেন্ট প্রোটোটাইপ ব্যবহার করুন।"
              : "Experience the full multi-agent prototype with real document uploads, live RAG retrieval, automated gap detection, and human approval workflows."}
          </p>

          <Link
            href="/dashboard"
            className="btn-hard-turkey inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-extrabold text-sm shadow-glow-md transition-all"
          >
            <span>{isBn ? "জুরিসনোভা এআই প্ল্যাটফর্মে প্রবেশ করুন" : "Enter JurisNova AI Platform"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-8 text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="JurisNova AI"
              width={26}
              height={26}
              className="rounded-lg shadow-sm object-cover"
            />
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-bold text-[var(--text-primary)]">JurisNova AI</span>
              <span>— {isBn ? "সুশাসন গোয়েন্দা • অনুপালন স্বচ্ছতা • বিশ্বস্ত সিদ্ধান্ত" : "Governance Intelligence. Compliance Clarity. Trusted Decisions."}</span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[11px]">
            <Link href="/dashboard" className="hover:text-brand-mint">
              {isBn ? "নির্বাহী ড্যাশবোর্ড" : "Executive Dashboard"}
            </Link>
            <Link href="/compliance/analyze" className="hover:text-brand-mint">
              {isBn ? "তদন্ত গবেষণাগার" : "Investigation Lab"}
            </Link>
            <Link href="/audits" className="hover:text-brand-mint">
              {isBn ? "পিডিএফ অডিট" : "PDF Reports"}
            </Link>
            <span>AI Builders 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
