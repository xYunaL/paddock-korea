"use client";

import { useState } from "react";
import { toggleTeamSelection } from "@/lib/teams";
import { saveTermsAgreement } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";
import { TeamPickerGrid } from "./TeamPickerGrid";
import { TermsContent, TERMS_VERSION } from "./terms";

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
  // Existing profiles editing here are treated as already-agreed.
  const [agreed, setAgreed] = useState(Boolean(initialProfile));

  const canSubmit =
    nickname.trim().length > 0 && selected !== null && agreed;

  function handleSelect(id: string) {
    setSelected((prev) => toggleTeamSelection(prev ?? [], id));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    saveTermsAgreement(TERMS_VERSION);
    onComplete({ nickname: nickname.trim(), selectedTeamIds: selected ?? [] });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-pop)]">
        <h2
          id="onboarding-title"
          className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)]"
        >
          패독에 오신 것을 환영합니다
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          닉네임과 응원할 팀을 선택해주세요.
        </p>

        <label className="mt-6 block">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">
            닉네임
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
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          <span className="mt-1 block text-right text-[13px] text-[var(--text-faint)]">
            {nickname.length}/{MAX_NICKNAME}
          </span>
        </label>

        <div className="mt-4">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">
            응원할 팀 선택 — 2026 그리드
          </span>
          <div className="mt-2">
            <TeamPickerGrid selected={selected} onSelect={handleSelect} />
          </div>
        </div>

        <div className="mt-6">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">
            이용약관 및 커뮤니티 가이드라인
          </span>
          <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <TermsContent />
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
            />
            <span className="text-[13px] text-[var(--text)]">
              위 이용약관 및 커뮤니티 가이드라인을 확인했으며 이에 동의합니다.{" "}
              <span className="text-[var(--primary)]">(필수)</span>
            </span>
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--text)]"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            입장하기
          </button>
        </div>
      </div>
    </div>
  );
}
