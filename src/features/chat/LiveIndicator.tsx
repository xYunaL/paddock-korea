/**
 * Live status pill (FR-005) — pulsing red dot + LIVE label.
 */
export function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[13px] font-semibold text-[var(--text-muted)]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
      </span>
      Live
    </span>
  );
}
