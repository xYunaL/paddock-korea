"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TeamPickerGrid } from "@/components/onboarding/TeamPickerGrid";
import { getTeam, toggleTeamSelection } from "@/lib/teams";
import { formatKstMonthDay, cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import type { Post } from "@/features/board/types";

type Props = {
  profile: UserProfile | null;
  posts: Post[];
  onUpdateProfile: (next: UserProfile) => void;
};

const MAX_NICKNAME = 15;

/**
 * My Page — 닉네임·응원 팀(최대 2) 변경, 테마 토글, 내가 작성한 게시글.
 */
export function MyPageView({ profile, posts, onUpdateProfile }: Props) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [selected, setSelected] = useState<string[]>(
    profile?.selectedTeamIds ?? []
  );

  if (!profile) {
    return (
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <EmptyState
          icon="👤"
          title="프로필이 없어요"
          description="먼저 온보딩에서 닉네임과 팀을 설정해주세요."
        />
      </section>
    );
  }

  const myPosts = posts
    .filter((p) => p.authorNickname === profile.nickname)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const dirty =
    nickname.trim() !== profile.nickname ||
    JSON.stringify(selected) !== JSON.stringify(profile.selectedTeamIds);
  const canSave = nickname.trim().length > 0 && dirty;

  function handleSelect(id: string) {
    setSelected((prev) => toggleTeamSelection(prev, id));
  }

  function save() {
    if (!canSave) return;
    onUpdateProfile({ nickname: nickname.trim(), selectedTeamIds: selected });
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)]">
          마이페이지
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          프로필과 응원 팀을 관리하세요.
        </p>
      </div>

      {/* 프로필 */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
          프로필 설정
        </h2>

        <label className="mt-5 block">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">
            닉네임
          </span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={MAX_NICKNAME}
            aria-label="닉네임"
            className="mt-2 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          <span className="mt-1 block text-[13px] text-[var(--text-faint)]">
            {nickname.length}/{MAX_NICKNAME}
          </span>
        </label>

        <div className="mt-5">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">
            응원 팀 (최대 2)
          </span>
          <div className="mt-2">
            <TeamPickerGrid selected={selected} onSelect={handleSelect} />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dirty ? "변경 저장" : "저장됨"}
          </button>
        </div>
      </section>

      {/* 테마 */}
      <section className="flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-[var(--text)]">
            화면 테마
          </h3>
          <p className="mt-1 text-[13px] text-[var(--text-subtle)]">
            라이트 / 다크 모드
          </p>
        </div>
        <ThemeToggle />
      </section>

      {/* 내가 작성한 게시글 */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold tracking-tight text-[var(--text)]">
            내가 작성한 게시글
          </h3>
          <span className="text-[13px] text-[var(--text-subtle)]">
            {myPosts.length}개
          </span>
        </div>

        {myPosts.length === 0 ? (
          <EmptyState
            icon="📝"
            title="작성한 글이 없어요"
            description="게시판에서 첫 글을 남겨보세요."
          />
        ) : (
          <ul className="mt-4 grid gap-2">
            {myPosts.map((post) => {
              const team =
                post.scope === "team" && post.teamId
                  ? getTeam(post.teamId)
                  : undefined;
              return (
                <li
                  key={post.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--hover)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold text-[var(--text)]">
                      {post.title}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                        post.scope === "global"
                          ? "bg-[var(--surface-2)] text-[var(--text-subtle)]"
                          : "bg-[var(--primary)]/10 text-[var(--primary)]"
                      )}
                    >
                      {post.scope === "global" ? "전체" : team?.name ?? "팀"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">
                    {post.body}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[13px] text-[var(--text-faint)]">
                    <span>♥ {post.likes}</span>
                    <span>💬 {post.comments.length}</span>
                    <span>{formatKstMonthDay(post.createdAt)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
