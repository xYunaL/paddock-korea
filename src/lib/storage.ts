import type { UserProfile } from "./types";
import { isKnownProfileTeamId } from "./teams";

const KEY = "paddock-korea:user-profile";

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed.nickname || !parsed.selectedTeamId) return null;
    if (!isKnownProfileTeamId(parsed.selectedTeamId)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearUserProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

const CHEER_KEY = "paddock-korea:cheer";

/** Per-browser cheer state: how many times the user cheered each team, and the
 * last cheer date (KST YYYY-MM-DD) used to enforce the once-per-day rule. */
export type CheerState = {
  myCheers: Record<string, number>;
  lastCheerDate: string | null;
};

export function getCheerState(): CheerState {
  const empty: CheerState = { myCheers: {}, lastCheerDate: null };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(CHEER_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as CheerState;
    return {
      myCheers: parsed.myCheers ?? {},
      lastCheerDate: parsed.lastCheerDate ?? null,
    };
  } catch {
    return empty;
  }
}

export function saveCheerState(state: CheerState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHEER_KEY, JSON.stringify(state));
}
