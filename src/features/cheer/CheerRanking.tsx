"use client";

import { cn } from "@/lib/utils";
import { TeamBadge } from "@/components/ui/TeamBadge";
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
    <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="text-base font-bold tracking-tight text-[var(--text)]">
        팀 응원 랭킹
      </h3>

      <ul className="mt-3 grid gap-1">
        {ranking.map((entry, i) => {
          const mine = Boolean(myTeamIds?.includes(entry.team.id));
          return (
            <li
              key={entry.team.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2",
                mine
                  ? "bg-[var(--color-carbon-gold)]/8 ring-1 ring-inset ring-[var(--color-carbon-gold)]/30"
                  : "hover:bg-[var(--hover)]"
              )}
            >
              <span className="w-5 text-center text-sm font-semibold tabular-nums text-[var(--text-subtle)]">
                {i + 1}
              </span>
              <span
                className="inline-block h-6 w-1 rounded-full"
                style={{ background: entry.team.baseColor }}
                aria-hidden
              />
              <TeamBadge team={entry.team} size={20} />
              <span className="flex-1 truncate text-sm text-[var(--text)]">
                {entry.team.name}
                {mine && (
                  <span className="ml-1.5 text-[12px] font-semibold text-[var(--color-carbon-gold)]">
                    내 팀
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold tabular-nums text-[var(--text-muted)]">
                {entry.total.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
