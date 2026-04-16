import { Team, Match } from './types';

export const INITIAL_TEAMS: Team[] = [
  { id: 't1', name: 'Team GreenLine', logo: '🟢', points: 0, wins: 0, matchesPlayed: 0 },
  { id: 't2', name: 'PocketMaster', logo: '📱', points: 0, wins: 0, matchesPlayed: 0 },
  { id: 't3', name: 'Cyber Ghost', logo: '👻', points: 0, wins: 0, matchesPlayed: 0 },
  { id: 't4', name: 'Neon Knights', logo: '⚔️', points: 0, wins: 0, matchesPlayed: 0 },
  { id: 't5', name: 'Apex Predators', logo: '🦅', points: 0, wins: 0, matchesPlayed: 0 },
  { id: 't6', name: 'Void Walkers', logo: '🌌', points: 0, wins: 0, matchesPlayed: 0 },
  { id: 't7', name: 'Storm Chasers', logo: '⚡', points: 0, wins: 0, matchesPlayed: 0 },
  { id: 't8', name: 'Iron Legion', logo: '🛡️', points: 0, wins: 0, matchesPlayed: 0 },
];

export const INITIAL_MATCHES: Match[] = [
  // Quarter Finals
  { id: 'q1', stage: 'QUARTER-FINALS', team1Id: 't1', team2Id: 't2', winnerId: null, nextMatchId: 's1', bestOf: 1 },
  { id: 'q2', stage: 'QUARTER-FINALS', team1Id: 't3', team2Id: 't4', winnerId: null, nextMatchId: 's1', bestOf: 1 },
  { id: 'q3', stage: 'QUARTER-FINALS', team1Id: 't5', team2Id: 't6', winnerId: null, nextMatchId: 's2', bestOf: 1 },
  { id: 'q4', stage: 'QUARTER-FINALS', team1Id: 't7', team2Id: 't8', winnerId: null, nextMatchId: 's2', bestOf: 1 },
  
  // Semi Finals
  { id: 's1', stage: 'SEMI-FINALS', team1Id: null, team2Id: null, winnerId: null, nextMatchId: 'f1', bestOf: 3 },
  { id: 's2', stage: 'SEMI-FINALS', team1Id: null, team2Id: null, winnerId: null, nextMatchId: 'f1', bestOf: 3 },
  
  // Finals
  { id: 'f1', stage: 'FINALS', team1Id: null, team2Id: null, winnerId: null, nextMatchId: null, bestOf: 3 },
];
