"use client";

import { ChatShell } from "./ChatShell";
import type { UserProfile } from "@/lib/types";
import type { ChatMessage } from "./types";

type Props = {
  profile: UserProfile | null;
  messages: ChatMessage[];
  onSend: (text: string) => void;
};

/**
 * The Main Straight — global chat (FR-002, FR-004, FR-005).
 * Anyone with a profile can post.
 */
export function GlobalChatRoom({ profile, messages, onSend }: Props) {
  return (
    <ChatShell
      title="The Main Straight"
      subtitle="전체 채팅"
      messages={messages}
      myNickname={profile?.nickname}
      canPost={Boolean(profile)}
      lockReason={profile ? null : "온보딩을 완료하면 채팅에 참여할 수 있어요"}
      onSend={onSend}
    />
  );
}
