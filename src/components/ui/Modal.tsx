"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared modal shell — centered overlay + elevated panel.
 *
 * Folds only the invariant shell classes (overlay + panel core); per-site
 * sizing/padding/layout stays in `className`. `cn` is a plain join, so the
 * emitted classes are the same set as the previous inline markup — visually
 * identical since the folded core never conflicts with the passed classes.
 */

const OVERLAY =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4";

const PANEL =
  "rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-pop)]";

type Props = {
  /** id of the panel's heading element → aria-labelledby */
  labelledBy: string;
  /** panel sizing/padding/layout classes (e.g. "w-full max-w-md p-6") */
  className?: string;
  /** add backdrop-blur-sm to the overlay */
  blur?: boolean;
  /** close when the overlay (outside the panel) is clicked */
  onOverlayClick?: () => void;
  children: ReactNode;
};

export function Modal({
  labelledBy,
  className,
  blur = false,
  onOverlayClick,
  children,
}: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={onOverlayClick}
      className={cn(OVERLAY, blur && "backdrop-blur-sm")}
    >
      <div
        onClick={onOverlayClick ? (e) => e.stopPropagation() : undefined}
        className={cn(PANEL, className)}
      >
        {children}
      </div>
    </div>
  );
}
