"use client";

import { getRealTeamIds, getTeam } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TeamBadge } from "@/components/ui/TeamBadge";

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
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-base font-bold tracking-tight text-[var(--text)]">
          내 팀 응원하기
        </h3>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          팀을 선택하면 매일 응원할 수 있어요. 마이페이지에서 응원 팀을 골라보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-bold tracking-tight text-[var(--text)]">
          내 팀 응원하기
        </h3>
        <span className="text-[13px] text-[var(--text-subtle)]">하루 1회</span>
      </div>

      <div className="mt-3 grid gap-2">
        {teamIds.map((id) => {
          const team = getTeam(id);
          if (!team) return null;
          return (
            <div
              key={id}
              className="flex items-center justify-between gap-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{ background: team.baseColor }}
                  aria-hidden
                />
                <TeamBadge team={team} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    {team.name}
                  </p>
                  <p className="text-[13px] text-[var(--text-subtle)]">
                    총 응원 {totalFor(id).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCheer(id)}
                disabled={!canCheerToday}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  canCheerToday
                    ? "bg-[var(--primary)] text-white hover:bg-[var(--color-f1-red-pressed)]"
                    : "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-faint)]"
                )}
              >
                {canCheerToday ? "🔥 +1" : "완료"}
              </button>
            </div>
          );
        })}
      </div>

      {!canCheerToday && (
        <p className="mt-2 text-[13px] text-[var(--text-faint)]">
          오늘 응원 완료 · 내일 다시 응원해주세요
        </p>
      )}
    </div>
  );
}
