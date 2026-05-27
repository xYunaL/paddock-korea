"use client";

import { useState } from "react";
import {
  DRIVER_STANDINGS,
  CONSTRUCTOR_STANDINGS,
  RACE_SCHEDULE,
} from "./data";
import { getTeam } from "@/lib/teams";
import { formatKstDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type SubTab = "drivers" | "constructors" | "schedule";

const SUBTABS: { id: SubTab; label: string }[] = [
  { id: "drivers", label: "Drivers" },
  { id: "constructors", label: "Constructors" },
  { id: "schedule", label: "Schedule" },
];

/**
 * Pit Wall shell (Session 2).
 * Subtab UI is live; deeper interactions land in Session 3 (FR-010, FR-011).
 */
export function PitWallPage() {
  const [tab, setTab] = useState<SubTab>("drivers");

  return (
    <section className="rounded-2xl border border-white/8 bg-[var(--color-charcoal-800)] p-6">
      <header className="border-b border-white/5 pb-4">
        <h2 className="font-display text-xl font-black tracking-tight">
          Pit Wall
        </h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/45">
          순위 · 일정 (KST)
        </p>
      </header>

      <nav
        aria-label="피트월 하위 탭"
        className="mt-4 flex gap-1 rounded-full bg-[var(--color-charcoal-700)] p-1 w-fit"
      >
        {SUBTABS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setTab(s.id)}
            aria-pressed={s.id === tab}
            className={cn(
              "rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              s.id === tab
                ? "bg-[var(--color-f1-red)] text-white"
                : "text-white/55 hover:text-white"
            )}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="mt-5">
        {tab === "drivers" && <DriversTable />}
        {tab === "constructors" && <ConstructorsGrid />}
        {tab === "schedule" && <ScheduleList />}
      </div>
    </section>
  );
}

function DriversTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/8">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-charcoal-700)] text-white/55">
          <tr className="font-mono text-[10px] uppercase tracking-wider">
            <th className="px-3 py-2 text-left">Pos</th>
            <th className="px-3 py-2 text-left">Driver</th>
            <th className="px-3 py-2 text-left">Team</th>
            <th className="px-3 py-2 text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {DRIVER_STANDINGS.map((d) => {
            const team = getTeam(d.teamId);
            return (
              <tr
                key={d.code}
                className="border-t border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-3 py-2 font-mono text-white/70">{d.rank}</td>
                <td className="px-3 py-2">
                  <span className="font-mono text-white/40">{d.code}</span>{" "}
                  <span className="text-white">{d.name}</span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: team?.baseColor }}
                    aria-hidden
                  />{" "}
                  <span className="text-white/70">{team?.name ?? d.teamId}</span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-white">
                  {d.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ConstructorsGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {CONSTRUCTOR_STANDINGS.map((c) => {
        const team = getTeam(c.teamId);
        return (
          <li
            key={c.teamId}
            className="flex items-center justify-between rounded-xl border border-white/8 bg-[var(--color-charcoal-700)] p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-8 w-1 rounded-sm"
                style={{ background: team?.baseColor }}
                aria-hidden
              />
              <div>
                <p className="font-display text-sm font-bold">
                  {c.rank}. {team?.name ?? c.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                  {c.name}
                </p>
              </div>
            </div>
            <span className="font-mono text-lg text-white">{c.points}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ScheduleList() {
  const nextRace = RACE_SCHEDULE.find((r) => r.status === "upcoming");
  return (
    <ul className="grid gap-2">
      {RACE_SCHEDULE.map((race) => {
        const isNext = race === nextRace;
        return (
          <li
            key={race.round}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4",
              isNext
                ? "border-[var(--color-f1-red)] bg-[var(--color-f1-red)]/8"
                : "border-white/8 bg-[var(--color-charcoal-700)]"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-white/45 w-8">
                R{race.round}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{race.grandPrix}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                  {race.country} · {formatKstDateTime(race.dateUtc)}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-wider",
                race.status === "completed" ? "text-white/40" : "text-[var(--color-carbon-gold)]"
              )}
            >
              {race.status === "completed" ? "완료" : isNext ? "다음 경기" : "예정"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
