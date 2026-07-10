"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { F1GuideEntry } from "./types";

type Props = {
  entry: F1GuideEntry;
};

/**
 * F1 101 guide card (FR-009).
 * Only entries whose fullDesc adds meaningful detail over shortDesc get an
 * expand toggle; short entries just show the description inline.
 */
export function F1GuideCard({ entry }: Props) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const expandable =
    entry.fullDesc.trim().length > entry.shortDesc.trim().length + 24;

  return (
    <li className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-card)]">
      <h3 className="text-base font-bold tracking-tight text-[var(--text)]">
        {entry.term}
      </h3>
      <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
        {entry.shortDesc}
      </p>

      {expandable && expanded && (
        <p
          id={panelId}
          className="mt-3 border-t border-[var(--border)] pt-3 text-sm leading-relaxed text-[var(--text-muted)]"
        >
          {entry.fullDesc}
        </p>
      )}

      {expandable && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={expanded ? panelId : undefined}
          className={cn(
            "mt-3 text-[13px] font-semibold transition-colors",
            expanded
              ? "text-[var(--primary)]"
              : "text-[var(--text-subtle)] hover:text-[var(--text)]"
          )}
        >
          {expanded ? "접기 ▲" : "자세히 보기 ▼"}
        </button>
      )}
    </li>
  );
}
