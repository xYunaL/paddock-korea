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
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6">
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
      {/* 프로필 */}
      <section className="racing-border rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6 pl-8">
        <h2 className="font-display text-xl font-black tracking-tight">My Page</h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
          프로필 설정
        </p>

        <label className="mt-5 block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
            Nickname
          </span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={MAX_NICKNAME}
            aria-label="닉네임"
            className="mt-2 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--color-charcoal-700)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--color-f1-red)] focus:outline-none"
          />
          <span className="mt-1 block font-mono text-[10px] text-[var(--text-faint)]">
            {nickname.length}/{MAX_NICKNAME}
          </span>
        </label>

        <div className="mt-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
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
            className="rounded-full bg-[var(--color-f1-red)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dirty ? "변경 저장" : "저장됨"}
          </button>
        </div>
      </section>

      {/* 테마 */}
      <section className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6">
        <div>
          <h3 className="font-display text-lg font-black tracking-tight">
            화면 테마
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
            라이트 / 다크 모드
          </p>
        </div>
        <ThemeToggle />
      </section>

      {/* 내가 작성한 게시글 */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6">
        <h3 className="font-display text-lg font-black tracking-tight">
          내가 작성한 게시글
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
          {myPosts.length}개
        </p>

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
                  className="rounded-xl border border-[var(--border)] bg-[var(--color-charcoal-700)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-base font-bold text-[var(--text)]">
                      {post.title}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                        post.scope === "global"
                          ? "bg-[var(--color-charcoal-650)] text-[var(--text-subtle)]"
                          : "bg-[var(--color-f1-red)]/12 text-[var(--color-f1-red)]"
                      )}
                    >
                      {post.scope === "global" ? "전체" : team?.name ?? "팀"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">
                    {post.body}
                  </p>
                  <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
                    <span>❤️ {post.likes}</span>
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
