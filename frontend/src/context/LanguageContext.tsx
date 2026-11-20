"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation Sections
    "nav.section_exec": "EXECUTIVE INTELLIGENCE",
    "nav.section_gov": "PUBLIC SECTOR GOVERNANCE",
    "nav.section_knowledge": "KNOWLEDGE & EVIDENCE",
    "nav.section_risk": "RISK & REMEDIATION",
    "nav.section_agents": "AI MULTI-AGENT ENGINE",
    "nav.section_audit": "AUDIT & GOVERNANCE",

    // Navigation Items
    "nav.dashboard": "Executive Dashboard",
    "nav.investigation_lab": "Investigation Lab",
    "nav.governance_twin": "Governance Twin",
    "nav.signals": "Governance Signals",
    "nav.citizen_insights": "Citizen Insights",
    "nav.projects": "Projects & Delivery",
    "nav.procurement": "Procurement Watch",
    "nav.budget": "Budget Intelligence",
    "nav.actions": "Action Center",
    "nav.reports": "Governance Briefs",
    "nav.documents": "Document Library",
    "nav.regulatory": "Regulatory Hub",
    "nav.findings": "Compliance Findings",
    "nav.risks": "Risk Intelligence",
    "nav.remediation": "Remediation Workflow",
    "nav.assistant": "Governance Assistant",
    "nav.agents": "Agent Activity Traces",
    "nav.audits": "Audit Trail & PDF",
    "nav.settings": "Organization Settings",

    // Header & Global
    "header.organization": "Dhaka City Services Authority",
    "header.jurisdiction": "Dhaka, Bangladesh",
    "header.run_investigation": "Run Investigation",
    "header.switch_theme": "Toggle Theme",
    "header.switch_language": "Switch Language",

    // Governance Health & Briefs
    "label.governance_health": "Governance Health",
    "label.readiness_indicator": "AI-assisted governance readiness indicator",
    "label.emerging_signal": "Emerging Signal",
    "label.recommended_action": "Recommended Action",
    "label.service_delivery": "Service Delivery",
    "label.citizen_satisfaction": "Citizen Satisfaction",
    "label.project_progress": "Project Performance",
    "label.procurement_performance": "Procurement Performance",
    "label.complaint_resolution": "Complaint Resolution",
    "label.budget_intelligence": "Budget Intelligence",
    "label.create_investigation": "Create Investigation",
    "label.investigation_created": "Investigation Created",
    "label.investigating": "Under Investigation",
    "label.resolved": "Resolved",
    "label.requires_review": "Requires Review",
    "label.high_priority": "High Priority",
    "label.medium_priority": "Medium Priority",
    "label.low_priority": "Low Priority",
    "label.ai_confidence": "AI Confidence",
    "label.risk_score": "Risk Score",
    "label.evidence": "Evidence",
    "label.affected_wards": "Affected Wards",
    "label.export_pdf": "Export Governance Brief PDF",
    "label.regenerate": "Regenerate Brief",
    "label.overview": "Overview",
    "label.key_findings": "Key Operational Finding",
    "label.connected_project": "Connected Capital Project",
    "label.connected_procurement": "Connected Procurement Tender",
    "label.citizen_grievances": "Citizen Grievances",
    "label.tracked_projects": "Tracked Projects",
    "label.procurement_tenders": "Procurement Tenders",
    "label.active_investigations": "Active Investigations",
    "label.methodology_weights": "Published Methodology Weights",
    "label.action_plan": "Recommended Management Priorities",
    "label.open_action_center": "Open Action Center",
    "label.view_signals": "View Interactive Signals",
    "label.search_placeholder": "Search by ward, project, or department...",
    "label.filter": "Filter",
    "label.all": "ALL",
  },
  bn: {
    // Navigation Sections
    "nav.section_exec": "নির্বাহী বুদ্ধিমত্তা",
    "nav.section_gov": "সরকারি সেবা ও সুশাসন",
    "nav.section_knowledge": "জ্ঞান ও প্রমাণাগার",
    "nav.section_risk": "ঝুঁকি ও প্রতিকার",
    "nav.section_agents": "এআই মাল্টি-এজেন্ট ইঞ্জিন",
    "nav.section_audit": "নিরীক্ষা ও পরিচালনা",

    // Navigation Items
    "nav.dashboard": "নির্বাহী ড্যাশবোর্ড",
    "nav.investigation_lab": "তদন্ত গবেষণাগার",
    "nav.governance_twin": "সুশাসন ডিজিটাল টুইন",
    "nav.signals": "সুশাসন সংকেত",
    "nav.citizen_insights": "নাগরিক সেবা বিশ্লেষণ",
    "nav.projects": "প্রকল্প ও বাস্তবায়ন",
    "nav.procurement": "ক্রয় ও চুক্তি নজরদারি",
    "nav.budget": "বাজেট বিশ্লেষণ",
    "nav.actions": "অ্যাকশন সেন্টার",
    "nav.reports": "নির্বাহী প্রতিবেদন",
    "nav.documents": "নথিপত্র ভান্ডার",
    "nav.regulatory": "নিয়ন্ত্রক হাব",
    "nav.findings": "অনুপালন ফলাফল",
    "nav.risks": "ঝুঁকি গোয়েন্দা",
    "nav.remediation": "প্রতিকার কর্মপ্রবাহ",
    "nav.assistant": "সুশাসন সহকারী",
    "nav.agents": "এজেন্ট ট্রেস হিস্ট্রি",
    "nav.audits": "অডিট ট্রেইল ও পিডিএফ",
    "nav.settings": "সংস্থা সেটিংস",

    // Header & Global
    "header.organization": "ঢাকা সিটি সার্ভিসেস অথরিটি",
    "header.jurisdiction": "ঢাকা, বাংলাদেশ",
    "header.run_investigation": "তদন্ত চালান",
    "header.switch_theme": "থিম পরিবর্তন",
    "header.switch_language": "ভাষা পরিবর্তন",

    // Governance Health & Briefs
    "label.governance_health": "সুশাসন সূচক",
    "label.readiness_indicator": "এআই-সহায়তাপ্রাপ্ত সুশাসন প্রস্তুতি নির্দেশক",
    "label.emerging_signal": "উদীয়মান সংকেত",
    "label.recommended_action": "প্রস্তাবিত পদক্ষেপ",
    "label.service_delivery": "সেবা প্রদান",
    "label.citizen_satisfaction": "নাগরিক সন্তুষ্টি",
    "label.project_progress": "প্রকল্পের অগ্রগতি",
    "label.procurement_performance": "ক্রয় ও চুক্তি কর্মক্ষমতা",
    "label.complaint_resolution": "অভিযোগ নিষ্পত্তি",
    "label.budget_intelligence": "বাজেট বিশ্লেষণ",
    "label.create_investigation": "তদন্ত শুরু করুন",
    "label.investigation_created": "তদন্ত সফলভাবে তৈরি হয়েছে",
    "label.investigating": "তদন্তাধীন",
    "label.resolved": "নিষ্পন্ন",
    "label.requires_review": "পর্যালোচনা প্রয়োজন",
    "label.high_priority": "উচ্চ অগ্রাধিকার",
    "label.medium_priority": "মাঝারি অগ্রাধিকার",
    "label.low_priority": "সাধারণ অগ্রাধিকার",
    "label.ai_confidence": "AI প্রমাণ নির্ভরতা",
    "label.risk_score": "ঝুঁকি সূচক",
    "label.evidence": "যাচাইকৃত প্রমাণ",
    "label.affected_wards": "প্রভাবিত ওয়ার্ডসমূহ",
    "label.export_pdf": "সুশাসন প্রতিবেদন PDF ডাউনলোড",
    "label.regenerate": "পুনরায় প্রস্তুত করুন",
    "label.overview": "সারসংক্ষেপ",
    "label.key_findings": "প্রধান পরিচালন ফলাফল",
    "label.connected_project": "সম্পর্কিত মূলধনী প্রকল্প",
    "label.connected_procurement": "সম্পর্কিত ক্রয় চুক্তি",
    "label.citizen_grievances": "নাগরিক অভিযোগ",
    "label.tracked_projects": "পর্যবেক্ষিত প্রকল্প",
    "label.procurement_tenders": "ক্রয় টেন্ডার",
    "label.active_investigations": "চলমান তদন্ত",
    "label.methodology_weights": "অনুমোদিত মূল্যায়ন অনুপাত",
    "label.action_plan": "প্রস্তাবিত ব্যবস্থাপনা অগ্রাধিকার",
    "label.open_action_center": "অ্যাকশন সেন্টার খুলুন",
    "label.view_signals": "সংকেত পর্যালোচনা করুন",
    "label.search_placeholder": "ওয়ার্ড, প্রকল্প বা বিভাগ দ্বারা অনুসন্ধান করুন...",
    "label.filter": "ফিল্টার",
    "label.all": "সব",
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("jurisnova_language") as Language | null;
    if (saved === "en" || saved === "bn") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("jurisnova_language", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "bn" : "en";
    setLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
