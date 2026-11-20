"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { ShieldCheck, ArrowRight, Lock, Mail, User, Building2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("");
  const [role, setRole] = useState<string>("Compliance Officer");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          organization_name: orgName,
          system_role: role,
        }),
      });

      if (res.access_token) {
        localStorage.setItem("jurisnova_token", res.access_token);
        localStorage.setItem("jurisnova_user", JSON.stringify(res.user));
        sessionStorage.setItem("jurisnova_show_intro", "true");
        setUser(res.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-bright/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-card-subtle relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <Image
              src="/logo.jpg"
              alt="JurisNova AI"
              width={44}
              height={44}
              className="rounded-xl shadow-glow-sm"
            />
            <span className="font-bold text-lg text-[var(--text-primary)]">
              Juris<span className="text-brand-bright">Nova</span> AI
            </span>
          </Link>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Register Organization</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Create an isolated governance environment for your enterprise.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Tariq Rahman"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@company.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Organization Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Financial Services"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Initial System Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="Compliance Officer">Compliance Officer</option>
              <option value="Organization Administrator">Organization Administrator</option>
              <option value="Risk Analyst">Risk Analyst</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Registering..." : "Create Workspace"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-[var(--text-secondary)]">
          <span>Already have an account? </span>
          <Link href="/login" className="text-brand-mint hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
