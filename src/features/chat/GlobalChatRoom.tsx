"use client";

import type { ReactNode } from "react";
import { ChatShell } from "./ChatShell";
import type { UserProfile } from "@/lib/types";
import type { ChatMessage } from "./types";

type Props = {
  profile: UserProfile | null;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** Message-area bounds — compact (home) vs. fullscreen reuse. */
  minHeight?: number;
  maxHeight?: number;
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
  headerAction,
}: Props) {
  return (
    <ChatShell
      title="The Main Straight"
      subtitle="전체 채팅"
      messages={messages}
      myNickname={profile?.nickname}
      canPost={Boolean(profile)}
      lockReason={profile ? null : "온보딩을 완료하면 채팅에 참여할 수 있어요"}
      onSend={onSend}
      minHeight={minHeight}
      maxHeight={maxHeight}
      headerAction={headerAction}
    />
  );
}
