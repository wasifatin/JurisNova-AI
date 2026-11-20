"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface UserSession {
  id: string;
  email: string;
  full_name: string;
  system_role: string;
  organization_id?: string;
  organization_name?: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  setUser: (u: UserSession | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("jurisnova_user");
      const token = localStorage.getItem("jurisnova_token");
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem("jurisnova_user");
          localStorage.removeItem("jurisnova_token");
        }
      } else {
        // Fallback default enterprise user for instant exploration
        const defaultUser: UserSession = {
          id: "usr-compliance-off-01",
          email: "fatinwasi321@jurisnova.ai",
          full_name: "Fatin Sharhad",
          system_role: "Compliance Officer",
          organization_id: "org-acme-fintech-01",
          organization_name: "PrimeTrust Financial & Cloud Services"
        };
        setUser(defaultUser);
        localStorage.setItem("jurisnova_user", JSON.stringify(defaultUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password: pass.trim() }),
      });

      if (res.access_token) {
        localStorage.setItem("jurisnova_token", res.access_token);
        localStorage.setItem("jurisnova_user", JSON.stringify(res.user));
        setUser(res.user);
        return;
      }
    } catch (err: any) {
      console.warn("Backend API auth failed or offline, checking demo fallback...", err);

      const DEMO_ACCOUNTS: Record<string, UserSession> = {
        "fatinwasi321@jurisnova.ai": {
          id: "usr-compliance-off-01",
          email: "fatinwasi321@jurisnova.ai",
          full_name: "Fatin Sharhad",
          system_role: "Compliance Officer",
          organization_id: "org-acme-fintech-01",
          organization_name: "PrimeTrust Financial & Cloud Services"
        },
        "tanvirpiyal@jurisnova.ai": {
          id: "usr-super-admin-01",
          email: "tanvirpiyal@jurisnova.ai",
          full_name: "Md. Tanvir Hossain",
          system_role: "Super Administrator",
          organization_id: "org-acme-fintech-01",
          organization_name: "PrimeTrust Financial & Cloud Services"
        },
        "tahmid.islam@jurisnova.ai": {
          id: "usr-risk-analyst-01",
          email: "tahmid.islam@jurisnova.ai",
          full_name: "Tahmid Islam",
          system_role: "Risk Analyst",
          organization_id: "org-acme-fintech-01",
          organization_name: "PrimeTrust Financial & Cloud Services"
        },
        "oyishimuskan@jurisnova.ai": {
          id: "usr-auditor-01",
          email: "oyishimuskan@jurisnova.ai",
          full_name: "Muskan Meheg",
          system_role: "Lead Auditor",
          organization_id: "org-acme-fintech-01",
          organization_name: "PrimeTrust Financial & Cloud Services"
        }
      };

      const normalizedEmail = email.toLowerCase().trim();
      const matchedUser = DEMO_ACCOUNTS[normalizedEmail];

      if (matchedUser) {
        const fallbackToken = `mock-jwt-token-${matchedUser.id}-${Date.now()}`;
        localStorage.setItem("jurisnova_token", fallbackToken);
        localStorage.setItem("jurisnova_user", JSON.stringify(matchedUser));
        setUser(matchedUser);
        return;
      }

      // If any other credentials are provided, ensure seamless demo access
      const guestUser: UserSession = {
        id: `usr-${Date.now()}`,
        email: normalizedEmail || "demo@jurisnova.ai",
        full_name: matchedUser ? (matchedUser as any).full_name : "Authorized Governance Officer",
        system_role: matchedUser ? (matchedUser as any).system_role : "Compliance Officer",
        organization_id: "org-acme-fintech-01",
        organization_name: "PrimeTrust Financial & Cloud Services"
      };
      const guestToken = `mock-jwt-token-guest-${Date.now()}`;
      localStorage.setItem("jurisnova_token", guestToken);
      localStorage.setItem("jurisnova_user", JSON.stringify(guestUser));
      setUser(guestUser);
      return;
    }
  };

  const logout = () => {
    localStorage.removeItem("jurisnova_token");
    localStorage.removeItem("jurisnova_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
