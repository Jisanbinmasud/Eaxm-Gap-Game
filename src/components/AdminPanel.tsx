import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Plus, Trophy, X, Trash2, Edit2, Check, Save, Users } from 'lucide-react';
import { Team, Match } from '../types';

interface AdminPanelProps {
  teams: Team[];
  matches: Match[];
  onAdvance: (matchId: string, winnerId: string) => void;
  onAddPoints: (teamId: string, points: number) => void;
  onAddTeam: (name: string, logo: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onEditTeam: (teamId: string, name: string, logo: string) => void;
  onUpdateMatchTeams: (matchId: string, team1Id: string | null, team2Id: string | null) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  teams, 
  matches, 
  onAdvance, 
  onAddPoints,
  onAddTeam,
  onDeleteTeam,
  onEditTeam,
  onUpdateMatchTeams
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bracket' | 'teams' | 'add-team' | 'match-editor'>('bracket');
  const [pointInputs, setPointInputs] = useState<Record<string, string>>({});
  const [newTeam, setNewTeam] = useState({ name: '', logo: '🎮' });
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', logo: '' });

  const handlePointChange = (teamId: string, value: string) => {
    setPointInputs(prev => ({ ...prev, [teamId]: value }));
  };

  const submitPoints = (teamId: string) => {
    const points = parseInt(pointInputs[teamId]);
    if (!isNaN(points)) {
      onAddPoints(teamId, points);
      setPointInputs(prev => ({ ...prev, [teamId]: '' }));
    }
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeam.name.trim()) {
      onAddTeam(newTeam.name, newTeam.logo);
      setNewTeam({ name: '', logo: '🎮' });
      setActiveTab('teams');
    }
  };

  const startEditing = (team: Team) => {
    setEditingTeamId(team.id);
    setEditForm({ name: team.name, logo: team.logo });
  };

  const saveEdit = (teamId: string) => {
    onEditTeam(teamId, editForm.name, editForm.logo);
    setEditingTeamId(null);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-esports-cyan text-esports-blue p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      >
        {isOpen ? <X /> : <Settings />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 left-0 w-[400px] bg-esports-blue border border-white/20 rounded-2xl shadow-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-esports-cyan" />
                Admin Panel
              </h3>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg overflow-x-auto custom-scrollbar">
              {(['bracket', 'match-editor', 'teams', 'add-team'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-3 py-2 text-[9px] font-bold uppercase tracking-widest rounded transition-colors ${
                    activeTab === tab ? 'bg-esports-cyan text-esports-blue' : 'hover:bg-white/10 text-white/60'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'bracket' && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Advance Bracket</h4>
                  <div className="space-y-3">
                    {matches.filter(m => m.team1Id && m.team2Id && !m.winnerId).map(match => {
                      const t1 = teams.find(t => t.id === match.team1Id);
                      const t2 = teams.find(t => t.id === match.team2Id);
                      return (
                        <div key={match.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                          <p className="text-[10px] text-esports-cyan font-bold mb-2 uppercase">{match.stage}</p>
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => onAdvance(match.id, t1!.id)}
                              className="flex-1 text-[10px] font-bold bg-white/10 hover:bg-esports-neon hover:text-black py-2 rounded transition-colors truncate"
                            >
                              {t1?.name}
                            </button>
                            <span className="text-[10px] font-bold opacity-30">VS</span>
                            <button
                              onClick={() => onAdvance(match.id, t2!.id)}
                              className="flex-1 text-[10px] font-bold bg-white/10 hover:bg-esports-neon hover:text-black py-2 rounded transition-colors truncate"
                            >
                              {t2?.name}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {matches.filter(m => m.team1Id && m.team2Id && !m.winnerId).length === 0 && (
                      <p className="text-xs text-white/30 italic">No active matches to advance</p>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'match-editor' && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Match Setup</h4>
                  <div className="space-y-4">
                    {matches.map(match => (
                      <div key={match.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold text-esports-cyan uppercase tracking-wider">{match.stage}</span>
                          <span className="text-[9px] text-white/30">ID: {match.id}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {/* Team 1 Selector */}
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase text-white/40">Team 1</label>
                            <select
                              value={match.team1Id || ''}
                              onChange={(e) => onUpdateMatchTeams(match.id, e.target.value || null, match.team2Id)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-esports-cyan"
                            >
                              <option value="">Select Team...</option>
                              {teams.map(t => (
                                <option key={t.id} value={t.id}>{t.logo} {t.name}</option>
                              ))}
                            </select>
                          </div>
                          {/* Team 2 Selector */}
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase text-white/40">Team 2</label>
                            <select
                              value={match.team2Id || ''}
                              onChange={(e) => onUpdateMatchTeams(match.id, match.team1Id, e.target.value || null)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-esports-cyan"
                            >
                              <option value="">Select Team...</option>
                              {teams.map(t => (
                                <option key={t.id} value={t.id}>{t.logo} {t.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {match.winnerId && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[9px] text-esports-neon font-bold uppercase">Winner: {teams.find(t => t.id === match.winnerId)?.name}</span>
                            <button 
                              onClick={() => onUpdateMatchTeams(match.id, match.team1Id, match.team2Id)}
                              className="text-[9px] text-white/40 hover:text-white underline"
                            >
                              Reset Winner
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'teams' && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Manage Teams</h4>
                  <div className="space-y-3">
                    {teams.map(team => (
                      <div key={team.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                        {editingTeamId === team.id ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editForm.logo}
                                onChange={e => setEditForm({ ...editForm, logo: e.target.value })}
                                className="w-12 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-center"
                              />
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingTeamId(null)} className="p-1 text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                              <button onClick={() => saveEdit(team.id)} className="p-1 text-esports-neon hover:scale-110"><Check className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{team.logo}</span>
                              <span className="text-sm font-bold">{team.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => startEditing(team)} className="p-1 text-white/40 hover:text-esports-cyan transition-colors"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => onDeleteTeam(team.id)} className="p-1 text-white/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Add points..."
                            value={pointInputs[team.id] || ''}
                            onChange={e => handlePointChange(team.id, e.target.value)}
                            className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1 text-xs focus:outline-none focus:border-esports-cyan"
                          />
                          <button
                            onClick={() => submitPoints(team.id)}
                            className="bg-esports-cyan/20 text-esports-cyan hover:bg-esports-cyan hover:text-esports-blue p-1.5 rounded transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'add-team' && (
                <section>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">New Team</h4>
                  <form onSubmit={handleAddTeamSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-white/40 block mb-1">Team Name</label>
                      <input
                        type="text"
                        required
                        value={newTeam.name}
                        onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-esports-cyan"
                        placeholder="Enter team name..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-white/40 block mb-1">Logo / Emoji</label>
                      <input
                        type="text"
                        value={newTeam.logo}
                        onChange={e => setNewTeam({ ...newTeam, logo: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-esports-cyan"
                        placeholder="Enter emoji..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-esports-cyan text-esports-blue font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Team
                    </button>
                  </form>
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
