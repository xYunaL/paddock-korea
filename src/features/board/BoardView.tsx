"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useAuthGate } from "@/components/auth/AuthGate";
import {
  canPostInTeamChat,
  defaultGarageTeamId,
  getRealTeamIds,
  getTeam,
} from "@/lib/teams";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import { BoardTeamTabs } from "./BoardTeamTabs";
import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";
import type { BoardApi } from "./hooks/useBoard";
import type { BoardNav, BoardScope } from "./types";

type SortOrder = "latest" | "popular";

type Props = {
  profile: UserProfile | null;
  board: BoardApi;
  onOpenPost: (postId: string) => void;
  view: BoardNav;
  onViewChange: (view: BoardNav) => void;
};

const VIEWS: { id: BoardNav; label: string }[] = [
  { id: "global", label: "전체" },
  { id: "team", label: "팀별" },
  { id: "mine", label: "내 글" },
];

const SORTS: { id: SortOrder; label: string }[] = [
  { id: "latest", label: "최신순" },
  { id: "popular", label: "인기순" },
];

/**
 * 게시판 — 전체 / 팀별 / 내 글 뷰(사이드바 하위 메뉴 + 인페이지 토글로 연동).
 */
export function BoardView({ profile, board, onOpenPost, view, onViewChange }: Props) {
  const [activeTeamId, setActiveTeamId] = useState<string>(() =>
    defaultGarageTeamId(profile)
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);

  const myTeamIds = getRealTeamIds(profile);
  const { requireAuth } = useAuthGate();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = board.posts.filter((p) => {
      const inView =
        view === "mine"
          ? Boolean(profile) && p.authorNickname === profile!.nickname
          : view === "global"
            ? p.scope === "global"
            : p.scope === "team" && p.teamId === activeTeamId;
      if (!inView) return false;
      if (!q) return true;
      return `${p.title} ${p.body} ${p.authorNickname}`
        .toLowerCase()
        .includes(q);
    });
    return [...list].sort((a, b) =>
      sortOrder === "popular"
        ? b.likes - a.likes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [board.posts, view, activeTeamId, sortOrder, query, profile]);

  // New posts go to the team board in team view, otherwise to the global board.
  const writeScope: BoardScope = view === "team" ? "team" : "global";
  const canWrite =
    writeScope === "global"
      ? Boolean(profile)
      : canPostInTeamChat(profile ?? null, activeTeamId);

  const activeTeam = view === "team" ? getTeam(activeTeamId) : undefined;
  const scopeLabel = view === "team" ? activeTeam?.name ?? "팀" : "전체";

  const lockReason =
    view === "team" && profile && !canWrite
      ? `읽기 전용 — ${activeTeam?.name ?? "이 팀"} 팬만 글을 쓸 수 있어요`
      : null;

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text)]">
            게시판
          </h2>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            전체 · 팀별 · 내 글
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => (profile ? setComposerOpen(true) : requireAuth())}
          disabled={Boolean(profile) && !canWrite}
        >
          + 글쓰기
        </Button>
      </header>

      {/* 뷰 토글 (사이드바 하위 메뉴와 연동) */}
      <div className="mt-4 flex w-fit gap-1 rounded-lg bg-[var(--surface-2)] p-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onViewChange(v.id)}
            aria-pressed={view === v.id}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm transition-colors",
              view === v.id
                ? "bg-[var(--surface)] font-semibold text-[var(--text)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-subtle)] hover:text-[var(--text)]"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* 검색 + 정렬 (같은 줄, 정렬은 우측 끝) */}
      <div className="mt-3 flex items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목·내용·작성자 검색"
          aria-label="게시글 검색"
          className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
        />
        <div
          className="flex shrink-0 gap-1 rounded-lg bg-[var(--surface-2)] p-1"
          role="group"
          aria-label="정렬"
        >
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortOrder(s.id)}
              aria-pressed={s.id === sortOrder}
              className={cn(
                "rounded-md px-3 py-1 text-[13px] transition-colors",
                s.id === sortOrder
                  ? "bg-[var(--surface)] font-semibold text-[var(--text)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--text-subtle)] hover:text-[var(--text)]"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {view === "team" && (
        <div className="mt-3">
          <BoardTeamTabs
            activeTeamId={activeTeamId}
            onSelect={setActiveTeamId}
            myTeamIds={myTeamIds}
          />
        </div>
      )}

      {lockReason && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--color-carbon-gold)]/30 bg-[var(--color-carbon-gold)]/8 px-3 py-2">
          <span aria-hidden>🔒</span>
          <span className="text-[13px] font-medium text-[var(--color-carbon-gold)]">
            {lockReason}
          </span>
        </div>
      )}

      {visible.length === 0 ? (
        view === "mine" && !profile ? (
          <EmptyState
            icon="👤"
            title="로그인이 필요해요"
            description="로그인하면 내가 쓴 글을 모아볼 수 있어요."
            action={
              <button
                type="button"
                onClick={requireAuth}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)]"
              >
                로그인 / 회원가입
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={query.trim() ? "🔍" : "📝"}
            title={
              query.trim()
                ? "검색 결과가 없어요"
                : view === "mine"
                  ? "작성한 글이 없어요"
                  : "아직 글이 없어요"
            }
            description={
              query.trim()
                ? `"${query.trim()}"에 해당하는 글을 찾지 못했습니다.`
                : view === "mine"
                  ? "게시판에서 첫 글을 남겨보세요."
                  : canWrite
                    ? "첫 글을 작성해보세요."
                    : "이 게시판에 아직 글이 없습니다."
            }
          />
        )
      ) : (
        <div className="mt-5 grid gap-3">
          {visible.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={board.likedIds.has(post.id)}
              onOpen={() => onOpenPost(post.id)}
              onToggleLike={board.toggleLike}
            />
          ))}
        </div>
      )}

      {composerOpen && (
        <PostComposer
          scopeLabel={scopeLabel}
          onClose={() => setComposerOpen(false)}
          onSubmit={({ title, body, imageUrl }) => {
            if (!profile) return;
            board.addPost({
              scope: writeScope,
              teamId: writeScope === "team" ? activeTeamId : undefined,
              title,
              body,
              imageUrl,
              profile,
            });
            setSortOrder("latest");
          }}
        />
      )}
    </section>
  );
}
