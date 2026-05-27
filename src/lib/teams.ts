import type { Team } from "./types";

export const TEAMS: Team[] = [
  {
    id: "redbull",
    name: "Red Bull Racing",
    fullName: "Oracle Red Bull Racing",
    baseColor: "#0c1e42",
    logo: "🐂",
  },
  {
    id: "ferrari",
    name: "Ferrari",
    fullName: "Scuderia Ferrari HP",
    baseColor: "#e10600",
    logo: "🔴",
  },
  {
    id: "mclaren",
    name: "McLaren",
    fullName: "McLaren Formula 1 Team",
    baseColor: "#ff8000",
    logo: "🧡",
  },
  {
    id: "mercedes",
    name: "Mercedes-AMG",
    fullName: "Mercedes-AMG Petronas F1 Team",
    baseColor: "#27f4d2",
    logo: "⭐",
  },
  {
    id: "astonmartin",
    name: "Aston Martin",
    fullName: "Aston Martin Aramco F1 Team",
    baseColor: "#006f62",
    logo: "💚",
  },
  {
    id: "alpine",
    name: "Alpine",
    fullName: "BWT Alpine F1 Team",
    baseColor: "#ff87c4",
    logo: "🔹",
  },
  {
    id: "williams",
    name: "Williams",
    fullName: "Williams Racing",
    baseColor: "#005aff",
    logo: "🔵",
  },
  {
    id: "rb",
    name: "VCARB",
    fullName: "Visa Cash App RB F1 Team",
    baseColor: "#5b92ff",
    logo: "🔷",
  },
  {
    id: "sauber",
    name: "Kick Sauber",
    fullName: "Stake F1 Team Kick Sauber",
    baseColor: "#52e252",
    logo: "💚",
  },
  {
    id: "haas",
    name: "Haas",
    fullName: "MoneyGram Haas F1 Team",
    baseColor: "#e60000",
    logo: "🇺🇸",
  },
];

export const TEAM_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t])
);

export function getTeam(id: string): Team | undefined {
  return TEAM_BY_ID[id];
}
