import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Target, Brain, Clock, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [displayName, setDisplayName] = useState('Learner');
  const [performanceData, setPerformanceData] = useState([]);
  const [hasProgress, setHasProgress] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('language') || 'EN');
  const [sessionTime, setSessionTime] = useState(0);
  const navigate = useNavigate();

  const translations = {
    EN: {
      welcome: "Welcome back",
      sub: "Start learning to begin tracking your focus, productivity, and XP.",
      stats: ["Focus Score", "AI Productivity", "Study Time", "Current XP"],
      online: "Online",
      no_active: "No active streak yet"
    },
    KN: {
      welcome: "ಮರಳಿ ಸ್ವಾಗತ",
      sub: "ನಿಮ್ಮ ಗಮನ, ಉತ್ಪಾದಕತೆ ಮತ್ತು XP ಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ.",
      stats: ["ಗಮನ ಸ್ಕೋರ್", "AI ಉತ್ಪಾದಕತೆ", "ಅಧ್ಯಯನ ಸಮಯ", "ಪ್ರಸ್ತುತ XP"],
      online: "ಆನ್‌ಲೈನ್",
      no_active: "ಇನ್ನೂ ಯಾವುದೇ ಸಕ್ರಿಯ ಸ್ಟ್ರೀಕ್ ಇಲ್ಲ"
    }
  };

  useEffect(() => {
    // Language listener
    const handleLangChange = () => setLang(localStorage.getItem('language') || 'EN');
    window.addEventListener('languageChange', handleLangChange);

    // Live timer & Live Chart update
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setPerformanceData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        // Simulate lively graph movement (focus score increases with study time)
        last.score = Math.min(100, 50 + Math.floor(xp / 10) + Math.floor(sessionTime / 60));
        return newData;
      });
    }, 1000);

    const email = localStorage.getItem('email') || '';
    const storedCustomName = localStorage.getItem('customName');
    if (email) {
      const name = email.split('@')[0].replace(/\b\w/g, (c) => c.toUpperCase());
      setDisplayName(storedCustomName || name);
    }

    // Load or initialize performance data
    let storedData = localStorage.getItem('performanceData');
    if (!storedData) {
      const defaultData = [
        { day: 'Mon', score: 65 }, { day: 'Tue', score: 72 }, { day: 'Wed', score: 68 },
        { day: 'Thu', score: 85 }, { day: 'Fri', score: 82 }, { day: 'Sat', score: 90 }, { day: 'Sun', score: 50 },
      ];
      localStorage.setItem('performanceData', JSON.stringify(defaultData));
      storedData = JSON.stringify(defaultData);
    }

    let data = JSON.parse(storedData);
    const xp = parseInt(localStorage.getItem('xp') || '0');
    const todayScore = Math.min(100, 50 + Math.floor(xp / 10));
    data[data.length - 1].score = todayScore;
    setHasProgress(xp > 0);
    setPerformanceData(data);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      clearInterval(interval);
    };
  }, []);

  const formatSessionTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };

  const t = translations[lang];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.welcome}, <span className="text-gradient">{displayName}</span></h1>
          <p className="text-slate-400 mt-1">{t.sub}</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-500/30">
            <Flame className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-300">{t.no_active}</span>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Target, label: t.stats[0], value: '78/100', color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
          { icon: Brain, label: t.stats[1], value: 'High', color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
          { icon: Clock, label: t.stats[2], value: formatSessionTime(sessionTime), color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { icon: Flame, label: t.stats[3], value: localStorage.getItem('xp') || '0', color: 'text-orange-400', bg: 'bg-orange-400/10' },
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

        {/* Main Chart - Always Visible */}
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
                    <stop offset="5%" stopColor="var(--color-neon-purple)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-neon-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
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
            {(() => {
              const progress = JSON.parse(localStorage.getItem('neuroPathProgress') || '{}');
              const subjects = Object.values(progress);
              const lagging = subjects.filter(s => s.status === 'lagging');
              
              const defaultSuggestions = [
                { title: 'Data Structures Practice', reason: 'Common interview topic' },
                { title: 'Mobile UI Optimization', reason: 'Next module in Dynamic Websites' },
                { title: 'SQL Query Optimization', reason: 'Based on your Database interest' },
                { title: 'Agile Workflow Simulation', reason: 'Practical Software Engineering' },
                { title: 'Java Stream API', reason: 'Advanced programming concept' },
                { title: 'Cybersecurity Basics', reason: 'Critical for web developers' },
                { title: 'Cloud Deployment', reason: 'Modern architecture trend' }
              ];

              // Combine lagging subjects with default suggestions to always show 5
              const items = [];
              lagging.forEach(s => items.push({ title: `Review ${s.title}`, reason: `Struggling with Level ${s.highestLevel + 1}`, status: 'lagging' }));
              
              const remaining = 5 - items.length;
              if (remaining > 0) {
                // Add default suggestions that aren't already in lagging
                defaultSuggestions.slice(0, remaining).forEach(d => items.push(d));
              }

              return items.map((rec, i) => (
                <div key={i} className={`p-4 rounded-xl border transition-colors cursor-pointer group ${
                  rec.status === 'lagging' ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}>
                  <h3 className={`font-semibold ${rec.status === 'lagging' ? 'text-red-400' : 'text-white group-hover:text-neon-blue'}`}>{rec.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{rec.reason}</p>
                </div>
              ));
            })()}
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-neon-purple text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            AI Adaptive Quiz <ChevronRight className="w-4 h-4" />
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
