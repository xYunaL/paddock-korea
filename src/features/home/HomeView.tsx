"use client";

import { useEffect, useState } from "react";
import { GlobalChatRoom } from "@/features/chat/GlobalChatRoom";
import { CheerPanel } from "@/features/cheer/CheerPanel";
import { CheerRanking } from "@/features/cheer/CheerRanking";
import { useCheer } from "@/features/cheer/hooks/useCheer";
import { getRealTeamIds } from "@/lib/teams";
import { formatKstMonthDay, cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import type { ChatMessage } from "@/features/chat/types";
import type { RaceSchedule } from "@/features/pitwall/types";

type Props = {
  profile: UserProfile | null;
  messages: ChatMessage[];
  onSend: (text: string) => void;
};

/**
 * 홈(Main Straight): 그랑프리 현황 + 내 팀 응원/랭킹 + 전체 실시간 채팅(컴팩트+전체화면).
 */
export function HomeView({ profile, messages, onSend }: Props) {
  const cheer = useCheer();
  const [fullscreen, setFullscreen] = useState(false);
  const [nextRace, setNextRace] = useState<RaceSchedule | null>(null);
  const [live, setLive] = useState(false);
  const [dday, setDday] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/pitwall")
      .then((r) => r.json())
      .then((d: { schedule: RaceSchedule[] }) => {
        if (!alive) return;
        const now = Date.now();
        const upcoming = d.schedule.find((s) => s.status === "upcoming");
        const ongoing = d.schedule.find(
          (s) =>
            new Date(s.startUtc).getTime() <= now &&
            now <= new Date(s.endUtc).getTime()
        );
        const target = ongoing ?? upcoming ?? null;
        setNextRace(target);
        setLive(Boolean(ongoing));
        setDday(
          target && !ongoing
            ? Math.max(
                0,
                Math.ceil(
                  (new Date(target.startUtc).getTime() - now) / 86_400_000
                )
              )
            : null
        );
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const myTeamIds = getRealTeamIds(profile);

  return (
    <div className="grid gap-4">
      {/* 그랑프리 현황 */}
      <section className="racing-border rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6 pl-8">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
            {live ? "지금 진행 중" : "다음 그랑프리"}
          </p>
          {live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-f1-red)]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-f1-red)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-f1-red)]" />
              LIVE
            </span>
          ) : (
            dday !== null && (
              <span className="rounded-full bg-[var(--color-carbon-gold)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-carbon-gold)]">
                D-{dday}
              </span>
            )
          )}
        </div>
        {nextRace ? (
          <>
            <h2 className="mt-2 font-display text-2xl font-black tracking-tight">
              {nextRace.grandPrix}
            </h2>
            <p className="mt-1 font-mono text-sm uppercase tracking-wider text-[var(--text-subtle)]">
              {nextRace.country} · {formatKstMonthDay(nextRace.startUtc)} –{" "}
              {formatKstMonthDay(nextRace.endUtc)}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-[var(--text-subtle)]">일정을 불러오는 중…</p>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 좌: 응원 + 랭킹 */}
        <div className="grid gap-4">
          <CheerPanel
            profile={profile}
            canCheerToday={cheer.canCheerToday}
            totalFor={cheer.totalFor}
            onCheer={cheer.cheer}
          />
          <CheerRanking ranking={cheer.ranking} myTeamIds={myTeamIds} />
        </div>

        {/* 우: 전체 실시간 채팅(컴팩트) */}
        <GlobalChatRoom
          profile={profile}
          messages={messages}
          onSend={onSend}
          minHeight={220}
          maxHeight={360}
          headerAction={
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="채팅 전체화면"
              className="rounded-full bg-[var(--color-charcoal-700)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)] hover:text-[var(--text)]"
            >
              ⤢ 전체화면
            </button>
          }
        />
      </div>

      {/* 전체화면 채팅 오버레이 */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 p-4 backdrop-blur-sm sm:p-8">
          <div className={cn("mx-auto flex h-full w-full max-w-3xl flex-col")}>
            <GlobalChatRoom
              profile={profile}
              messages={messages}
              onSend={onSend}
              minHeight={320}
              maxHeight={2000}
              headerAction={
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  aria-label="전체화면 닫기"
                  className="rounded-full bg-[var(--color-charcoal-700)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)] hover:text-[var(--text)]"
                >
                  ✕ 닫기
                </button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
