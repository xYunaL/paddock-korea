"use client";

import { TEAMS } from "@/lib/teams";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Onboarding shell (Session 2).
 * Form state & localStorage wiring lands in Session 3 (FR-001).
 */
export function OnboardingModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="racing-border w-full max-w-lg rounded-2xl border border-white/8 bg-[var(--color-charcoal-800)] p-8 pl-10">
        <h2
          id="onboarding-title"
          className="font-display text-2xl font-black tracking-tight"
        >
          패독에 오신 것을 환영합니다
        </h2>
        <p className="mt-1 text-sm text-white/55">
          닉네임과 응원할 팀을 선택해주세요. (Session 3에서 동작 연결)
        </p>

        <label className="mt-6 block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
            Nickname
          </span>
          <input
            type="text"
            disabled
            placeholder="예: 맥스맘"
            className="mt-2 w-full rounded-lg border border-white/10 bg-[var(--color-charcoal-700)] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[var(--color-f1-red)] focus:outline-none disabled:opacity-60"
          />
        </label>

        <div className="mt-6">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
            Choose your team
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {TEAMS.map((team) => (
              <div
                key={team.id}
                className="flex flex-col items-center gap-1 rounded-lg border border-white/8 bg-[var(--color-charcoal-700)] px-2 py-3 text-[11px]"
                title={team.fullName}
              >
                <span className="text-xl" aria-hidden>{team.logo}</span>
                <span className="font-mono uppercase tracking-wider text-white/70">
                  {team.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/55 hover:text-white"
          >
            나중에
          </button>
          <button
            type="button"
            disabled
            className="rounded-full bg-[var(--color-f1-red)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white opacity-60"
          >
            입장하기
          </button>
        </div>
      </div>
    </div>
  );
}
