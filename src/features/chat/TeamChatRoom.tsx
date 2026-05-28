"use client";

import { ChatShell } from "./ChatShell";
import { TeamChatTabs } from "./TeamChatTabs";
import { canPostInTeamChat, getTeam, isRealTeam } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import type { ChatMessage } from "./types";

type Props = {
  profile: UserProfile | null;
  /** All team messages; filtered to activeTeamId here. */
  messages: ChatMessage[];
  activeTeamId: string;
  onTeamChange: (teamId: string) => void;
  onSend: (text: string) => void;
};

/**
 * The Garage — team chat (FR-003 + change `expand-team-roster-and-cross-team-chat`).
 * Every team's chat is readable; the composer is gated by canPostInTeamChat.
 */
export function TeamChatRoom({
  profile,
  messages,
  activeTeamId,
  onTeamChange,
  onSend,
}: Props) {
  const team = getTeam(activeTeamId);
  const visible = messages.filter((m) => m.teamId === activeTeamId);
  const myTeamId =
    profile && isRealTeam(profile.selectedTeamId)
      ? profile.selectedTeamId
      : undefined;
  const canPost = canPostInTeamChat(profile, activeTeamId);
  const lockReason = !profile
    ? "온보딩을 완료하면 채팅에 참여할 수 있어요"
    : !canPost
      ? `읽기 전용 — ${team?.name ?? "이 팀"} 팬만 발언할 수 있어요`
      : null;

  return (
    <ChatShell
      title={`The Garage — ${team?.name ?? "팀 선택"}`}
      subtitle="팀 채팅 · 다른 팀 채팅도 읽을 수 있어요"
      messages={visible}
      myNickname={profile?.nickname}
      canPost={canPost}
      lockReason={lockReason}
      header={
        <TeamChatTabs
          activeTeamId={activeTeamId}
          onSelect={onTeamChange}
          myTeamId={myTeamId}
        />
      }
      onSend={onSend}
    />
  );
}
