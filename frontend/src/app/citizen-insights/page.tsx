"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  Users,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function CitizenInsightsPage() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(
          `/governance/citizen-insights?category=${selectedCategory}&status=${selectedStatus}&page=${page}&limit=15`
        );
        setData(res);
      } catch (err) {
        console.error("Failed to load citizen insights:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInsights();
  }, [selectedCategory, selectedStatus, page]);

  const categoryPieData = [
    { name: "Waste Collection", value: 620, color: "#30ED7B" },
    { name: "Road Condition", value: 380, color: "#F59E0B" },
    { name: "Water Service", value: 290, color: "#06B6D4" },
    { name: "Street Lighting", value: 140, color: "#8B5CF6" },
    { name: "Other (Drainage/Misc)", value: 70, color: "#EC4899" },
  ];

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-forest/20 text-brand-mint border border-brand-mint/30">
                <Users className="w-5 h-5 text-brand-bright" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    {language === "bn" ? "নাগরিক সেবা ও অভিযোগ বিশ্লেষণ" : "Citizen & Service Delivery Insights"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {language === "bn"
                    ? "ঢাকা সিটির ১২টি ওয়ার্ডের ১,৫০০টি অভিযোগ ও সেবামানের সামগ্রিক বিশ্লেষণ"
                    : "Analytical Governance Surface • Aggregating 1,500 Synthetic Grievance Records Across 12 Dhaka Wards"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-mint bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
              1,500 Total Records Ingested
            </span>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 rounded-xl bg-brand-forest/15 border border-brand-mint/30 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-brand-mint shrink-0" />
          <span>
            <strong>PUBLIC SECTOR ANALYTICS MODULE:</strong> This is an internal decision-support analytics system for authorized municipal officials, not a public complaint submission portal. All records are anonymized synthetic representations.
          </span>
        </div>

        {/* AI Clustering Intelligence Panel (Hero Anomaly Scenario) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-forest/20 via-[var(--bg-card)] to-brand-emerald/10 border border-brand-mint/40 shadow-glow-sm space-y-4 hemla-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-bright" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                AI GEOGRAPHIC CLUSTERING INTELLIGENCE: 78% CONCENTRATION DETECTED
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-red-400 bg-red-500/15 px-2.5 py-0.5 rounded-full border border-red-500/30">
              Correlated Anomaly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Cluster Magnitude</span>
              <p className="text-2xl font-black text-brand-mint font-mono">484 / 620</p>
              <p className="text-[11px] text-[var(--text-secondary)]">78.1% of all waste grievances</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Affected Service Areas</span>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-1">Wards 2, 5, 8 &amp; 12</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Mirpur, Mohammadpur &amp; Khilgaon</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Resolution Duration SLA</span>
              <p className="text-2xl font-black text-amber-400 font-mono">+18%</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Average 4.2 days vs 3.2 days baseline</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">Linked Capital Project</span>
              <p className="text-xs font-bold text-brand-bright line-clamp-1 mt-1">PRJ-2026-001</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Waste Management Service Improvement</p>
            </div>
          </div>
        </div>

        {/* Charts Grid: Monthly Trends + Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Trends (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-4 hemla-card">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Monthly Grievance Ingestion by Service (Jun — Nov 2026)
              </h3>
              <span className="text-[11px] font-mono text-[var(--text-secondary)]">Time Series</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthly_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,250,175,0.06)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Bar dataKey="waste" name="Waste Collection" fill="#30ED7B" stackId="a" />
                  <Bar dataKey="road" name="Road Maintenance" fill="#F59E0B" stackId="a" />
                  <Bar dataKey="water" name="Water Service" fill="#06B6D4" stackId="a" />
                  <Bar dataKey="lighting" name="Street Lighting" fill="#8B5CF6" stackId="a" />
                  <Bar dataKey="other" name="Other" fill="#EC4899" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Donut (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-4 hemla-card">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Service Category Distribution (1,500 Total)
              </h3>
              <span className="text-[11px] font-mono text-[var(--text-secondary)]">Exact Breakdown</span>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Complaints Directory & Drill-Down Table */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] glass-panel space-y-4 hemla-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Anonymized Grievance Register ({data?.filtered_total || 0} Records)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Traceable source identifiers without personally identifiable information (PII).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              >
                <option value="ALL">All Categories</option>
                <option value="Waste Collection">Waste Collection (620)</option>
                <option value="Road Condition">Road Maintenance (380)</option>
                <option value="Water Service">Water Service (290)</option>
                <option value="Street Lighting">Street Lighting (140)</option>
                <option value="Other">Other / Drainage (70)</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="In Progress">In Progress</option>
                <option value="Open">Open</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Complaint Ref</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Ward</th>
                  <th className="py-2.5 px-3">Submission Date</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">SLA Days</th>
                  <th className="py-2.5 px-3">Anonymized Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] font-mono text-[11px]">
                {(data?.complaints || []).map((c: any) => (
                  <tr key={c.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    <td className="py-3 px-3 text-brand-bright font-bold">{c.ref}</td>
                    <td className="py-3 px-3 text-[var(--text-primary)]">{c.service}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">{c.ward}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">{c.submission_date?.split("T")[0]}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === "Critical" ? "bg-red-500/20 text-red-300" :
                        c.priority === "High" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.status === "Resolved" ? "bg-emerald-500/15 text-brand-mint" : "bg-amber-500/15 text-amber-400"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">{c.duration_days ? `${c.duration_days}d` : "--"}</td>
                    <td className="py-3 px-3 font-sans text-xs text-[var(--text-secondary)] max-w-xs truncate" title={c.description}>
                      {c.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
            <span>Showing page {page} of {Math.ceil((data?.filtered_total || 1) / 15)}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 15 >= (data?.filtered_total || 0)}
                className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
