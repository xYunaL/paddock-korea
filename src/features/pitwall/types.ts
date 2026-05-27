export type RaceStatus = "upcoming" | "completed";

export type RaceSchedule = {
  round: number;
  grandPrix: string;
  country: string;
  /** ISO datetime in UTC; convert to KST at render time */
  dateUtc: string;
  status: RaceStatus;
};

export type DriverStanding = {
  rank: number;
  name: string;
  code: string;
  teamId: string;
  points: number;
};

export type ConstructorStanding = {
  rank: number;
  teamId: string;
  name: string;
  points: number;
};
