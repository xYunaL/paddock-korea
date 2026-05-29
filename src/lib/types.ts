/**
 * Shared types — UserProfile + Team
 * Sources:
 *  - docs/TECHNICAL_DESIGN.md §7
 *  - openspec/changes/expand-team-roster-and-cross-team-chat
 */

export type Team = {
  id: string;
  name: string;
  fullName: string;
  baseColor: string;
  logo: string;
  /** [Driver 1, Driver 2] in display format "한글이름 (English Name)". */
  drivers: readonly [string, string];
};

/**
 * Reserved profile identifiers that are not real team ids.
 *  - "none": 응원할 팀이 정해지지 않은 사용자
 *  - "all":  모든 팀을 두루 응원하는 사용자(올팬)
 */
export type SpecialTeamId = "none" | "all";

/**
 * Up to 2 supported teams.
 *  - []          → 응원 팀 없음 ("none" card)
 *  - ["all"]     → 올팬
 *  - ["ferrari"] | ["ferrari","mclaren"] → 실제 팀 1~2개
 * "none"/"all" never mix with real team ids.
 */
export type UserProfile = {
  nickname: string;
  selectedTeamIds: string[];
};
