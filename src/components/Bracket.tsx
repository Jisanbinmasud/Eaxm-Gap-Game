import React from 'react';
import { motion } from 'motion/react';
import { Match, Team, Stage } from '../types';
import { Trophy } from 'lucide-react';

interface BracketProps {
  matches: Match[];
  teams: Team[];
}

const MatchCard: React.FC<{ match: Match; teams: Team[] }> = ({ match, teams }) => {
  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);

  return (
    <div className="relative group">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-48 border-2 border-transparent group-hover:border-esports-cyan transition-all duration-300">
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-3 border-b border-gray-100 ${match.winnerId === match.team1Id ? 'bg-esports-neon/10' : ''}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">{team1?.logo || '❓'}</span>
            <span className={`text-xs font-bold uppercase truncate ${match.winnerId === match.team1Id ? 'text-black' : 'text-gray-500'}`}>
              {team1?.name || 'TBD'}
            </span>
          </div>
          {match.winnerId === match.team1Id && <Trophy className="w-3 h-3 text-esports-yellow fill-esports-yellow" />}
        </div>

        {/* Team 2 */}
        <div className={`flex items-center justify-between p-3 ${match.winnerId === match.team2Id ? 'bg-esports-neon/10' : ''}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">{team2?.logo || '❓'}</span>
            <span className={`text-xs font-bold uppercase truncate ${match.winnerId === match.team2Id ? 'text-black' : 'text-gray-500'}`}>
              {team2?.name || 'TBD'}
            </span>
          </div>
          {match.winnerId === match.team2Id && <Trophy className="w-3 h-3 text-esports-yellow fill-esports-yellow" />}
        </div>

        {/* Match Info */}
        <div className="bg-esports-blue text-[10px] font-bold text-center py-1 uppercase tracking-tighter text-esports-yellow">
          BO{match.bestOf} {match.stage === 'FINALS' ? '• GRAND FINAL' : ''}
        </div>
      </div>
    </div>
  );
};

export const Bracket: React.FC<BracketProps> = ({ matches, teams }) => {
  const stages: Stage[] = ['QUARTER-FINALS', 'SEMI-FINALS', 'FINALS'];

  return (
    <div className="flex justify-between items-center w-full max-w-5xl mx-auto py-12 px-4 overflow-x-auto min-h-[600px]">
      {stages.map((stage, stageIndex) => (
        <div key={stage} className="flex flex-col justify-around h-full gap-8 relative">
          <h3 className="text-center text-xs font-display font-bold text-esports-cyan tracking-[0.3em] mb-4 uppercase">
            {stage}
          </h3>
          
          <div className="flex flex-col justify-around flex-grow gap-12">
            {matches
              .filter(m => m.stage === stage)
              .map((match, matchIndex) => (
                <div key={match.id} className="relative flex items-center">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: matchIndex * 0.1 }}
                  >
                    <MatchCard match={match} teams={teams} />
                  </motion.div>

                  {/* Connector Lines */}
                  {stage !== 'FINALS' && (
                    <div className="absolute left-full w-12 h-full flex items-center">
                      <div className={`h-[2px] w-full bg-white/20 relative ${match.winnerId ? 'bg-esports-neon shadow-[0_0_10px_#39ff14]' : ''}`}>
                        {/* Vertical part of the connector */}
                        <div 
                          className={`absolute right-0 w-[2px] bg-white/20 ${match.winnerId ? 'bg-esports-neon shadow-[0_0_10px_#39ff14]' : ''}`}
                          style={{
                            height: stage === 'QUARTER-FINALS' ? '80px' : '160px',
                            top: matchIndex % 2 === 0 ? '0' : 'auto',
                            bottom: matchIndex % 2 === 0 ? 'auto' : '0',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
