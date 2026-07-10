"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChatBubble } from "./ChatBubble";
import { LiveIndicator } from "./LiveIndicator";
import type { ChatMessage } from "./types";

type Props = {
  title: string;
  subtitle: string;
  messages: ChatMessage[];
  /** Nickname of the current user, used to align own bubbles. */
  myNickname?: string;
  canPost: boolean;
  lockReason: string | null;
  /** Optional content under the header (e.g. team tabs). */
  header?: ReactNode;
  /** Optional action shown in the header row (e.g. fullscreen/close button). */
  headerAction?: ReactNode;
  /** Optional action shown inside the lock banner (e.g. a login button). */
  lockAction?: ReactNode;
  onSend: (text: string) => void;
  /** Message-area height bounds (px). Ignored when `fill` is set. */
  minHeight?: number;
  maxHeight?: number;
  /** Fill the parent's height (dedicated chat page) instead of min/max bounds. */
  fill?: boolean;
};

/**
 * Presentational chat shell used by GlobalChatRoom (compact preview + full page).
 * Owns only the local draft + auto-scroll; all permission/title logic is
 * decided by the parent room component.
 */
export function ChatShell({
  title,
  subtitle,
  messages,
  myNickname,
  canPost,
  lockReason,
  header,
  headerAction,
  lockAction,
  onSend,
  minHeight = 280,
  maxHeight = 420,
  fill = false,
}: Props) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  // Whether the user is parked at the bottom of the message list.
  const atBottomRef = useRef(true);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    atBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  // Auto-scroll only when already at the bottom — incoming messages won't
  // yank the view while the user is reading earlier ones.
  useEffect(() => {
    if (atBottomRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  function handleSend() {
    if (!canPost) return;
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
    // Sending your own message always follows to the bottom.
    atBottomRef.current = true;
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-bold tracking-tight text-[var(--text)]">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-subtle)]">{subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {headerAction}
          <LiveIndicator />
        </div>
      </div>

      {header && (
        <div className="border-b border-[var(--border)] px-5 py-3">{header}</div>
      )}

      {lockReason && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg border border-[var(--color-carbon-gold)]/30 bg-[var(--color-carbon-gold)]/8 px-3 py-2">
          <span aria-hidden>🔒</span>
          <span className="flex-1 text-[13px] font-medium text-[var(--color-carbon-gold)]">
            {lockReason}
          </span>
          {lockAction}
        </div>
      )}

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 space-y-3 overflow-y-auto px-5 py-4"
        style={fill ? { minHeight } : { minHeight, maxHeight }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon="💬"
              title="아직 메시지가 없어요"
              description={
                canPost
                  ? "첫 메시지를 남겨보세요. 잠시 후 다른 팬들의 메시지도 도착합니다."
                  : "이 채팅의 메시지가 아직 없어요. 잠시 후 새 메시지가 도착합니다."
              }
            />
          </div>
        ) : (
          messages.map((m) => (
            <ChatBubble
              key={m.id}
              message={m}
              isOwn={Boolean(myNickname) && m.nickname === myNickname}
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 border-t border-[var(--border)] px-5 py-4">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.key === "Process" || e.keyCode === 229)
              return;
            if (e.key === "Enter") handleSend();
          }}
          disabled={!canPost}
          aria-label="메시지 입력"
          placeholder={canPost ? "메시지를 입력하세요…" : "이 채팅은 읽기 전용입니다"}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canPost || draft.trim().length === 0}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          보내기
        </button>
      </div>
    </section>
  );
}
