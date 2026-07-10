"use client";

export type Theme = "light" | "dark";

const KEY = "paddock-korea:theme";

/** Current theme from the <html> class (light is the default). */
export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(next: Theme): void {
  if (typeof document === "undefined") return;
  const c = document.documentElement.classList;
  c.toggle("dark", next === "dark");
  c.toggle("light", next !== "dark");
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // ignore
  }
}

/** Flip light↔dark and return the new theme. */
export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
