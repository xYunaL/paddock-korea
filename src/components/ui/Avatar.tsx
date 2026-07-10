"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Profile picture URL (http(s) or data URL). */
  src?: string;
  /** Used for the alt text and the initial-letter fallback. */
  name?: string;
  /** Box size in px. */
  size?: number;
  className?: string;
};

/**
 * Round profile picture. Renders the image when `src` is set and loads;
 * otherwise falls back to the nickname's initial on a neutral disc.
 */
export function Avatar({ src, name, size = 32, className }: Props) {
  const [broken, setBroken] = useState(false);
  const showImg = Boolean(src) && !broken;
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();

  const box = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]",
    className
  );

  if (showImg) {
    return (
      // User-supplied URL from unknown domains — plain <img> avoids next/image config.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ? `${name} 프로필 사진` : ""}
        onError={() => setBroken(true)}
        className={cn(box, "object-cover")}
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  return (
    <span className={box} style={{ width: size, height: size }} aria-hidden>
      <span style={{ fontSize: Math.round(size * 0.45), fontWeight: 600, lineHeight: 1 }}>
        {initial}
      </span>
    </span>
  );
}
