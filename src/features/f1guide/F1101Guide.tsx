"use client";

import { useState } from "react";
import { F1_GUIDE, GUIDE_CATEGORIES } from "./data";
import { cn } from "@/lib/utils";

/**
 * F1101 Guide shell (Session 2).
 * Category filter UI is live; card inline expansion lands in Session 3 (FR-009).
 */
export function F1101Guide() {
  const [category, setCategory] = useState(GUIDE_CATEGORIES[0]);
  const entries = F1_GUIDE.filter((e) => e.category === category);

  return (
    <section className="rounded-2xl border border-white/8 bg-[var(--color-charcoal-800)] p-6">
      <header className="border-b border-white/5 pb-4">
        <h2 className="font-display text-xl font-black tracking-tight">
          F1 101
        </h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/45">
          입문자를 위한 용어·전략 가이드
        </p>
      </header>

      <nav
        aria-label="가이드 카테고리"
        className="mt-4 flex flex-wrap gap-2"
      >
        {GUIDE_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={c === category}
            className={cn(
              "rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              c === category
                ? "bg-[var(--color-f1-red)] text-white"
                : "border border-white/10 bg-[var(--color-charcoal-700)] text-white/65 hover:text-white"
            )}
          >
            {c}
          </button>
        ))}
      </nav>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-xl border border-white/8 bg-[var(--color-charcoal-700)] p-4"
          >
            <h3 className="font-display text-base font-bold text-white">
              {entry.term}
            </h3>
            <p className="mt-1 text-sm text-white/65 leading-relaxed">
              {entry.shortDesc}
            </p>
            <button
              type="button"
              disabled
              className="mt-3 font-mono text-[10px] uppercase tracking-wider text-white/40"
            >
              자세히 보기 (Session 3)
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
