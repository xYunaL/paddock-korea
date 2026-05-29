"use client";

import { cn } from "@/lib/utils";
import { getRealTeamIds, getTeam, isAllFan } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";

export type TabId =
  | "main-straight"
  | "board"
  | "meme"
  | "f1-101"
  | "pit-wall"
  | "mypage";

export const TABS: { id: TabId; label: string }[] = [
  { id: "main-straight", label: "Home" },
  { id: "board", label: "Board" },
  { id: "meme", label: "Meme Box" },
  { id: "f1-101", label: "F1 101" },
  { id: "pit-wall", label: "Pit Wall" },
  { id: "mypage", label: "My Page" },
];

type Props = {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  profile?: UserProfile | null;
  onProfileClick?: () => void;
};

function profileBadge(profile: UserProfile | null | undefined): {
  icon: string;
  label: string;
} {
  if (!profile) return { icon: "👤", label: "Guest" };
  const reals = getRealTeamIds(profile);
  if (reals.length > 0) {
    const logos = reals.map((id) => getTeam(id)?.logo ?? "").join("");
    return { icon: logos, label: profile.nickname };
  }
  return { icon: isAllFan(profile) ? "🌈" : "👤", label: profile.nickname };
}

export function AppHeader({ activeTab, onTabChange, profile, onProfileClick }: Props) {
  const badge = profileBadge(profile);
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--color-charcoal-800)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-6 w-1.5 rounded-sm bg-[var(--color-f1-red)]"
            aria-hidden
          />
          <span className="font-display text-[20px] font-black tracking-tight text-[var(--text)]">
            PADDOCK<span className="text-[var(--color-f1-red)]">.</span>KOREA
          </span>
        </div>

        <nav
          aria-label="섹션 탭"
          className="hidden md:flex items-center gap-1 rounded-full bg-[var(--color-charcoal-700)] p-1"
        >
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                  active
                    ? "bg-[var(--color-f1-red)] text-[var(--text)]"
                    : "text-[var(--text-subtle)] hover:text-[var(--text)]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onProfileClick}
            disabled={!onProfileClick}
            className="flex items-center gap-2 rounded-full bg-[var(--color-charcoal-700)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors enabled:hover:text-[var(--text)] disabled:cursor-default"
            aria-label={profile ? `프로필: ${badge.label}` : "프로필 설정"}
          >
            <span className="text-base" aria-hidden>{badge.icon}</span>
            <span className="max-w-[8rem] truncate font-mono tracking-wider">
              {badge.label}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile tab strip */}
      <nav
        aria-label="섹션 탭 (모바일)"
        className="md:hidden flex overflow-x-auto border-t border-[var(--border)]"
      >
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-pressed={active}
              className={cn(
                "shrink-0 px-4 py-3 font-mono text-[10px] uppercase tracking-wider transition-colors",
                active
                  ? "border-b-2 border-[var(--color-f1-red)] text-[var(--text)]"
                  : "border-b-2 border-transparent text-[var(--text-subtle)]"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
