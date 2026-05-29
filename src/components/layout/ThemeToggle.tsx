"use client";

import { useEffect, useState } from "react";

const KEY = "paddock-korea:theme";
type Theme = "dark" | "light";

/**
 * Light/dark theme toggle. Persists to localStorage and flips the html class;
 * the initial class is set pre-paint by the inline script in layout.tsx.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("light") ? "light" : "dark"
    );
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const c = document.documentElement.classList;
    c.toggle("light", next === "light");
    c.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={theme === "dark" ? "라이트 모드" : "다크 모드"}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--color-charcoal-700)] text-base transition-colors hover:bg-[var(--color-charcoal-650)]"
    >
      <span aria-hidden>{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}
