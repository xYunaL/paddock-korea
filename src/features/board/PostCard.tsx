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

function ThumbIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PostCard({ post, liked, onOpen, onToggleLike }: Props) {
  const color = authorColor(post.authorTeamId);
  const [imgBroken, setImgBroken] = useState(false);
  const showThumb = Boolean(post.imageUrl) && !imgBroken;

  return (
    <article className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--surface-hover)]">
      <button type="button" onClick={onOpen} className="flex w-full gap-3 p-3.5 text-left">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight text-[var(--text)]">
            {post.title}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-muted)] line-clamp-2">
            {post.body}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px]">
            <Avatar src={post.authorAvatarUrl} name={post.authorNickname} size={18} />
            <span className="font-medium" style={{ color }}>
              {post.authorNickname}
            </span>
            <DriverTag driverId={post.authorDriverTag} />
          </div>
        </div>

        {showThumb && (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] sm:h-20 sm:w-20">
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

      <footer className="flex items-center justify-between gap-2 border-t border-[var(--border)] px-3.5 py-2">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          aria-pressed={liked}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
            liked
              ? "bg-[var(--primary)]/10 text-[var(--primary)]"
              : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          )}
        >
          <ThumbIcon filled={liked} className="h-4 w-4" />
          {post.likes}
        </button>

        <div className="flex items-center gap-2.5 text-[12px] text-[var(--text-subtle)]">
          <span className="inline-flex items-center gap-1">
            <CommentIcon className="h-3.5 w-3.5" />
            {post.comments.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <EyeIcon className="h-3.5 w-3.5" />
            {post.views}
          </span>
          <span className="text-[var(--text-faint)]">
            {formatKstDateTime(post.createdAt)}
          </span>
        </div>
      </footer>
    </article>
  );
}
