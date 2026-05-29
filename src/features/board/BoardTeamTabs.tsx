"use client";

import { TEAMS } from "@/lib/teams";
import { cn } from "@/lib/utils";

type Props = {
  activeTeamId: string;
  onSelect: (teamId: string) => void;
  /** The user's own teams — get a "내 팀" marker. */
  myTeamIds?: string[];
};

/**
 * Horizontal team selector for the team board (ported from chat TeamChatTabs).
 */
export function BoardTeamTabs({ activeTeamId, onSelect, myTeamIds }: Props) {
  return (
    <nav
      aria-label="팀 게시판 선택"
      className="flex gap-1.5 overflow-x-auto pb-1"
    >
      {TEAMS.map((team) => {
        const active = team.id === activeTeamId;
        const mine = Boolean(myTeamIds?.includes(team.id));
        return (
          <button
            key={team.id}
            type="button"
            onClick={() => onSelect(team.id)}
            aria-pressed={active}
            title={mine ? `${team.fullName} (내 팀)` : team.fullName}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              active
                ? "border-transparent text-[var(--text)]"
                : "border-[var(--border)] bg-[var(--color-charcoal-700)] text-[var(--text-subtle)] hover:text-[var(--text)]"
            )}
            style={active ? { backgroundColor: team.baseColor } : undefined}
          >
            <span aria-hidden>{team.logo}</span>
            <span>{team.name}</span>
            {mine && (
              <span
                className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-carbon-gold)]"
                aria-label="내 팀"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
