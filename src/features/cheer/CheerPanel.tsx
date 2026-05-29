"use client";

import { getTeam, isRealTeam } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  profile: UserProfile | null;
  canCheerToday: boolean;
  myTeamTotal: number;
  onCheer: (teamId: string) => void;
};

/**
 * 내 팀 응원하기 (하루 1회 +1). Real-team profiles only.
 */
export function CheerPanel({ profile, canCheerToday, myTeamTotal, onCheer }: Props) {
  const team =
    profile && isRealTeam(profile.selectedTeamId)
      ? getTeam(profile.selectedTeamId)
      : undefined;

  if (!team) {
    return (
      <div className="racing-border rounded-2xl border border-white/8 bg-[var(--color-charcoal-800)] p-6 pl-8">
        <h3 className="font-display text-lg font-black tracking-tight">
          내 팀 응원하기
        </h3>
        <p className="mt-2 text-sm text-white/55">
          팀을 선택하면 매일 응원할 수 있어요. 헤더의 프로필에서 팀을 골라보세요.
        </p>
      </div>
    );
  }

  return (
    <div
      className="racing-border rounded-2xl border border-white/8 bg-[var(--color-charcoal-800)] p-6 pl-8"
      style={{ borderColor: `${team.baseColor}55` }}
    >
      <h3 className="font-display text-lg font-black tracking-tight">
        내 팀 응원하기
      </h3>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {team.logo}
        </span>
        <div>
          <p className="font-display text-base font-bold" style={{ color: team.baseColor }}>
            {team.name}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/55">
            총 응원 {myTeamTotal.toLocaleString()}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onCheer(team.id)}
        disabled={!canCheerToday}
        className={cn(
          "mt-4 w-full rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors",
          canCheerToday
            ? "bg-[var(--color-f1-red)] text-white hover:bg-[var(--color-f1-red-pressed)]"
            : "cursor-not-allowed bg-[var(--color-charcoal-700)] text-white/40"
        )}
      >
        {canCheerToday ? "🔥 오늘의 응원 +1" : "오늘 응원 완료 · 내일 다시"}
      </button>
    </div>
  );
}
