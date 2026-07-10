"use client";

import { useState } from "react";
import { getTeam, SPECIAL_TEAM_CARDS } from "@/lib/teams";
import { cn } from "@/lib/utils";
import { TeamBadge } from "@/components/ui/TeamBadge";
import type { Meme } from "./types";

type Props = {
  meme: Meme;
  liked: boolean;
  onToggleLike: (id: string) => void;
};

function authorMeta(teamId: string): { color: string; logo: string } {
  const team = getTeam(teamId);
  if (team) return { color: team.baseColor, logo: team.logo };
  const special = SPECIAL_TEAM_CARDS.find((c) => c.id === teamId);
  return { color: "#ffb800", logo: special?.icon ?? "👤" };
}

/**
 * Single meme card (FR-007, FR-008). Falls back to a placeholder when the
 * image URL fails to load.
 */
export function MemeCard({ meme, liked, onToggleLike }: Props) {
  const [broken, setBroken] = useState(false);
  const meta = authorMeta(meme.authorTeamId);
  const team = getTeam(meme.authorTeamId);

  return (
    <article className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]">
      <div className="w-full bg-[var(--surface-2)]">
        {broken ? (
          <div className="flex min-h-40 w-full flex-col items-center justify-center gap-2 py-10 text-[var(--text-faint)]">
            <span className="text-3xl" aria-hidden>🖼️</span>
            <span className="text-[13px]">
              이미지를 불러올 수 없습니다
            </span>
          </div>
        ) : (
          // Plain img: meme URLs are user-supplied, unknown domains.
          // Natural aspect ratio (no crop) for a Pinterest-style masonry feed.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meme.imageUrl}
            alt={meme.caption ?? `${meme.authorNickname}님의 밈`}
            onError={() => setBroken(true)}
            className="block h-auto w-full"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-4">
        {meme.caption && (
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">{meme.caption}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[13px] text-[var(--text-subtle)]">
            <TeamBadge team={team} fallback={meta.logo} size={18} />
            <span style={{ color: meta.color }}>{meme.authorNickname}</span>
          </span>
          <button
            type="button"
            onClick={() => onToggleLike(meme.id)}
            aria-pressed={liked}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium transition-colors",
              liked
                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                : "bg-[var(--surface-2)] text-[var(--text-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
            )}
          >
            <span aria-hidden>{liked ? "❤️" : "🤍"}</span>
            {meme.likes}
          </button>
        </div>
      </div>
    </article>
  );
}
