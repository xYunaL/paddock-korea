"use client";

import { SPECIAL_TEAM_CARDS, TEAMS } from "@/lib/teams";
import { cn } from "@/lib/utils";

type Props = {
  /** Current selection. null = nothing chosen yet, [] = "none" card chosen. */
  selected: string[] | null;
  /** Called with a card/team id; parent applies toggleTeamSelection. */
  onSelect: (id: string) => void;
};

/**
 * Team picker shared by OnboardingModal and MyPageView.
 * Real teams toggle (max 2); virtual options ("none"/"all") stand alone.
 */
export function TeamPickerGrid({ selected, onSelect }: Props) {
  const noneActive = selected !== null && selected.length === 0;

  return (
    <div>
      {/* Virtual options first so non-fans see they are welcome. */}
      <div className="grid grid-cols-2 gap-2">
        {SPECIAL_TEAM_CARDS.map((card) => {
          const active =
            card.id === "none"
              ? noneActive
              : Boolean(selected?.includes(card.id));
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelect(card.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 px-3 py-3 text-left transition-colors",
                active
                  ? "bg-[var(--color-charcoal-650)]"
                  : "bg-[var(--color-charcoal-700)] hover:bg-[var(--color-charcoal-650)]"
              )}
              style={{ borderColor: active ? card.borderColor : "var(--border)" }}
            >
              <span className="text-2xl" aria-hidden>
                {card.icon}
              </span>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold text-[var(--text)]">
                  {card.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                  {card.caption}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
        실제 팀은 최대 2개까지 선택할 수 있어요
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {TEAMS.map((team) => {
          const active = Boolean(selected?.includes(team.id));
          return (
            <button
              key={team.id}
              type="button"
              onClick={() => onSelect(team.id)}
              aria-pressed={active}
              title={team.fullName}
              className={cn(
                "flex flex-col gap-1 rounded-lg border-2 p-3 text-left transition-colors",
                active
                  ? "bg-[var(--color-charcoal-650)]"
                  : "border-[var(--border)] bg-[var(--color-charcoal-700)] hover:bg-[var(--color-charcoal-650)]"
              )}
              style={{ borderColor: active ? team.baseColor : undefined }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ background: team.baseColor }}
                  aria-hidden
                />
                <span className="text-lg" aria-hidden>
                  {team.logo}
                </span>
                <span className="font-display text-sm font-bold text-[var(--text)]">
                  {team.name}
                </span>
              </div>
              <ul className="ml-5 list-disc font-mono text-[10px] text-[var(--text-subtle)] marker:text-[var(--text-faint)]">
                {team.drivers.map((d) => (
                  <li key={d} className="truncate">
                    {d}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
