"use client";

import type { ReactNode } from "react";
import { ChatShell } from "./ChatShell";
import { useAuthGate } from "@/components/auth/AuthGate";
import type { UserProfile } from "@/lib/types";
import type { ChatMessage } from "./types";

type Props = {
  profile: UserProfile | null;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** Message-area bounds — compact (home) vs. fullscreen reuse. */
  minHeight?: number;
  maxHeight?: number;
  /** Fill the parent's height (dedicated chat page). */
  fill?: boolean;
  /** Header action (e.g. fullscreen/close button). */
  headerAction?: ReactNode;
};

/**
 * The Main Straight — global realtime chat (FR-002, FR-004, FR-005).
 * Used both as a compact panel on the home view and in a fullscreen overlay.
 * Anyone with a profile can post.
 */
export function GlobalChatRoom({
  profile,
  messages,
  onSend,
  minHeight,
  maxHeight,
  fill,
  headerAction,
}: Props) {
  const { requireAuth } = useAuthGate();
  return (
    <ChatShell
      title="The Main Straight"
      subtitle="전체 실시간 채팅"
      messages={messages}
      myNickname={profile?.nickname}
      canPost={Boolean(profile)}
      lockReason={profile ? null : "로그인하면 채팅에 참여할 수 있어요"}
      lockAction={
        profile ? undefined : (
          <button
            type="button"
            onClick={requireAuth}
            className="shrink-0 rounded-md bg-[var(--primary)] px-2.5 py-1 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)]"
          >
            로그인
          </button>
        )
      }
      onSend={onSend}
      minHeight={minHeight}
      maxHeight={maxHeight}
      fill={fill}
      headerAction={headerAction}
    />
  );
}
