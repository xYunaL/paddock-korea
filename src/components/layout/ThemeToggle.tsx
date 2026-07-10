"use client";

import { useEffect, useState } from "react";

const KEY = "paddock-korea:theme";
type Theme = "dark" | "light";

/**
 * Light/dark theme toggle. Persists to localStorage and flips the html class;
 * the initial class is set pre-paint by the inline script in layout.tsx.
 *
 * variant "sidebar": full-width row for the dark navy sidebar footer.
 * variant "default": compact icon button.
 */
export function ThemeToggle({
  variant = "default",
}: {
  variant?: "default" | "sidebar";
}) {
  const [theme, setTheme] = useState<Theme>("light");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
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

  const isDark = theme === "dark";

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--sidebar-muted)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-fg)]"
      >
        <span className="text-base leading-none" aria-hidden>
          {isDark ? "🌙" : "☀️"}
        </span>
        <span>{isDark ? "다크 모드" : "라이트 모드"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "라이트 모드" : "다크 모드"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-base transition-colors hover:bg-[var(--surface-hover)]"
    >
      <span aria-hidden>{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
