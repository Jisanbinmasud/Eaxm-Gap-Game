import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminPanel } from './components/AdminPanel';
import { useTournament } from './TournamentContext';
import { Trophy, LogIn, LogOut, User, ShieldAlert } from 'lucide-react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export const AdminPage: React.FC = () => {
  const { 
    teams, matches, user, isAdmin, isAuthReady,
    handleAdvance, handleAddPoints, handleAddTeam, handleDeleteTeam, handleEditTeam, handleUpdateMatchTeams 
  } = useTournament();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (!isAuthReady) return null;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6">
      {/* Background Waves */}
      <div className="wave-bg">
        <div className="wave"></div>
        <div className="wave wave-2"></div>
      </div>

      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div 
            key="login-prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-3xl max-w-md w-full text-center"
          >
            <ShieldAlert className="w-16 h-16 text-esports-cyan mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold mb-4 uppercase">Admin Access</h2>
            <p className="text-white/60 mb-8">Authorized personnel only. Please sign in to access the tournament controls.</p>
            <button 
              onClick={handleLogin}
              className="w-full bg-esports-cyan text-esports-blue font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 text-lg"
            >
              <LogIn className="w-5 h-5" />
              Sign in with Google
            </button>
          </motion.div>
        ) : !isAdmin ? (
          <motion.div 
            key="unauthorized"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-3xl max-w-md w-full text-center"
          >
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold mb-4 uppercase text-red-500">Access Denied</h2>
            <p className="text-white/60 mb-8">Your account ({user.email}) does not have administrator privileges.</p>
            <button 
              onClick={handleLogout}
              className="w-full bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="admin-controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-3xl text-center">
              <Trophy className="w-16 h-16 text-esports-yellow mx-auto mb-6" />
              <h2 className="text-4xl font-display font-bold mb-2 uppercase">Admin Dashboard</h2>
              <p className="text-esports-cyan font-bold tracking-widest uppercase text-xs mb-8">Welcome back, {user.displayName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="text-esports-cyan font-bold uppercase text-sm mb-2">Tournament Status</h4>
                  <p className="text-white/60 text-sm">Teams: {teams.length}</p>
                  <p className="text-white/60 text-sm">Matches: {matches.length}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="text-esports-cyan font-bold uppercase text-sm mb-2">Active Admin</h4>
                  <p className="text-white/60 text-sm">{user.email}</p>
                  <button onClick={handleLogout} className="text-red-400 text-xs mt-2 hover:underline">Logout</button>
                </div>
              </div>

              <p className="mt-12 text-white/40 text-sm italic">Use the floating action button in the bottom left to manage the tournament.</p>
            </div>

            <AdminPanel 
              teams={teams} 
              matches={matches} 
              onAdvance={handleAdvance} 
              onAddPoints={handleAddPoints}
              onAddTeam={handleAddTeam}
              onDeleteTeam={handleDeleteTeam}
              onEditTeam={handleEditTeam}
              onUpdateMatchTeams={handleUpdateMatchTeams}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
