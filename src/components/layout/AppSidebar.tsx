"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatKstMonthDay } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import type { RaceSchedule } from "@/features/pitwall/types";
import type { BoardNav } from "@/features/board/types";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthGate } from "@/components/auth/AuthGate";
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
  /** Active board sub-view (null when the board tab isn't active). */
  boardView?: BoardNav | null;
  onBoardView?: (view: BoardNav) => void;
};

const BOARD_SUBS: { id: BoardNav; label: string }[] = [
  { id: "global", label: "전체" },
  { id: "team", label: "팀별" },
  { id: "mine", label: "내가 쓴 게시글" },
];

/** Short English session label (e.g. "Practice 1" → "FP1"). */
function shortSession(name: string): string {
  const m = name.match(/practice\s*(\d)/i);
  return m ? `FP${m[1]}` : name;
}

/** KST weekday + 24h time (e.g. "일 23:00"). */
function kstSessionTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    });
  } catch {
    return iso;
  }
}

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
  boardView,
  onBoardView,
}: Props) {
  const badge = profileBadge(profile);
  const { requireAuth } = useAuthGate();

  // Client-only clock (0 during SSR/first paint to avoid hydration mismatch),
  // refreshed every 30s so LIVE session status stays current.
  const [now, setNow] = useState(0);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <aside
      className="sidebar-scope sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] lg:flex"
      aria-label="주 메뉴"
    >
      {/* Brand → 대시보드 */}
      <button
        type="button"
        onClick={() => onTabChange("dashboard")}
        aria-label="대시보드로 이동"
        className="flex items-center gap-2.5 px-5 py-5 text-left transition-opacity hover:opacity-80"
      >
        <span
          className="inline-block h-6 w-1.5 rounded-sm bg-[var(--primary)]"
          aria-hidden
        />
        <span className="font-display text-lg font-extrabold tracking-tight">
          PADDOCK<span className="text-[var(--primary)]">.</span>KOREA
        </span>
      </button>

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

                    {/* 게시판 하위 메뉴 (전체/팀별/내가 쓴 게시글) */}
                    {item.id === "board" && active && onBoardView && (
                      <ul className="mt-0.5 space-y-0.5 pl-8">
                        {BOARD_SUBS.map((s) => {
                          const on = boardView === s.id;
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                onClick={() => onBoardView(s.id)}
                                aria-current={on ? "true" : undefined}
                                className={cn(
                                  "flex w-full items-center rounded-lg px-3 py-1.5 text-[13px] transition-colors",
                                  on
                                    ? "bg-[var(--sidebar-active-bg)] font-semibold text-[var(--sidebar-fg)]"
                                    : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-fg)]"
                                )}
                              >
                                {s.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
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

            {nextRace.sessions.length > 0 && (
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto border-t border-[var(--sidebar-border)] pt-2">
                {nextRace.sessions.map((s) => {
                  const start = new Date(s.startUtc).getTime();
                  const end = new Date(s.endUtc).getTime();
                  const isLive = now > 0 && start <= now && now <= end;
                  const done = now > 0 && end < now;
                  return (
                    <li
                      key={s.sessionKey}
                      className="flex items-center justify-between gap-2 text-[12px]"
                    >
                      <span
                        className={cn(
                          "truncate font-medium",
                          done
                            ? "text-[var(--sidebar-muted)]"
                            : "text-[var(--sidebar-fg)]"
                        )}
                      >
                        {shortSession(s.name)}
                      </span>
                      {isLive ? (
                        <span className="inline-flex shrink-0 items-center gap-1 font-bold text-[var(--primary)]">
                          <span className="h-1 w-1 animate-pulse rounded-full bg-[var(--primary)]" />
                          LIVE
                        </span>
                      ) : (
                        <span className="shrink-0 tabular-nums text-[var(--sidebar-muted)]">
                          {kstSessionTime(s.startUtc)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Profile → 마이페이지 (게스트는 로그인/회원가입으로) */}
        <button
          type="button"
          onClick={() => (profile ? onTabChange(MYPAGE_ITEM.id) : requireAuth())}
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
              {profile ? badge.label : "게스트"}
            </span>
            <span className="block text-[12px] text-[var(--sidebar-muted)]">
              {profile ? "프로필 보기" : "로그인 / 회원가입"}
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
}
