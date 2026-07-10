"use client";

import { useEffect, useMemo, useState } from "react";
import { CheerPanel } from "@/features/cheer/CheerPanel";
import { CheerRanking } from "@/features/cheer/CheerRanking";
import { DashboardActions } from "./DashboardActions";
import { Avatar } from "@/components/ui/Avatar";
import { DriverTag } from "@/components/ui/DriverTag";
import { ThumbIcon, CommentIcon, EyeIcon } from "@/features/board/icons";
import { useCheer } from "@/features/cheer/hooks/useCheer";
import { getRealTeamIds } from "@/lib/teams";
import { formatKstMonthDay, formatKstClock, cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import type { TabId } from "@/components/layout/nav";
import type { ChatMessage } from "@/features/chat/types";
import type { Post } from "@/features/board/types";
import type { NextRaceState } from "@/features/pitwall/useNextRace";

type Props = {
  profile: UserProfile | null;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  posts: Post[];
  race: NextRaceState;
  onNavigate: (tab: TabId) => void;
  onLogout: () => void;
};

type BestFilter = "realtime" | "weekly" | "comments" | "likes";
const BEST_FILTERS: { id: BestFilter; label: string }[] = [
  { id: "realtime", label: "실시간" },
  { id: "weekly", label: "주간" },
  { id: "comments", label: "댓글순" },
  { id: "likes", label: "추천순" },
];

/**
 * 대시보드 — 다음 GP 현황 + 응원/랭킹 + 실시간 채팅 미리보기 + BEST 게시글.
 * 채팅은 사이드바의 1급 목적지로 승격됐고, 여기서는 미리보기만 제공한다.
 */
export function HomeView({
  profile,
  messages,
  posts,
  race,
  onNavigate,
  onLogout,
}: Props) {
  const cheer = useCheer();
  const myTeamIds = getRealTeamIds(profile);
  const { nextRace, live, dday } = race;

  const recentMessages = messages.slice(-4);
  const [now, setNow] = useState(0);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => setNow(Date.now()), []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const [bestFilter, setBestFilter] = useState<BestFilter>("realtime");
  const bestPosts = useMemo(() => {
    const list = [...posts];
    if (bestFilter === "weekly") {
      const weekAgo = now - 7 * 86_400_000;
      return list
        .filter((p) => new Date(p.createdAt).getTime() >= weekAgo)
        .sort(
          (a, b) => b.likes - a.likes || b.comments.length - a.comments.length
        )
        .slice(0, 5);
    }
    list.sort((a, b) => {
      if (bestFilter === "comments") return b.comments.length - a.comments.length;
      if (bestFilter === "likes") return b.likes - a.likes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list.slice(0, 10);
  }, [posts, bestFilter, now]);
  const greetingName = profile?.nickname ?? "게스트";

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)]">
            안녕하세요, {greetingName}님
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            오늘의 패독 현황을 한눈에 확인하세요.
          </p>
        </div>
        <DashboardActions
          profile={profile}
          posts={posts}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </div>

      {/* GP status banner */}
      <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                {live ? "지금 진행 중" : "다음 그랑프리"}
              </span>
              {live ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wider text-[var(--primary)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
                  LIVE
                </span>
              ) : (
                dday !== null && (
                  <span className="rounded-full bg-[var(--accent)]/12 px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wider text-[color:color-mix(in_srgb,var(--accent)_75%,#0a3b38)]">
                    D-{dday}
                  </span>
                )
              )}
            </div>
            {nextRace ? (
              <>
                <h2 className="mt-2 truncate font-display text-2xl font-extrabold tracking-tight text-[var(--text)]">
                  {nextRace.grandPrix}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {nextRace.country} · {formatKstMonthDay(nextRace.startUtc)} –{" "}
                  {formatKstMonthDay(nextRace.endUtc)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-[var(--text-subtle)]">
                {race.loading ? "일정을 불러오는 중…" : "예정된 일정이 없습니다"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("pit-wall")}
            className="shrink-0 self-start rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)] sm:self-auto"
          >
            순위/일정표 보기
          </button>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left / main column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Chat preview */}
          <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-[var(--text)]">
                  실시간 채팅
                </h3>
                <span
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--accent)]"
                  aria-hidden
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
                  LIVE
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("chat")}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--hover)]"
              >
                채팅 열기 →
              </button>
            </div>

            <ul className="mt-3 space-y-2.5">
              {recentMessages.length === 0 ? (
                <li className="rounded-lg bg-[var(--surface-2)] px-3 py-4 text-center text-sm text-[var(--text-subtle)]">
                  아직 메시지가 없어요. 첫 메시지를 남겨보세요.
                </li>
              ) : (
                recentMessages.map((m) => (
                  <li key={m.id} className="flex items-start gap-2">
                    <Avatar src={m.avatarUrl} name={m.nickname} size={22} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[13px]">
                        <span
                          className="font-semibold"
                          style={{ color: m.teamColor }}
                        >
                          {m.nickname}
                        </span>
                        <DriverTag driverId={m.driverTag} />
                        <span className="text-[var(--text-faint)]">
                          {formatKstClock(m.timestamp)}
                        </span>
                      </p>
                      <p className="truncate text-sm text-[var(--text)]">
                        {m.text}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* BEST 게시글 */}
          <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-5 py-4">
              <h3 className="text-base font-bold tracking-tight text-[var(--text)]">
                BEST 게시글
              </h3>
              <button
                type="button"
                onClick={() => onNavigate("board")}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--hover)]"
              >
                게시판 →
              </button>
            </div>

            {/* 필터 토글 */}
            <div className="border-b border-[var(--border)] px-4 py-2.5">
              <div className="flex w-fit gap-1 rounded-lg bg-[var(--surface-2)] p-0.5">
                {BEST_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setBestFilter(f.id)}
                    aria-pressed={bestFilter === f.id}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[12px] transition-colors",
                      bestFilter === f.id
                        ? "bg-[var(--surface)] font-semibold text-[var(--text)] shadow-[var(--shadow-sm)]"
                        : "text-[var(--text-subtle)] hover:text-[var(--text)]"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {bestPosts.length === 0 ? (
              <p className="px-5 py-6 text-center text-[13px] text-[var(--text-subtle)]">
                표시할 게시글이 없어요.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {bestPosts.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate("board")}
                      className="flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-[var(--hover)]"
                    >
                      <span
                        className={cn(
                          "w-6 shrink-0 text-center text-sm font-extrabold tabular-nums",
                          i < 3
                            ? "text-[var(--primary)]"
                            : "text-[var(--text-faint)]"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text)]">
                        {p.title}
                      </p>
                      <div className="flex shrink-0 items-center gap-2.5 text-[12px] text-[var(--text-subtle)]">
                        <span className="inline-flex items-center gap-1">
                          <ThumbIcon className="h-3.5 w-3.5" />
                          {p.likes}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CommentIcon className="h-3.5 w-3.5" />
                          {p.comments.length}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <EyeIcon className="h-3.5 w-3.5" />
                          {p.views}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <CheerPanel
            profile={profile}
            canCheerToday={cheer.canCheerToday}
            totalFor={cheer.totalFor}
            onCheer={cheer.cheer}
          />
          <CheerRanking ranking={cheer.ranking} myTeamIds={myTeamIds} />
        </div>
      </div>
    </div>
  );
}
