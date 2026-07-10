"use client";

import { useState } from "react";
import { formatKstDateTime, cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { DriverTag } from "@/components/ui/DriverTag";
import { authorColor } from "./authorColor";
import type { Post } from "./types";

type Props = {
  post: Post;
  liked: boolean;
  onOpen: () => void;
  onToggleLike: (id: string) => void;
};

export function PostCard({ post, liked, onOpen, onToggleLike }: Props) {
  const color = authorColor(post.authorTeamId);
  const [imgBroken, setImgBroken] = useState(false);
  const showThumb = Boolean(post.imageUrl) && !imgBroken;

  return (
    <article className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--surface-hover)]">
      <button type="button" onClick={onOpen} className="flex w-full gap-4 p-5 text-left">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold tracking-tight text-[var(--text)]">
            {post.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-2">
            {post.body}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[13px]">
            <Avatar src={post.authorAvatarUrl} name={post.authorNickname} size={20} />
            <span className="font-medium" style={{ color }}>{post.authorNickname}</span>
            <DriverTag driverId={post.authorDriverTag} />
            <span className="text-[var(--text-faint)]">·</span>
            <span className="text-[var(--text-subtle)]">{formatKstDateTime(post.createdAt)}</span>
          </div>
        </div>

        {showThumb && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] sm:h-24 sm:w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt=""
              onError={() => setImgBroken(true)}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}
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
