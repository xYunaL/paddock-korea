"use client";

import { cn } from "@/lib/utils";
import { formatKstMonthDay } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import type { RaceSchedule } from "@/features/pitwall/types";
import { Avatar } from "@/components/ui/Avatar";
import {
  NAV_GROUPS,
  MYPAGE_ITEM,
  profileBadge,
  type TabId,
} from "./nav";

type Props = {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  profile: UserProfile | null;
  nextRace: RaceSchedule | null;
  live: boolean;
  dday: number | null;
};

/**
 * Desktop navigation — a fixed dark-navy rail (secondary #151B26) against the
 * light content canvas. Chat is a first-class destination; the footer carries
 * the live GP status chip, theme toggle, and the profile → 마이페이지 entry.
 */
export function AppSidebar({
  activeTab,
  onTabChange,
  profile,
  nextRace,
  live,
  dday,
}: Props) {
  const badge = profileBadge(profile);

  return (
    <aside
      className="sidebar-scope sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] lg:flex"
      aria-label="주 메뉴"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span
          className="inline-block h-6 w-1.5 rounded-sm bg-[var(--primary)]"
          aria-hidden
        />
        <span className="font-display text-lg font-extrabold tracking-tight">
          PADDOCK<span className="text-[var(--primary)]">.</span>KOREA
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--sidebar-muted)]">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.id === activeTab;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-fg)]"
                          : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-fg)]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          active
                            ? "text-[var(--primary)]"
                            : "text-[var(--sidebar-muted)] group-hover:text-[var(--sidebar-fg)]"
                        )}
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.live && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                          aria-label="실시간"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--sidebar-border)] p-3">
        {/* GP status chip */}
        {nextRace && (
          <div className="mb-2 rounded-lg bg-[var(--sidebar-hover)] px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--sidebar-muted)]">
                {live ? "진행 중" : "다음 GP"}
              </span>
              {live ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[var(--primary)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
                  LIVE
                </span>
              ) : (
                dday !== null && (
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    D-{dday}
                  </span>
                )
              )}
            </div>
            <p className="mt-0.5 truncate text-sm font-semibold text-[var(--sidebar-fg)]">
              {nextRace.grandPrix}
            </p>
            <p className="text-[12px] text-[var(--sidebar-muted)]">
              {formatKstMonthDay(nextRace.startUtc)} –{" "}
              {formatKstMonthDay(nextRace.endUtc)}
            </p>
          </div>
        )}

        {/* Profile → 마이페이지 */}
        <button
          type="button"
          onClick={() => onTabChange(MYPAGE_ITEM.id)}
          aria-current={activeTab === "mypage" ? "page" : undefined}
          className={cn(
            "mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
            activeTab === "mypage"
              ? "bg-[var(--sidebar-active-bg)]"
              : "hover:bg-[var(--sidebar-hover)]"
          )}
        >
          <Avatar src={profile?.avatarUrl} name={profile?.nickname} size={32} />
          <span className="flex-1 overflow-hidden">
            <span className="block truncate text-sm font-semibold text-[var(--sidebar-fg)]">
              {badge.label}
            </span>
            <span className="block text-[12px] text-[var(--sidebar-muted)]">
              {profile ? "프로필 보기" : "프로필 설정"}
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
}
