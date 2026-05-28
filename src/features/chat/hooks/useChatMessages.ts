"use client";

import { useCallback, useEffect, useState } from "react";
import { getTeam } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import type { ChatMessage, RoomType } from "../types";
import {
  SEED_GLOBAL_MESSAGES,
  SEED_TEAM_MESSAGES,
  makeSimMessage,
} from "../mock-data";

const SIM_INTERVAL_MS = 7000;

type Options = {
  /**
   * When false, the simulator is paused. Call sites pass `activeTab === room`
   * so background rooms stop generating traffic while their state survives
   * (the hook lives in AppPage, above the tab switch — messages persist).
   */
  active?: boolean;
};

/**
 * In-memory chat store with a setInterval simulator (FR-002, FR-005).
 *
 * Intended to be called once per room type at the page level so message state
 * outlives tab switches. For team mode the hook keeps messages for ALL teams;
 * the caller filters by activeTeamId. Messages reset on reload (no persistence
 * — see TECHNICAL_DESIGN open questions).
 */
export function useChatMessages(roomType: RoomType, options?: Options) {
  const active = options?.active ?? true;
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    roomType === "global" ? SEED_GLOBAL_MESSAGES : SEED_TEAM_MESSAGES
  );

  // Simulated incoming traffic so the room feels alive during the demo.
  // Paused when the room's tab is not active (UX_UI_SPEC interaction rule).
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setMessages((prev) => [...prev, makeSimMessage(roomType)]);
    }, SIM_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [roomType, active]);

  const sendMessage = useCallback(
    (text: string, profile: UserProfile, teamId?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const team = getTeam(profile.selectedTeamId);
      const message: ChatMessage = {
        id: `me-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        roomType,
        teamId: roomType === "team" ? teamId : undefined,
        nickname: profile.nickname,
        // Author's own team color (fall back to F1 red for none/all profiles).
        teamColor: team?.baseColor ?? "#e10600",
        text: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
    },
    [roomType]
  );

  return { messages, sendMessage };
}
