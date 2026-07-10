"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  TEAM_LOGOS_ENABLED,
  getRealTeamIds,
  getTeam,
  isAllFan,
} from "@/lib/teams";
import type { Team, UserProfile } from "@/lib/types";

type TeamBadgeProps = {
  team?: Team | null;
  /** Emoji shown when there's no team image (guest/none/all-fan, or before images exist). */
  fallback?: string;
  /** Rendered box size in px. */
  size?: number;
  className?: string;
  /** Rounded-square instead of the default circle clip. */
  square?: boolean;
};

/**
 * Renders a team's logo. Uses the generated helmet image
 * (/team-logos/<id>.png) when TEAM_LOGOS_ENABLED is on; otherwise — or if the
 * image fails to load — falls back to the team emoji / provided fallback.
 * So the UI works before AND after the custom logos are added.
 */
export function TeamBadge({
  team,
  fallback = "👤",
  size = 24,
  className,
  square = false,
}: TeamBadgeProps) {
  const [broken, setBroken] = useState(false);
  const src = team?.logoSrc;
  const showImage = TEAM_LOGOS_ENABLED && Boolean(src) && !broken;

  const box = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden",
    square ? "rounded-md" : "rounded-full",
    className
  );

  if (showImage) {
    return (
      // Local asset in /public; plain <img> keeps it dependency-free.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src as string}
        alt={team?.name ? `${team.name} 로고` : ""}
        onError={() => setBroken(true)}
        className={cn(box, "object-contain")}
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  return (
    <span className={box} style={{ width: size, height: size }} aria-hidden>
      <span style={{ fontSize: Math.round(size * 0.72), lineHeight: 1 }}>
        {team?.logo ?? fallback}
      </span>
    </span>
  );
}

/**
 * Profile logo(s) for the header/sidebar chip: renders the user's 1–2 real
 * team badges, or a single emoji badge for 올팬(🌈)/무팀·게스트(👤).
 */
export function ProfileLogos({
  profile,
  size = 22,
  className,
}: {
  profile?: UserProfile | null;
  size?: number;
  className?: string;
}) {
  const reals = getRealTeamIds(profile ?? null);
  if (reals.length > 0) {
    const per = reals.length > 1 ? Math.round(size * 0.8) : size;
    return (
      <span className={cn("inline-flex items-center gap-0.5", className)}>
        {reals.map((id) => (
          <TeamBadge key={id} team={getTeam(id)} size={per} />
        ))}
      </span>
    );
  }
  const emoji = profile && isAllFan(profile) ? "🌈" : "👤";
  return <TeamBadge fallback={emoji} size={size} className={className} />;
}
