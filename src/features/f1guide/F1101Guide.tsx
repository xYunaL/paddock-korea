"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { F1_GUIDE, GUIDE_CATEGORIES } from "./data";
import type { GuideCategory } from "./types";
import { F1GuideCard } from "./F1GuideCard";
import { cn } from "@/lib/utils";

const ALL_TAB = "전체" as const;
type CategoryTab = typeof ALL_TAB | GuideCategory;
// "전체" (all) leads and is the default; the rest come from the entry categories.
const CATEGORY_TABS: CategoryTab[] = [ALL_TAB, ...GUIDE_CATEGORIES];

/**
 * F1 101 guide (FR-009). Category tabs + keyword search + inline-expandable cards.
 * "전체" shows every entry; a keyword searches across ALL categories
 * (term/shortDesc/fullDesc). Results are always sorted alphabetically by term.
 */
export function F1101Guide() {
  const [category, setCategory] = useState<CategoryTab>(ALL_TAB);
  const [keyword, setKeyword] = useState("");

  const trimmed = keyword.trim().toLowerCase();
  const searching = trimmed.length > 0;

  const entries = useMemo(() => {
    const base = searching
      ? F1_GUIDE.filter((e) =>
          `${e.term} ${e.shortDesc} ${e.fullDesc}`
            .toLowerCase()
            .includes(trimmed)
        )
      : category === ALL_TAB
        ? F1_GUIDE
        : F1_GUIDE.filter((e) => e.category === category);
    return [...base].sort((a, b) => a.term.localeCompare(b.term, "ko"));
  }, [searching, trimmed, category]);

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <header className="border-b border-[var(--border)] pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text)]">
          F1 101
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-subtle)]">
          입문자를 위한 용어·전략 가이드
        </p>
      </header>

      {/* Keyword search */}
      <div className="mt-4 relative">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="용어·전략 검색 (예: DRS, 언더컷)"
          aria-label="가이드 검색"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
        />
      </div>

      {/* Category tabs (hidden meaning while searching) */}
      <nav
        aria-label="가이드 카테고리"
        className={cn("mt-3 flex flex-wrap gap-2", searching && "opacity-40")}
      >
        {CATEGORY_TABS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setKeyword("");
              setCategory(c);
            }}
            aria-pressed={!searching && c === category}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              !searching && c === category
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
            )}
          >
            {c}
          </button>
        ))}
      </nav>

      {entries.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="검색 결과가 없어요"
          description={`"${keyword.trim()}"에 해당하는 용어를 찾지 못했습니다.`}
        />
      ) : (
        <ul className="mt-5 grid items-start gap-3 sm:grid-cols-2">
          {entries.map((entry) => (
            <F1GuideCard key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}
