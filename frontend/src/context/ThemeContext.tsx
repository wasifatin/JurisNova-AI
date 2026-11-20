"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent | MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jurisnova_theme") as Theme | null;
    const isLight = saved === "light";
    setTheme(isLight ? "light" : "dark");
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.classList.toggle("dark", !isLight);
    setMounted(true);
  }, []);

  const toggleTheme = (event?: React.MouseEvent | MouseEvent) => {
    const next = theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      setTheme(next);
      localStorage.setItem("jurisnova_theme", next);
      const isLight = next === "light";
      document.documentElement.classList.toggle("light", isLight);
      document.documentElement.classList.toggle("dark", !isLight);
    };

    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const doc = typeof document !== "undefined" ? (document as any) : null;

    if (!doc || !doc.startViewTransition || isReducedMotion) {
      applyTheme();
      return;
    }

    // Get click position for Hemla circular ripple origin
    let x = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let y = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

    if (event && "clientX" in event && "clientY" in event) {
      if (event.clientX !== 0 || event.clientY !== 0) {
        x = event.clientX;
        y = event.clientY;
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      applyTheme();
    });

    if (transition && transition.ready) {
      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

          document.documentElement.animate(
            {
              clipPath: clipPath,
            },
            {
              duration: 480,
              easing: "cubic-bezier(0.65, 0, 0.35, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          // Fallback if animation fails
        });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
