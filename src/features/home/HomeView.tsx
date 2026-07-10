"use client";

import { CheerPanel } from "@/features/cheer/CheerPanel";
import { CheerRanking } from "@/features/cheer/CheerRanking";
import { useCheer } from "@/features/cheer/hooks/useCheer";
import { getRealTeamIds, getTeam } from "@/lib/teams";
import { formatKstMonthDay, formatKstClock } from "@/lib/utils";
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
};

/**
 * 대시보드 — 다음 GP 현황 + 응원/랭킹 + 실시간 채팅 미리보기 + 최근 게시글.
 * 채팅은 사이드바의 1급 목적지로 승격됐고, 여기서는 미리보기만 제공한다.
 */
export function HomeView({
  profile,
  messages,
  posts,
  race,
  onNavigate,
}: Props) {
  const cheer = useCheer();
  const myTeamIds = getRealTeamIds(profile);
  const { nextRace, live, dday } = race;

  const recentMessages = messages.slice(-4);
  const recentPosts = posts.slice(0, 4);
  const greetingName = profile?.nickname ?? "게스트";

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)]">
          안녕하세요, {greetingName}님
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          오늘의 패독 현황을 한눈에 확인하세요.
        </p>
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
            핏월에서 순위·일정 보기
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
                  <li key={m.id} className="flex items-start gap-2.5">
                    <span
                      className="mt-1 h-6 w-1 shrink-0 rounded-full"
                      style={{ background: m.teamColor }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[13px]">
                        <span
                          className="font-semibold"
                          style={{ color: m.teamColor }}
                        >
                          {m.nickname}
                        </span>
                        <span className="text-[var(--text-faint)]">
                          {formatKstClock(m.timestamp)}
                        </span>
                      </p>
                      <p className="truncate text-sm text-[var(--text-muted)]">
                        {m.text}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* Recent posts */}
          <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-5 py-4">
              <h3 className="text-base font-bold tracking-tight text-[var(--text)]">
                최근 게시글
              </h3>
              <button
                type="button"
                onClick={() => onNavigate("board")}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--hover)]"
              >
                게시판 →
              </button>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {recentPosts.map((p) => {
                const team = p.teamId ? getTeam(p.teamId) : null;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate("board")}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-[var(--hover)]"
                    >
                      <span
                        className="h-8 w-1 shrink-0 rounded-full"
                        style={{ background: team?.baseColor ?? "var(--border-strong)" }}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                          {p.title}
                        </p>
                        <p className="truncate text-[13px] text-[var(--text-subtle)]">
                          {p.authorNickname}
                          {team ? ` · ${team.name}` : " · 전체"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 text-[13px] text-[var(--text-muted)]">
                        <span>♥ {p.likes}</span>
                        <span>💬 {p.comments.length}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
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
