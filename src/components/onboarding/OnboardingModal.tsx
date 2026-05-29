"use client";

import { useState } from "react";
import { toggleTeamSelection } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import { TeamPickerGrid } from "./TeamPickerGrid";

type Props = {
  /** Dismiss without saving (guest preview). */
  onClose: () => void;
  /** Called with the completed profile when the user submits. */
  onComplete: (profile: UserProfile) => void;
  /** Pre-fill when editing an existing profile. */
  initialProfile?: UserProfile | null;
};

const MAX_NICKNAME = 15;

/**
 * Onboarding flow (FR-001 + change `expand-team-roster-and-cross-team-chat`).
 * Nickname + team/virtual-option selection → saveUserProfile (handled by parent).
 *
 * Rendered conditionally by the parent (`{open && <OnboardingModal/>}`), so
 * each open is a fresh mount — initial form state comes straight from props.
 */
export function OnboardingModal({ onClose, onComplete, initialProfile }: Props) {
  const [nickname, setNickname] = useState(initialProfile?.nickname ?? "");
  // null = nothing chosen yet, [] = "none" card chosen.
  const [selected, setSelected] = useState<string[] | null>(
    initialProfile?.selectedTeamIds ?? null
  );

  const canSubmit = nickname.trim().length > 0 && selected !== null;

  function handleSelect(id: string) {
    setSelected((prev) => toggleTeamSelection(prev ?? [], id));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onComplete({ nickname: nickname.trim(), selectedTeamIds: selected ?? [] });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="racing-border w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-8 pl-10 max-h-[90vh] overflow-y-auto">
        <h2
          id="onboarding-title"
          className="font-display text-2xl font-black tracking-tight"
        >
          패독에 오신 것을 환영합니다
        </h2>
        <p className="mt-1 text-sm text-[var(--text-subtle)]">
          닉네임과 응원할 팀을 선택해주세요.
        </p>

        <label className="mt-6 block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
            Nickname
          </span>
          <input
            autoFocus
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) handleSubmit();
            }}
            maxLength={MAX_NICKNAME}
            placeholder="예: 맥스맘"
            aria-label="닉네임"
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--color-charcoal-700)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--color-f1-red)] focus:outline-none"
          />
          <span className="mt-1 block text-right font-mono text-[10px] text-[var(--text-faint)]">
            {nickname.length}/{MAX_NICKNAME}
          </span>
        </label>

        <div className="mt-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
            Choose your team(s) — 2026 grid
          </span>
          <div className="mt-2">
            <TeamPickerGrid selected={selected} onSelect={handleSelect} />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] hover:text-[var(--text)]"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-full bg-[var(--color-f1-red)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            입장하기
          </button>
        </div>
      </div>
    </div>
  );
}
