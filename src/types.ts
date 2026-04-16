export interface Team {
  id: string;
  name: string;
  logo: string;
  points: number;
  wins: number;
  matchesPlayed: number;
}

export type Stage = 'QUARTER-FINALS' | 'SEMI-FINALS' | 'FINALS';

export interface Match {
  id: string;
  stage: Stage;
  team1Id: string | null;
  team2Id: string | null;
  winnerId: string | null;
  nextMatchId: string | null;
  bestOf: 1 | 3;
}

export interface TournamentState {
  teams: Team[];
  matches: Match[];
}
