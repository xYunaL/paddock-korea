"use client";

import { getRealTeamIds, getTeam } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  profile: UserProfile | null;
  canCheerToday: boolean;
  totalFor: (teamId: string) => number;
  onCheer: (teamId: string) => void;
};

/**
 * 내 팀 응원하기 — 실제 팀 1~2개 각각 카드. 응원은 하루 전체 1회(canCheerToday
 * 공유)이므로 한 팀을 응원하면 그날 모든 버튼이 잠긴다.
 */
export function CheerPanel({ profile, canCheerToday, totalFor, onCheer }: Props) {
  const teamIds = getRealTeamIds(profile);

  if (teamIds.length === 0) {
    return (
      <div className="racing-border rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6 pl-8">
        <h3 className="font-display text-lg font-black tracking-tight">
          내 팀 응원하기
        </h3>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">
          팀을 선택하면 매일 응원할 수 있어요. My Page에서 응원 팀을 골라보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="racing-border rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6 pl-8">
      <h3 className="font-display text-lg font-black tracking-tight">
        내 팀 응원하기
      </h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
        하루 한 번 응원할 수 있어요
      </p>

      <div className="mt-3 grid gap-2">
        {teamIds.map((id) => {
          const team = getTeam(id);
          if (!team) return null;
          return (
            <div
              key={id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--color-charcoal-700)] p-3"
              style={{ borderColor: `${team.baseColor}55` }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl" aria-hidden>
                  {team.logo}
                </span>
                <div>
                  <p
                    className="font-display text-sm font-bold"
                    style={{ color: team.baseColor }}
                  >
                    {team.name}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                    총 응원 {totalFor(id).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCheer(id)}
                disabled={!canCheerToday}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
                  canCheerToday
                    ? "bg-[var(--color-f1-red)] text-[var(--text)] hover:bg-[var(--color-f1-red-pressed)]"
                    : "cursor-not-allowed bg-[var(--color-charcoal-650)] text-[var(--text-faint)]"
                )}
              >
                {canCheerToday ? "🔥 +1" : "완료"}
              </button>
            </div>
          );
        })}
      </div>

      {!canCheerToday && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
          오늘 응원 완료 · 내일 다시 응원해주세요
        </p>
      )}
    </div>
  );
}
