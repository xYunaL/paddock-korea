"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { canPostInTeamChat, getTeam } from "@/lib/teams";
import { formatKstDateTime, isValidUrl, cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { DriverTag } from "@/components/ui/DriverTag";
import type { UserProfile } from "@/lib/types";
import { authorColor } from "./authorColor";
import { BoardImage } from "./BoardImage";
import type { BoardApi } from "./hooks/useBoard";
import type { Comment } from "./types";

type Props = {
  profile: UserProfile | null;
  board: BoardApi;
  postId: string;
  onBack: () => void;
};

function CommentRow({ comment }: { comment: Comment }) {
  return (
    <li className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[13px]">
        <Avatar src={comment.authorAvatarUrl} name={comment.authorNickname} size={18} />
        <span className="font-medium" style={{ color: authorColor(comment.authorTeamId) }}>
          {comment.authorNickname}
        </span>
        <DriverTag driverId={comment.authorDriverTag} />
        <span className="text-[var(--text-faint)]">·</span>
        <span className="text-[var(--text-subtle)]">
          {formatKstDateTime(comment.createdAt)}
        </span>
      </div>
      {comment.text && (
        <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-muted)]">
          {comment.text}
        </p>
      )}
      {comment.imageUrl && (
        <div className="mt-2">
          <BoardImage src={comment.imageUrl} className="max-h-72" />
        </div>
      )}
    </li>
  );
}

/**
 * Post detail view (X/Reddit style): full post + comment thread + composer.
 * Replaces the board list in-tab when a post is selected.
 */
export function PostDetailView({ profile, board, postId, onBack }: Props) {
  const [draft, setDraft] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageOpen, setImageOpen] = useState(false);

  const post = board.posts.find((p) => p.id === postId);

  const backButton = (
    <button
      type="button"
      onClick={onBack}
      className="text-[13px] font-medium text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
    >
      ← 목록
    </button>
  );

  if (!post) {
    return (
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        {backButton}
        <EmptyState
          icon="🔍"
          title="글을 찾을 수 없어요"
          description="새로고침 시 게시글이 초기화됩니다. 목록으로 돌아가 주세요."
        />
      </section>
    );
  }

  const team = post.scope === "team" && post.teamId ? getTeam(post.teamId) : undefined;
  const liked = board.likedIds.has(post.id);
  const canComment =
    post.scope === "global"
      ? Boolean(profile)
      : canPostInTeamChat(profile ?? null, post.teamId ?? "");

  const urlOk = isValidUrl(imageUrl);
  const showUrlError = imageUrl.length > 0 && !urlOk;
  const canSubmit =
    canComment && (draft.trim().length > 0 || urlOk) && !showUrlError;

  function submit() {
    if (!canComment || !profile) return;
    const text = draft.trim();
    if (!text && !urlOk) return;
    board.addComment(post!.id, text, profile, urlOk ? imageUrl.trim() : undefined);
    setDraft("");
    setImageUrl("");
    setImageOpen(false);
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      {backButton}

      {/* Post block */}
      <article className="mt-4">
        <div className="flex items-center gap-1.5 text-[13px]">
          <Avatar src={post.authorAvatarUrl} name={post.authorNickname} size={22} />
          <span
            className="font-medium"
            style={{ color: authorColor(post.authorTeamId) }}
          >
            {post.authorNickname}
          </span>
          <DriverTag driverId={post.authorDriverTag} />
          <span className="text-[var(--text-faint)]">·</span>
          <span className="text-[var(--text-subtle)]">
            {formatKstDateTime(post.createdAt)}
          </span>
          {team && (
            <>
              <span className="text-[var(--text-faint)]">·</span>
              <span className="font-medium text-[var(--primary)]">
                {team.name}
              </span>
            </>
          )}
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--text)]">
          {post.title}
        </h1>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
          {post.body}
        </p>

        {post.imageUrl && (
          <div className="mt-4">
            <BoardImage src={post.imageUrl} className="max-h-[28rem]" />
          </div>
        )}

        {/* Action row */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => board.toggleLike(post.id)}
            aria-pressed={liked}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              liked
                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                : "text-[var(--text-subtle)] hover:bg-[var(--hover)] hover:text-[var(--text)]"
            )}
          >
            <span aria-hidden>{liked ? "❤️" : "🤍"}</span>
            {post.likes}
          </button>
          <span className="text-[13px] text-[var(--text-subtle)]">
            💬 {post.comments.length}
          </span>
        </div>
      </article>

      {/* Comment thread */}
      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <p className="text-[13px] font-semibold text-[var(--text-muted)]">
          댓글 {post.comments.length}
        </p>

        {post.comments.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-faint)]">
            첫 댓글을 남겨보세요.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {post.comments.map((c) => (
              <CommentRow key={c.id} comment={c} />
            ))}
          </ul>
        )}

        {/* Composer */}
        {canComment ? (
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.nativeEvent.isComposing ||
                    e.key === "Process" ||
                    e.keyCode === 229
                  )
                    return;
                  if (e.key === "Enter") submit();
                }}
                placeholder="댓글 달기…"
                aria-label="댓글 입력"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
              />
              <button
                type="button"
                onClick={() => setImageOpen((v) => !v)}
                aria-pressed={imageOpen}
                aria-label="사진 첨부"
                title="사진 첨부"
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  imageOpen || urlOk
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                )}
              >
                🖼️
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:opacity-50"
              >
                등록
              </button>
            </div>

            {imageOpen && (
              <div className="mt-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  aria-label="댓글 이미지 URL"
                  aria-invalid={showUrlError}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
                />
                {showUrlError && (
                  <span className="mt-1 block text-[13px] text-[var(--primary)]">
                    유효한 http(s) URL을 입력해주세요
                  </span>
                )}
                {urlOk && (
                  <div className="mt-2">
                    <BoardImage src={imageUrl} alt="미리보기" className="max-h-40" />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-[13px] text-[var(--text-faint)]">
            {profile ? "읽기 전용 게시판입니다" : "온보딩을 완료하면 댓글을 쓸 수 있어요"}
          </p>
        )}
      </div>
    </section>
  );
}
