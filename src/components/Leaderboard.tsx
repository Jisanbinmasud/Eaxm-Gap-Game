import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Team } from '../types';
import { Trophy, TrendingUp, Hash } from 'lucide-react';

interface LeaderboardProps {
  teams: Team[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points || b.wins - a.wins);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-esports-cyan w-6 h-6" />
        <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Leaderboard</h2>
      </div>

      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-widest text-white/40 border-b border-white/10">
              <th className="pb-4 font-medium px-2"><Hash className="w-3 h-3" /></th>
              <th className="pb-4 font-medium">Team</th>
              <th className="pb-4 font-medium text-center">MP</th>
              <th className="pb-4 font-medium text-center">W</th>
              <th className="pb-4 font-medium text-right">PTS</th>
            </tr>
          </thead>
          <tbody className="relative">
            <AnimatePresence mode="popLayout">
              {sortedTeams.map((team, index) => (
                <motion.tr
                  key={team.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  className={`group border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors`}
                >
                  <td className="py-4 px-2">
                    <span className={`text-sm font-bold ${index === 0 ? 'text-esports-yellow' : 'text-white/60'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{team.logo}</span>
                      <span className="font-bold text-sm tracking-tight group-hover:text-esports-cyan transition-colors">
                        {team.name}
                      </span>
                      {index === 0 && <Trophy className="w-4 h-4 text-esports-yellow animate-pulse" />}
                    </div>
                  </td>
                  <td className="py-4 text-center font-mono text-sm text-white/60">{team.matchesPlayed}</td>
                  <td className="py-4 text-center font-mono text-sm text-esports-neon">{team.wins}</td>
                  <td className="py-4 text-right">
                    <motion.span 
                      key={team.points}
                      initial={{ scale: 1.5, color: '#39ff14' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="font-display font-bold text-lg"
                    >
                      {team.points}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
