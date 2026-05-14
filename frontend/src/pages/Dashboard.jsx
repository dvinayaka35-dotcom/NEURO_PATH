import { Flame, Target, Brain, Clock, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 85 },
  { day: 'Fri', score: 82 },
  { day: 'Sat', score: 90 },
  { day: 'Sun', score: 95 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, <span className="text-gradient">Alex</span></h1>
          <p className="text-slate-400 mt-1">Your AI Productivity Score is up 12% this week!</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-orange-500/30">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-500">14 Day Streak</span>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Focus Score', value: '92/100', color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
          { icon: Brain, label: 'AI Productivity', value: 'High', color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
          { icon: Clock, label: 'Study Time', value: '4h 20m', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { icon: Flame, label: 'Current XP', value: '2,450', color: 'text-orange-400', bg: 'bg-orange-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Real-time Performance</h2>
            <select className="bg-dark-surface border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-neon-purple)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-neon-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--color-neon-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <SparklesIcon /> AI Recommendations
          </h2>
          <div className="flex-1 space-y-4">
            {[
              { title: 'Review Calculus Ch. 4', reason: 'Weak subject detected' },
              { title: 'Take a 15m Break', reason: 'Focus dropping slightly' },
              { title: 'Daily Physics Quiz', reason: 'Maintain your streak' }
            ].map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors">{rec.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{rec.reason}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-neon-purple text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            Start Smart Study <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}
