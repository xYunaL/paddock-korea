import type { UserProfile } from "./types";
import { isKnownProfileTeamIds } from "./teams";
import { isValidDriverTag } from "./drivers";
import { isValidUrl } from "./utils";

const KEY = "paddock-korea:user-profile";

type StoredProfile = {
  nickname?: string;
  selectedTeamIds?: unknown;
  /** legacy single-team field */
  selectedTeamId?: string;
  email?: unknown;
  avatarUrl?: unknown;
  driverTag?: unknown;
};

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProfile;
    if (!parsed.nickname) return null;

    // Migrate legacy single-team profiles → array model.
    let ids = parsed.selectedTeamIds;
    if (ids === undefined && typeof parsed.selectedTeamId === "string") {
      ids = parsed.selectedTeamId === "none" ? [] : [parsed.selectedTeamId];
    }

    if (!isKnownProfileTeamIds(ids)) return null;

    // Optional profile decorations — only restore when valid.
    const avatarUrl =
      typeof parsed.avatarUrl === "string" && isValidUrl(parsed.avatarUrl)
        ? parsed.avatarUrl
        : undefined;
    const driverTag = isValidDriverTag(parsed.driverTag)
      ? parsed.driverTag
      : undefined;

    const email =
      typeof parsed.email === "string" && parsed.email.trim()
        ? parsed.email
        : undefined;

    return {
      nickname: parsed.nickname,
      selectedTeamIds: ids,
      email,
      avatarUrl,
      driverTag,
    };
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

const TERMS_KEY = "paddock-korea:terms-agreed";

export type TermsAgreement = { version: string; agreedAt: string };

/** Record the user's agreement to the community terms (version + ISO time). */
export function saveTermsAgreement(version: string): void {
  if (typeof window === "undefined") return;
  try {
    const record: TermsAgreement = {
      version,
      agreedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(TERMS_KEY, JSON.stringify(record));
  } catch {
    // ignore
  }
}

export function getTermsAgreement(): TermsAgreement | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TERMS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TermsAgreement;
    if (typeof parsed.version !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

const NOTIF_KEY = "paddock-korea:notif-seen";

/** ISO time the user last opened notifications (for unread counting). */
export function getNotifSeen(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NOTIF_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setNotifSeen(iso: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIF_KEY, iso);
  } catch {
    // ignore
  }
}

/** 회원탈퇴 — wipe every piece of local user data. */
export function clearAllUserData(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(CHEER_KEY);
    window.localStorage.removeItem(TERMS_KEY);
    window.localStorage.removeItem(NOTIF_KEY);
  } catch {
    // ignore
  }
}
