"use client";

import { useEffect, useState } from "react";
import type { RaceSchedule } from "./types";

export type NextRaceState = {
  nextRace: RaceSchedule | null;
  live: boolean;
  dday: number | null;
  loading: boolean;
};

/**
 * Resolves the current/next Grand Prix from the OpenF1-backed schedule.
 * Shared by the sidebar status chip and the dashboard GP card so the
 * schedule is only fetched once per mount.
 */
export function useNextRace(): NextRaceState {
  const [state, setState] = useState<NextRaceState>({
    nextRace: null,
    live: false,
    dday: null,
    loading: true,
  });

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
        setState({
          nextRace: target,
          live: Boolean(ongoing),
          dday:
            target && !ongoing
              ? Math.max(
                  0,
                  Math.ceil(
                    (new Date(target.startUtc).getTime() - now) / 86_400_000
                  )
                )
              : null,
          loading: false,
        });
      })
      .catch(() => {
        if (alive) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
