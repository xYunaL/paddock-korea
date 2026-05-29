"use client";

import { cn } from "@/lib/utils";
import type { CheerRankEntry } from "./hooks/useCheer";

type Props = {
  ranking: CheerRankEntry[];
  myTeamIds?: string[];
};

/**
 * 패독 코리아 팀 응원 랭킹 (시드 + 내 기여 합산).
 */
export function CheerRanking({ ranking, myTeamIds }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6">
      <h3 className="font-display text-lg font-black tracking-tight">
        팀 응원 랭킹
      </h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
        Paddock Korea Cheer Ranking
      </p>

      <ul className="mt-4 grid gap-1.5">
        {ranking.map((entry, i) => {
          const mine = Boolean(myTeamIds?.includes(entry.team.id));
          return (
            <li
              key={entry.team.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2",
                mine
                  ? "border-[var(--color-carbon-gold)]/40 bg-[var(--color-carbon-gold)]/10"
                  : "border-transparent bg-[var(--color-charcoal-700)]"
              )}
            >
              <span className="w-5 text-center font-mono text-sm text-[var(--text-subtle)]">
                {i + 1}
              </span>
              <span
                className="inline-block h-6 w-1 rounded-sm"
                style={{ background: entry.team.baseColor }}
                aria-hidden
              />
              <span className="text-base" aria-hidden>
                {entry.team.logo}
              </span>
              <span className="flex-1 text-sm text-[var(--text)]">
                {entry.team.name}
                {mine && (
                  <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-carbon-gold)]">
                    내 팀
                  </span>
                )}
              </span>
              <span className="font-mono text-sm text-[var(--text-muted)]">
                {entry.total.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
