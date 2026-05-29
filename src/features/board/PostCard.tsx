"use client";

import { useState } from "react";
import { getTeam, SPECIAL_TEAM_CARDS } from "@/lib/teams";
import { formatKstMonthDay, cn } from "@/lib/utils";
import type { Post } from "./types";

type Props = {
  post: Post;
  liked: boolean;
  canComment: boolean;
  onToggleLike: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
};

function authorColor(teamId: string): string {
  const team = getTeam(teamId);
  if (team) return team.baseColor;
  const special = SPECIAL_TEAM_CARDS.find((c) => c.id === teamId);
  return special ? "#ffb800" : "#ffffff";
}

export function PostCard({
  post,
  liked,
  canComment,
  onToggleLike,
  onAddComment,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const color = authorColor(post.authorTeamId);

  function submitComment() {
    const text = draft.trim();
    if (!text) return;
    onAddComment(post.id, text);
    setDraft("");
  }

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--color-charcoal-700)]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full p-4 text-left"
      >
        <h3 className="font-display text-base font-bold text-[var(--text)]">
          {post.title}
        </h3>
        <p
          className={cn(
            "mt-1 text-sm text-[var(--text-muted)] leading-relaxed",
            !expanded && "line-clamp-2"
          )}
        >
          {post.body}
        </p>
        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
          <span style={{ color }}>{post.authorNickname}</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span className="text-[var(--text-faint)]">{formatKstMonthDay(post.createdAt)}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
            댓글 {post.comments.length}
          </p>
          <ul className="mt-2 grid gap-2">
            {post.comments.map((c) => (
              <li key={c.id} className="rounded-lg bg-[var(--color-charcoal-650)] px-3 py-2">
                <span
                  className="font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: authorColor(c.authorTeamId) }}
                >
                  {c.authorNickname}
                </span>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">{c.text}</p>
              </li>
            ))}
          </ul>

          {canComment ? (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitComment();
                }}
                placeholder="댓글 달기…"
                aria-label="댓글 입력"
                className="flex-1 rounded-full border border-[var(--border)] bg-[var(--color-charcoal-800)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--color-f1-red)] focus:outline-none"
              />
              <button
                type="button"
                onClick={submitComment}
                disabled={draft.trim().length === 0}
                className="rounded-full bg-[var(--color-f1-red)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:opacity-50"
              >
                등록
              </button>
            </div>
          ) : (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
              읽기 전용 게시판입니다
            </p>
          )}
        </div>
      )}

      <footer className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          aria-pressed={liked}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] transition-colors",
            liked
              ? "bg-[var(--color-f1-red)]/15 text-[var(--color-f1-red)]"
              : "text-[var(--text-subtle)] hover:text-[var(--text)]"
          )}
        >
          <span aria-hidden>{liked ? "❤️" : "🤍"}</span>
          {post.likes}
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)] hover:text-[var(--text)]"
        >
          💬 {post.comments.length} · {expanded ? "접기" : "댓글"}
        </button>
      </footer>
    </article>
  );
}
