import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Activity, AlertTriangle, BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';

const subjectMastery = [
  { subject: 'DWS', mastery: 90, fullMark: 100 },
  { subject: 'SE&T', mastery: 85, fullMark: 100 },
  { subject: 'Python', mastery: 40, fullMark: 100 }, // Weak subject
  { subject: 'BI', mastery: 75, fullMark: 100 },
];

const focusData = [
  { time: '9am', focus: 80 },
  { time: '10am', focus: 95 },
  { time: '11am', focus: 60 },
  { time: '12pm', focus: 40 },
  { time: '1pm', focus: 85 },
];

export default function Analytics() {
  const [showRecoveryPlan, setShowRecoveryPlan] = useState(false);
  const [liveFocus, setLiveFocus] = useState([
    { time: '9am', focus: 80 },
    { time: '10am', focus: 95 },
    { time: '11am', focus: 60 },
    { time: '12pm', focus: 40 },
    { time: 'Now', focus: 75 },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFocus(prev => {
        const newData = [...prev];
        const now = newData[newData.length - 1];
        // Simulate jitter/real-time focus monitoring
        const jitter = Math.floor(Math.random() * 11) - 5; // -5 to +5
        now.focus = Math.max(20, Math.min(100, now.focus + jitter));
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const recoverySteps = [
    'Review object-oriented principles and classes for 15 minutes.',
    'Complete the Python Foundations study pack.',
    'Take one adaptive Python quiz and revisit missed questions.',
    'Build a small automation script using Python modules.'
  ];

  const handleStudyPackClick = () => {
    localStorage.setItem('recommendedStudyPack', 'python-foundations');
    navigate('/study-packs?recommended=python-foundations');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Focus</h1>
        <p className="text-slate-400 mt-1">Parental Dashboard & Deep Performance Insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Subject Detection */}
        <div className="glass-card p-6 rounded-2xl border-red-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" /> Weak Subject Alert
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
            <h3 className="font-bold text-red-400 text-lg">Python</h3>
            <p className="text-slate-300 text-sm mt-1">Mastery dropped to 40%. AI recommends downloading the 'Python Foundations' Study Pack.</p>
            <button
              type="button"
              onClick={() => setShowRecoveryPlan(true)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              {showRecoveryPlan ? 'Recovery Plan Ready' : 'Generate Recovery Plan'}
            </button>
          </div>

          {showRecoveryPlan && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Python Recovery Plan</h3>
              </div>
              <div className="space-y-3">
                {recoverySteps.map((step, index) => (
                  <div key={step} className="flex gap-3 text-sm text-slate-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-300">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleStudyPackClick}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon-blue px-4 py-2 text-sm font-semibold text-white hover:bg-neon-blue/90 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Open Python Kit
                </button>
                <button 
                  onClick={() => navigate('/quiz')}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-all"
                >
                  Start Python Quiz
                </button>
              </div>
            </div>
          )}

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectMastery}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Mastery" dataKey="mastery" stroke="var(--color-neon-blue)" fill="var(--color-neon-blue)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focus Monitoring */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
              <Activity className="w-5 h-5" /> Focus Monitoring
            </h2>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">Live</span>
          </div>
          <p className="text-sm text-slate-400 mb-6">Real-time attention tracking via webcam/mouse activity heuristics.</p>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveFocus}>
                <XAxis dataKey="time" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="focus" fill="var(--color-emerald-400)" radius={[4, 4, 0, 0]}>
                  {
                    liveFocus.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.focus < 50 ? '#ef4444' : '#34d399'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-white/5 rounded-lg flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-neon-purple mt-0.5" />
            <p className="text-sm text-slate-300">Focus usually drops around 12pm. Smart Scheduler will automatically propose breaks during this time tomorrow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
