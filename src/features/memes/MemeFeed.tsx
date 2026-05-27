"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

/**
 * MemeFeed shell (Session 2).
 * Upload + like + filter wiring lands in Session 3 (FR-006~FR-008).
 */
export function MemeFeed() {
  return (
    <section className="rounded-2xl border border-white/8 bg-[var(--color-charcoal-800)] p-6">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="font-display text-xl font-black tracking-tight">
            Meme Box
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/45">
            팬 밈 모음
          </p>
        </div>
        <Button variant="secondary" disabled>
          + 밈 올리기
        </Button>
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {["전체", "최신순", "인기순"].map((label) => (
          <span
            key={label}
            className="shrink-0 rounded-full border border-white/10 bg-[var(--color-charcoal-700)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55"
          >
            {label}
          </span>
        ))}
      </div>

      <EmptyState
        icon="🖼️"
        title="아직 등록된 밈이 없습니다"
        description="Session 3에서 이미지 URL로 밈을 올릴 수 있게 됩니다."
      />
    </section>
  );
}
