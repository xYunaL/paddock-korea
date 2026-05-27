/**
 * Shared types — UserProfile + Team
 * Source: docs/TECHNICAL_DESIGN.md §7
 */

export type Team = {
  id: string;
  name: string;
  fullName: string;
  baseColor: string;
  logo: string;
};

export type UserProfile = {
  nickname: string;
  selectedTeamId: string;
};
