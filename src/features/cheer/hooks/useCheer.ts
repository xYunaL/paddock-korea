"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TEAMS } from "@/lib/teams";
import type { Team } from "@/lib/types";
import { getCheerState, saveCheerState } from "@/lib/storage";
import { todayKst } from "@/lib/utils";
import { BASE_CHEERS } from "../data";

export type CheerRankEntry = {
  team: Team;
  total: number;
};

/**
 * Team cheer state + ranking (Paddock Korea original metric).
 * One cheer per day (+1), persisted to localStorage. Ranking combines the
 * seed baseline with the user's accumulated cheers.
 */
export function useCheer() {
  const [myCheers, setMyCheers] = useState<Record<string, number>>({});
  const [lastCheerDate, setLastCheerDate] = useState<string | null>(null);

  // Load persisted cheer state on mount (localStorage is client-only).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const s = getCheerState();
    setMyCheers(s.myCheers);
    setLastCheerDate(s.lastCheerDate);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const canCheerToday = lastCheerDate !== todayKst();

  const cheer = useCallback(
    (teamId: string) => {
      const today = todayKst();
      if (lastCheerDate === today) return; // already cheered today
      setMyCheers((prev) => {
        const next = { ...prev, [teamId]: (prev[teamId] ?? 0) + 1 };
        saveCheerState({ myCheers: next, lastCheerDate: today });
        return next;
      });
      setLastCheerDate(today);
    },
    [lastCheerDate]
  );

  const ranking = useMemo<CheerRankEntry[]>(
    () =>
      TEAMS.map((team) => ({
        team,
        total: (BASE_CHEERS[team.id] ?? 0) + (myCheers[team.id] ?? 0),
      })).sort((a, b) => b.total - a.total),
    [myCheers]
  );

  const totalFor = useCallback(
    (teamId: string) => (BASE_CHEERS[teamId] ?? 0) + (myCheers[teamId] ?? 0),
    [myCheers]
  );

  return { canCheerToday, cheer, ranking, totalFor };
}
