"use client";

import { formatKstMonthDay, cn } from "@/lib/utils";
import { authorColor } from "./authorColor";
import { BoardImage } from "./BoardImage";
import type { Post } from "./types";

type Props = {
  post: Post;
  liked: boolean;
  onOpen: () => void;
  onToggleLike: (id: string) => void;
};

export function PostCard({ post, liked, onOpen, onToggleLike }: Props) {
  const color = authorColor(post.authorTeamId);

  return (
    <article className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--surface-hover)]">
      <button type="button" onClick={onOpen} className="w-full p-5 text-left">
        <h3 className="font-display text-base font-semibold tracking-tight text-[var(--text)]">
          {post.title}
        </h3>
        <p
          className={cn(
            "mt-1.5 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-2"
          )}
        >
          {post.body}
        </p>
        {post.imageUrl && (
          <div className="mt-3">
            <BoardImage src={post.imageUrl} className="max-h-56" />
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 text-[13px]">
          <span className="font-medium" style={{ color }}>{post.authorNickname}</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span className="text-[var(--text-subtle)]">{formatKstMonthDay(post.createdAt)}</span>
        </div>
      </button>

      <footer className="flex items-center justify-between border-t border-[var(--border)] px-5 py-2.5">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          aria-pressed={liked}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors",
            liked
              ? "bg-[var(--primary)]/10 text-[var(--primary)]"
              : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          )}
        >
          <span aria-hidden>{liked ? "❤️" : "🤍"}</span>
          {post.likes}
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="rounded-md px-2.5 py-1 text-[13px] text-[var(--text-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          💬 {post.comments.length}
        </button>
      </footer>
    </article>
  );
}
