"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import {
  NAV_GROUPS,
  MYPAGE_ITEM,
  profileBadge,
  type NavItem,
  type TabId,
} from "./nav";

type Props = {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  profile: UserProfile | null;
};

const ALL_ITEMS: NavItem[] = [...NAV_GROUPS.flatMap((g) => g.items), MYPAGE_ITEM];
// Primary bottom-bar items; the rest live behind "더보기".
const PRIMARY_IDS: TabId[] = ["dashboard", "board", "chat", "meme"];

/**
 * Mobile navigation (<lg): a slim top app bar plus a bottom tab bar.
 * Secondary destinations (핏월 / F1 101 / 마이페이지) open from "더보기".
 */
export function MobileNav({ activeTab, onTabChange, profile }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const badge = profileBadge(profile);
  const primary = PRIMARY_IDS.map(
    (id) => ALL_ITEMS.find((i) => i.id === id)!
  );
  const moreItems = ALL_ITEMS.filter((i) => !PRIMARY_IDS.includes(i.id));
  const moreActive = moreItems.some((i) => i.id === activeTab);

  function go(id: TabId) {
    onTabChange(id);
    setMoreOpen(false);
  }

  return (
    <>
      {/* Top app bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-5 w-1.5 rounded-sm bg-[var(--primary)]"
            aria-hidden
          />
          <span className="font-display text-base font-extrabold tracking-tight text-[var(--text)]">
            PADDOCK<span className="text-[var(--primary)]">.</span>KOREA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange("mypage")}
            className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm transition-colors hover:bg-[var(--surface-hover)]"
            aria-label={profile ? `프로필: ${badge.label}` : "프로필 설정"}
          >
            <Avatar src={profile?.avatarUrl} name={profile?.nickname} size={22} />
            <span className="max-w-[6rem] truncate font-medium text-[var(--text)]">
              {badge.label}
            </span>
          </button>
        </div>
      </header>

      {/* Bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--border)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="주 메뉴 (모바일)"
      >
        {primary.map((item) => {
          const active = item.id === activeTab;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[12px] font-medium transition-colors",
                active ? "text-[var(--primary)]" : "text-[var(--text-subtle)]"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          className={cn(
            "flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[12px] font-medium transition-colors",
            moreActive || moreOpen
              ? "text-[var(--primary)]"
              : "text-[var(--text-subtle)]"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden
          >
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="12" cy="12" r="1.2" />
            <circle cx="19" cy="12" r="1.2" />
          </svg>
          더보기
        </button>
      </nav>

      {/* "더보기" sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-[var(--border)] bg-[var(--surface)] p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[var(--shadow-pop)]">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[var(--border-strong)]" />
            <ul className="space-y-0.5">
              {moreItems.map((item) => {
                const active = item.id === activeTab;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--surface-2)] text-[var(--text)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--hover)]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          active
                            ? "text-[var(--primary)]"
                            : "text-[var(--text-subtle)]"
                        )}
                      />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
