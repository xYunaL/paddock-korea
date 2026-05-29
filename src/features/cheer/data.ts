/**
 * Seed cheer counts per team (virtual community baseline).
 * The ranking = these + the current user's accumulated cheers.
 * Single-user MVP, so the seed keeps the leaderboard meaningful.
 */
export const BASE_CHEERS: Record<string, number> = {
  ferrari: 1820,
  mclaren: 1540,
  redbull: 1490,
  mercedes: 1210,
  astonmartin: 760,
  williams: 540,
  racingbulls: 430,
  alpine: 410,
  audi: 380,
  haas: 350,
  cadillac: 300,
};
