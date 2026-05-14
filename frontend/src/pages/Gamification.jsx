import { useState, useEffect } from 'react';
import { Trophy, Star, Medal, Crown, Shield, Zap } from 'lucide-react';

const badges = [
  { name: 'Quantum Leap', desc: 'Aced 5 Physics tests in a row', icon: Zap, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
  { name: 'Unbreakable', desc: '30 day study streak', icon: Shield, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'Math Genius', desc: 'Top 1% in Algebra', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { name: 'Night Owl', desc: 'Studied past midnight 10 times', icon: Crown, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
];

export default function Gamification() {
  const [currentUserName, setCurrentUserName] = useState('Alex Student');
  const [currentXP, setCurrentXP] = useState(14890);
  const [currentLevel, setCurrentLevel] = useState(42);

  useEffect(() => {
    const storedCustomName = localStorage.getItem('customName');
    const email = localStorage.getItem('email') || '';
    const xp = parseInt(localStorage.getItem('xp') || '0');

    const name = storedCustomName || (email ? email.split('@')[0].replace(/\b\w/g, (c) => c.toUpperCase()) : 'Alex Student');
    setCurrentUserName(name);
    setCurrentXP(xp || 14890);
    setCurrentLevel(Math.floor((xp || 14890) / 100) + 1);
  }, []);

  const leaderboardData = [
    { rank: 1, name: 'Sarah J.', xp: 15420, level: 45, isCurrentUser: false },
    { rank: 2, name: currentUserName, xp: currentXP, level: currentLevel, isCurrentUser: true },
    { rank: 3, name: 'Michael K.', xp: 14100, level: 40, isCurrentUser: false },
    { rank: 4, name: 'Emma T.', xp: 13500, level: 38, isCurrentUser: false },
    { rank: 5, name: 'David L.', xp: 12900, level: 35, isCurrentUser: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gamification & Rewards</h1>
          <p className="text-slate-400 mt-1">Earn XP, collect badges, and climb the global leaderboard.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 rounded-2xl flex flex-col items-center border-orange-500/30">
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Total XP</span>
            <span className="text-2xl font-black text-orange-400 tracking-tight">{currentXP.toLocaleString()}</span>
          </div>
          <div className="glass-panel px-6 py-3 rounded-2xl flex flex-col items-center border-neon-blue/30">
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Level</span>
            <span className="text-2xl font-black text-neon-blue tracking-tight">42</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" /> Global Leaderboard
          </h2>

          <div className="space-y-3">
            {leaderboardData.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${user.isCurrentUser
                  ? 'bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border-neon-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.2)]'
                  : 'bg-dark-surface/50 border-white/5 hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.rank === 1 ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]' :
                    user.rank === 2 ? 'bg-slate-300 text-black' :
                      user.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-white/10 text-slate-300'
                    }`}>
                    {user.rank}
                  </div>
                  <div>
                    <h3 className={`font-bold ${user.isCurrentUser ? 'text-white' : 'text-slate-300'}`}>
                      {user.name} {user.isCurrentUser && '(You)'}
                    </h3>
                    <p className="text-xs text-slate-500">Level {user.level}</p>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-lg text-neon-blue">
                  {user.xp.toLocaleString()} <span className="text-xs text-slate-500 font-sans">XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Medal className="w-6 h-6 text-neon-purple" /> Recent Badges
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${badge.bg}`}>
                    <badge.icon className={`w-7 h-7 ${badge.color}`} />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                  <p className="text-[10px] text-slate-400 leading-tight">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-brand-900/40 to-dark-bg border-brand-500/30 text-center">
            <h3 className="font-bold text-lg mb-2">Next Milestone</h3>
            <p className="text-sm text-slate-400 mb-4">Reach Level 50 to unlock the 'Grandmaster' title and premium avatar frames.</p>
            <div className="w-full bg-dark-bg rounded-full h-3 mb-2 border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-neon-blue to-neon-purple h-full rounded-full w-[85%] relative">
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <p className="text-xs text-right font-mono text-neon-purple">85%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
