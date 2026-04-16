import React from 'react';
import { motion } from 'motion/react';
import { Bracket } from './components/Bracket';
import { Leaderboard } from './components/Leaderboard';
import { useTournament } from './TournamentContext';
import { Gamepad2, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const { teams, matches } = useTournament();

  return (
    <div className="min-h-screen relative pb-24">
      {/* Background Waves */}
      <div className="wave-bg">
        <div className="wave"></div>
        <div className="wave wave-2"></div>
      </div>

      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-esports-cyan/10 border border-esports-cyan/30 px-4 py-1 rounded-full mb-4"
        >
          <Zap className="w-4 h-4 text-esports-cyan animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.4em] text-esports-cyan uppercase">Qualifier 2026</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-2"
        >
          Exam Gap <span className="text-esports-cyan">Tournament</span>
        </motion.h1>
        
        <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
          Great Games Championship • Professional Circuit
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Bracket Section */}
        <section className="lg:col-span-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-esports-cyan p-2 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-esports-blue" />
              </div>
              <h2 className="text-xl font-display font-bold uppercase tracking-wide">Tournament Bracket</h2>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-esports-neon"></div>
                <span>Live</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-esports-yellow"></div>
                <span>Finals</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Bracket matches={matches} teams={teams} />
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="lg:col-span-4">
          <Leaderboard teams={teams} />
        </section>
      </main>

      {/* Footer Decoration */}
      <footer className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-esports-cyan to-transparent opacity-50"></footer>
    </div>
  );
};
