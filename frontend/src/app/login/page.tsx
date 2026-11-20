"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import IntroVideo from "@/components/IntroVideo";
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("fatinwasi321@jurisnova.ai");
  const [password, setPassword] = useState<string>("123456789");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // Immediately play clean intro video before transitioning to prototype dashboard
      setShowIntro(true);
    } catch (err: any) {
      setError(err.message || "Login failed. Check credentials.");
      setLoading(false);
    }
  };

  const setDemoRole = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);
    try {
      await login(demoEmail, demoPass);
      // Immediately play clean intro video before transitioning to prototype dashboard
      setShowIntro(true);
    } catch (err: any) {
      setError(err.message || "Login failed. Check credentials.");
      setLoading(false);
    }
  };

  return (
    <>
      {showIntro && (
        <IntroVideo
          onComplete={() => {
            sessionStorage.setItem("jurisnova_intro_seen", "true");
            router.push("/dashboard");
          }}
        />
      )}
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
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Sign In to Workspace</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Access evidence-backed governance intelligence & audit registers.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@jurisnova.ai"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              />
            </div>
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
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-mint/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-mint via-brand-bright to-brand-emerald text-dark-bg font-bold text-xs shadow-glow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 btn-hard-turkey"
          >
            <span>{loading ? "Authenticating..." : "Sign In to JurisNova"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
              One-Click Quick Sign In:
            </p>
            <span className="text-[9px] text-brand-mint font-semibold">Click to Authenticate</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => setDemoRole("fatinwasi321@jurisnova.ai", "123456789")}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-brand-mint/10 border border-[var(--border-color)] hover:border-brand-mint/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-brand-mint group-hover:underline">Compliance Officer</p>
                <span className="text-[8px] px-1 py-0.2 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20">Sign In</span>
              </div>
              <p className="text-[11px] text-[var(--text-primary)] font-semibold mt-0.5">Fatin Sharhad</p>
              <p className="text-[9px] text-[var(--text-secondary)] font-mono">fatinwasi321@jurisnova.ai</p>
            </button>

            <button
              type="button"
              onClick={() => setDemoRole("tanvirpiyal@jurisnova.ai", "123456789")}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-brand-bright/10 border border-[var(--border-color)] hover:border-brand-bright/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-brand-bright group-hover:underline">Super Administrator</p>
                <span className="text-[8px] px-1 py-0.2 rounded bg-brand-forest/20 text-brand-bright border border-brand-bright/20">Sign In</span>
              </div>
              <p className="text-[11px] text-[var(--text-primary)] font-semibold mt-0.5">Md. Tanvir Hossain</p>
              <p className="text-[9px] text-[var(--text-secondary)] font-mono">tanvirpiyal@jurisnova.ai</p>
            </button>

            <button
              type="button"
              onClick={() => setDemoRole("tahmid.islam@jurisnova.ai", "123456789")}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-yellow-400/10 border border-[var(--border-color)] hover:border-yellow-400/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-yellow-400 group-hover:underline">Risk Analyst</p>
                <span className="text-[8px] px-1 py-0.2 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Sign In</span>
              </div>
              <p className="text-[11px] text-[var(--text-primary)] font-semibold mt-0.5">Tahmid Islam</p>
              <p className="text-[9px] text-[var(--text-secondary)] font-mono">tahmid.islam@jurisnova.ai</p>
            </button>

            <button
              type="button"
              onClick={() => setDemoRole("oyishimuskan@jurisnova.ai", "123456789")}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-brand-mint/10 border border-[var(--border-color)] hover:border-brand-mint/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-brand-mint group-hover:underline">Lead Auditor</p>
                <span className="text-[8px] px-1 py-0.2 rounded bg-brand-forest/20 text-brand-mint border border-brand-mint/20">Sign In</span>
              </div>
              <p className="text-[11px] text-[var(--text-primary)] font-semibold mt-0.5">Muskan Meheg</p>
              <p className="text-[9px] text-[var(--text-secondary)] font-mono">oyishimuskan@jurisnova.ai</p>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[var(--text-secondary)]">
          <span>Don&apos;t have an account? </span>
          <Link href="/register" className="text-brand-mint hover:underline font-semibold">
            Register Organization
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
