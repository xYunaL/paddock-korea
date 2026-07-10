import type { Driver } from "./types";

/**
 * 2026 F1 grid — 22 drivers. Used by the profile "driver tag" feature.
 * `code`/`number` are verified against OpenF1 (/drivers → name_acronym +
 * driver_number), the same source the Pit Wall uses. `teamId` matches TEAMS
 * in ./teams.ts.
 *
 * Note: Antonelli's official acronym is "ANT"; we display "KIMI" as the tag
 * (his common moniker). Swap the `code` below to change it.
 */
export const DRIVERS: Driver[] = [
  // McLaren
  { id: "norris", code: "NOR", number: 1, nameKo: "랜도 노리스", nameEn: "Lando Norris", teamId: "mclaren" },
  { id: "piastri", code: "PIA", number: 81, nameKo: "오스카 피아스트리", nameEn: "Oscar Piastri", teamId: "mclaren" },
  // Mercedes
  { id: "russell", code: "RUS", number: 63, nameKo: "조지 러셀", nameEn: "George Russell", teamId: "mercedes" },
  { id: "antonelli", code: "KIMI", number: 12, nameKo: "안드레아 키미 안토넬리", nameEn: "Andrea Kimi Antonelli", teamId: "mercedes" },
  // Red Bull
  { id: "verstappen", code: "VER", number: 3, nameKo: "막스 베르스타펜", nameEn: "Max Verstappen", teamId: "redbull" },
  { id: "hadjar", code: "HAD", number: 6, nameKo: "아이작 하자르", nameEn: "Isack Hadjar", teamId: "redbull" },
  // Ferrari
  { id: "leclerc", code: "LEC", number: 16, nameKo: "샤를 르클레르", nameEn: "Charles Leclerc", teamId: "ferrari" },
  { id: "hamilton", code: "HAM", number: 44, nameKo: "루이스 해밀턴", nameEn: "Lewis Hamilton", teamId: "ferrari" },
  // Williams
  { id: "albon", code: "ALB", number: 23, nameKo: "알렉스 알본", nameEn: "Alex Albon", teamId: "williams" },
  { id: "sainz", code: "SAI", number: 55, nameKo: "카를로스 사인츠", nameEn: "Carlos Sainz", teamId: "williams" },
  // Racing Bulls
  { id: "lawson", code: "LAW", number: 30, nameKo: "리암 로슨", nameEn: "Liam Lawson", teamId: "racingbulls" },
  { id: "lindblad", code: "LIN", number: 41, nameKo: "아비드 린드블라드", nameEn: "Arvid Lindblad", teamId: "racingbulls" },
  // Aston Martin
  { id: "alonso", code: "ALO", number: 14, nameKo: "페르난도 알론소", nameEn: "Fernando Alonso", teamId: "astonmartin" },
  { id: "stroll", code: "STR", number: 18, nameKo: "랜스 스트롤", nameEn: "Lance Stroll", teamId: "astonmartin" },
  // Haas
  { id: "ocon", code: "OCO", number: 31, nameKo: "에스테반 오콘", nameEn: "Esteban Ocon", teamId: "haas" },
  { id: "bearman", code: "BEA", number: 87, nameKo: "올리버 베어먼", nameEn: "Oliver Bearman", teamId: "haas" },
  // Audi
  { id: "hulkenberg", code: "HUL", number: 27, nameKo: "니코 휠켄베르크", nameEn: "Nico Hülkenberg", teamId: "audi" },
  { id: "bortoleto", code: "BOR", number: 5, nameKo: "가브리에우 보르툴레투", nameEn: "Gabriel Bortoleto", teamId: "audi" },
  // Alpine
  { id: "gasly", code: "GAS", number: 10, nameKo: "피에르 가슬리", nameEn: "Pierre Gasly", teamId: "alpine" },
  { id: "colapinto", code: "COL", number: 43, nameKo: "프랑코 콜라핀토", nameEn: "Franco Colapinto", teamId: "alpine" },
  // Cadillac
  { id: "perez", code: "PER", number: 11, nameKo: "세르히오 페레스", nameEn: "Sergio Pérez", teamId: "cadillac" },
  { id: "bottas", code: "BOT", number: 77, nameKo: "발테리 보타스", nameEn: "Valtteri Bottas", teamId: "cadillac" },
];

const DRIVER_BY_ID: Record<string, Driver> = Object.fromEntries(
  DRIVERS.map((d) => [d.id, d])
);

export function getDriver(id: string | undefined | null): Driver | undefined {
  if (!id) return undefined;
  return DRIVER_BY_ID[id];
}

export function isDriverId(id: unknown): id is string {
  return typeof id === "string" && id in DRIVER_BY_ID;
}

/** Drivers grouped by teamId (in DRIVERS order) — for the tag picker. */
export const DRIVERS_BY_TEAM: Record<string, Driver[]> = DRIVERS.reduce(
  (acc, d) => {
    (acc[d.teamId] ??= []).push(d);
    return acc;
  },
  {} as Record<string, Driver[]>
);
