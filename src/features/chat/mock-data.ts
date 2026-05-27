import type { ChatMessage } from "./types";

/**
 * Seed messages for The Main Straight (global) demo.
 * Wired up to ChatRoom in Session 3.
 */
export const SEED_GLOBAL_MESSAGES: ChatMessage[] = [
  {
    id: "seed-g-1",
    roomType: "global",
    nickname: "맥스맘",
    teamColor: "#0c1e42",
    text: "이번 벨기에 그랑프리 세팅 진짜 기대됩니다 🏎️",
    timestamp: "2026-05-27T09:25:12+09:00",
  },
  {
    id: "seed-g-2",
    roomType: "global",
    nickname: "샤를루와",
    teamColor: "#e10600",
    text: "페라리 타이어 전략 좀 똑똑하게 가자 ㅠㅠ",
    timestamp: "2026-05-27T09:25:35+09:00",
  },
  {
    id: "seed-g-3",
    roomType: "global",
    nickname: "오렌지동생",
    teamColor: "#ff8000",
    text: "노리스 시뮬레이터 수치 역대급이래요!",
    timestamp: "2026-05-27T09:26:01+09:00",
  },
];

export const SEED_TEAM_MESSAGES: ChatMessage[] = [];
