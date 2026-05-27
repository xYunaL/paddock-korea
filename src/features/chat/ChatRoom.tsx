"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import type { RoomType } from "./types";

type Props = {
  roomType: RoomType;
  teamName?: string;
};

/**
 * ChatRoom shell (Session 2).
 * Real message send/receive lands in Session 3 (FR-002~FR-005).
 */
export function ChatRoom({ roomType, teamName }: Props) {
  const title =
    roomType === "global"
      ? "The Main Straight"
      : `The Garage — ${teamName ?? "팀 미선택"}`;

  return (
    <section className="racing-border h-full rounded-2xl border border-white/8 bg-[var(--color-charcoal-800)] p-6 pl-8">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="font-display text-xl font-black tracking-tight">
            {title}
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/45">
            {roomType === "global" ? "전체 채팅" : "팀 전용 채팅"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-charcoal-700)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" aria-hidden />
          Idle
        </span>
      </header>

      <div className="flex h-[420px] flex-col items-center justify-center">
        <EmptyState
          icon="💬"
          title="Session 3에서 채팅이 켜집니다"
          description="메시지 전송·수신 로직은 다음 회차에서 연결합니다. 지금은 헤더와 레이아웃만 준비되어 있어요."
        />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          disabled
          placeholder="메시지를 입력하세요…"
          className="flex-1 rounded-full border border-white/10 bg-[var(--color-charcoal-700)] px-4 py-2.5 text-sm text-white placeholder:text-white/30 disabled:opacity-60"
        />
        <button
          type="button"
          disabled
          className="rounded-full bg-[var(--color-f1-red)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white opacity-60"
        >
          Send
        </button>
      </div>
    </section>
  );
}
