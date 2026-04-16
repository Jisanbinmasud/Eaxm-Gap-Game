import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Team, Match } from './types';
import { INITIAL_TEAMS, INITIAL_MATCHES } from './constants';
import { auth, db } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  writeBatch
} from 'firebase/firestore';

interface TournamentContextType {
  teams: Team[];
  matches: Match[];
  user: FirebaseUser | null;
  isAuthReady: boolean;
  isAdmin: boolean;
  handleAdvance: (matchId: string, winnerId: string) => Promise<void>;
  handleAddPoints: (teamId: string, points: number) => Promise<void>;
  handleAddTeam: (name: string, logo: string) => Promise<void>;
  handleDeleteTeam: (teamId: string) => Promise<void>;
  handleEditTeam: (teamId: string, name: string, logo: string) => Promise<void>;
  handleUpdateMatchTeams: (matchId: string, team1Id: string | null, team2Id: string | null) => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      const teamsData = snapshot.docs.map(doc => doc.data() as Team);
      if (teamsData.length === 0 && user?.email === "jisanbinmasud@gmail.com") {
        const batch = writeBatch(db);
        INITIAL_TEAMS.forEach(t => batch.set(doc(db, 'teams', t.id), t));
        batch.commit();
      } else {
        setTeams(teamsData);
      }
    });

    const unsubMatches = onSnapshot(collection(db, 'matches'), (snapshot) => {
      const matchesData = snapshot.docs.map(doc => doc.data() as Match);
      if (matchesData.length === 0 && user?.email === "jisanbinmasud@gmail.com") {
        const batch = writeBatch(db);
        INITIAL_MATCHES.forEach(m => batch.set(doc(db, 'matches', m.id), m));
        batch.commit();
      } else {
        setMatches(matchesData.sort((a, b) => a.id.localeCompare(b.id)));
      }
    });

    return () => {
      unsubTeams();
      unsubMatches();
    };
  }, [user]);

  const isAdmin = user?.email === "jisanbinmasud@gmail.com";

  const handleAdvance = useCallback(async (matchId: string, winnerId: string) => {
    const currentMatch = matches.find(m => m.id === matchId);
    if (!currentMatch || currentMatch.winnerId) return;
    const batch = writeBatch(db);
    batch.update(doc(db, 'matches', matchId), { winnerId });
    if (currentMatch.nextMatchId) {
      const nextMatch = matches.find(m => m.id === currentMatch.nextMatchId);
      if (nextMatch) {
        const nextMatchRef = doc(db, 'matches', nextMatch.id);
        if (!nextMatch.team1Id) batch.update(nextMatchRef, { team1Id: winnerId });
        else if (!nextMatch.team2Id && nextMatch.team1Id !== winnerId) batch.update(nextMatchRef, { team2Id: winnerId });
      }
    }
    const winner = teams.find(t => t.id === winnerId);
    if (winner) batch.update(doc(db, 'teams', winnerId), { wins: winner.wins + 1, matchesPlayed: winner.matchesPlayed + 1, points: winner.points + 100 });
    const loserId = currentMatch.team1Id === winnerId ? currentMatch.team2Id : currentMatch.team1Id;
    if (loserId) {
      const loser = teams.find(t => t.id === loserId);
      if (loser) batch.update(doc(db, 'teams', loserId), { matchesPlayed: loser.matchesPlayed + 1, points: loser.points + 20 });
    }
    await batch.commit();
  }, [matches, teams]);

  const handleAddPoints = useCallback(async (teamId: string, points: number) => {
    const team = teams.find(t => t.id === teamId);
    if (team) await updateDoc(doc(db, 'teams', teamId), { points: team.points + points });
  }, [teams]);

  const handleAddTeam = useCallback(async (name: string, logo: string) => {
    const id = `t${Date.now()}`;
    await setDoc(doc(db, 'teams', id), { id, name, logo, points: 0, wins: 0, matchesPlayed: 0 });
  }, []);

  const handleDeleteTeam = useCallback(async (teamId: string) => {
    await deleteDoc(doc(db, 'teams', teamId));
    const batch = writeBatch(db);
    matches.forEach(m => {
      if (m.team1Id === teamId || m.team2Id === teamId || m.winnerId === teamId) {
        batch.update(doc(db, 'matches', m.id), {
          team1Id: m.team1Id === teamId ? null : m.team1Id,
          team2Id: m.team2Id === teamId ? null : m.team2Id,
          winnerId: m.winnerId === teamId ? null : m.winnerId
        });
      }
    });
    await batch.commit();
  }, [matches]);

  const handleEditTeam = useCallback(async (teamId: string, name: string, logo: string) => {
    await updateDoc(doc(db, 'teams', teamId), { name, logo });
  }, []);

  const handleUpdateMatchTeams = useCallback(async (matchId: string, team1Id: string | null, team2Id: string | null) => {
    await updateDoc(doc(db, 'matches', matchId), { team1Id, team2Id, winnerId: null });
  }, []);

  return (
    <TournamentContext.Provider value={{
      teams, matches, user, isAuthReady, isAdmin,
      handleAdvance, handleAddPoints, handleAddTeam, handleDeleteTeam, handleEditTeam, handleUpdateMatchTeams
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) throw new Error('useTournament must be used within a TournamentProvider');
  return context;
};
