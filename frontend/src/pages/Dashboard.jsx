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

  const [recMode, setRecMode] = useState('projects'); // projects or qa
  const [selectedProject, setSelectedProject] = useState(null);

  const subjectProjects = {
    java_programming: [
      { 
        title: 'AI-Powered Smart ATM', 
        reason: 'Java OOP + AI Integration',
        brief: 'Build a secure ATM system using Java that uses facial recognition for authentication. Focus on Encapsulation for account security and Multithreading for handling concurrent transactions.'
      },
      { 
        title: 'Secure Blockchain Ledger', 
        reason: 'Advanced Data Structures',
        brief: 'Create a decentralized transaction ledger using Linked Lists and Hashing. Implement a Proof-of-Work algorithm to ensure data integrity across nodes.'
      },
      { 
        title: 'Predictive Inventory System', 
        reason: 'File I/O + Analytics',
        brief: 'Develop a system that predicts stock shortages using historical data stored in flat files. Focus on Java Collections Framework for efficient data manipulation.'
      },
      { 
        title: 'Multithreaded Chat Server', 
        reason: 'Networking & Concurrency',
        brief: 'Construct a high-performance chat server using Socket Programming. Implement thread pools to handle hundreds of simultaneous client connections without lag.'
      },
      { 
        title: 'Biometric Attendance App', 
        reason: 'Java Swing + External APIs',
        brief: 'A desktop application for schools that integrates fingerprint APIs. Use Java Swing for the UI and SQLite for local data persistence.'
      }
    ],
    dynamic_websites: [
      { 
        title: 'NeuroPath Learning Hub', 
        reason: 'Full-stack React/Node.js',
        brief: 'A modern EdTech dashboard featuring real-time progress tracking, video streaming, and an AI-driven course recommendation engine using React.'
      },
      { 
        title: 'Eco-Track Dashboard', 
        reason: 'D3.js Visualization',
        brief: 'Visualize environmental data using D3.js. Create interactive maps and charts that track carbon footprints and renewable energy trends across regions.'
      },
      { 
        title: 'P2P Marketplace Platform', 
        reason: 'Real-time WebSockets',
        brief: 'Build a marketplace where users can buy/sell items. Implement real-time notifications and chat using Socket.io and Node.js.'
      },
      { 
        title: 'AR Portfolio Gallery', 
        reason: 'Web Graphics & Responsive Design',
        brief: 'A portfolio site using Three.js to display 3D models of your projects. Ensure perfect responsiveness using CSS Grid and Flexbox.'
      },
      { 
        title: 'Serverless SaaS Starter', 
        reason: 'Cloud Functions & NoSQL',
        brief: 'A boilerplate for SaaS apps using AWS Lambda or Firebase. Implement secure authentication and subscription-based access control.'
      }
    ],
    software_engineering: [
      { 
        title: 'Automated Test Suite Engine', 
        reason: 'QA & Unit Testing',
        brief: 'A framework that automatically runs test cases and generates HTML reports. Focus on JUnit integration and Defect Tracking metrics.'
      },
      { 
        title: 'Agile Kanban Visualizer', 
        reason: 'SDLC Workflow Management',
        brief: 'A drag-and-drop board for tracking Agile sprints. Implement features like Burndown charts and automated task assignments.'
      },
      { 
        title: 'Vulnerability Scanner', 
        reason: 'Security Engineering',
        brief: 'Develop a tool that scans web headers and common ports for vulnerabilities. Focus on identifying SQL injection and XSS risks.'
      },
      { 
        title: 'CI/CD Pipeline Manager', 
        reason: 'DevOps Automation',
        brief: 'A dashboard to monitor Jenkins or GitHub Action pipelines. Visualize build success rates and deployment logs in real-time.'
      },
      { 
        title: 'Bug Lifecycle Analytics', 
        reason: 'Defect Management',
        brief: 'Extract bug data and visualize the time taken from "New" to "Resolved". Help teams identify bottlenecks in the QA process.'
      }
    ],
    business_intelligence: [
      { 
        title: 'Real-time Sales Forecaster', 
        reason: 'OLAP Cube Processing',
        brief: 'Use historical sales data to predict future trends. Implement multi-dimensional analysis using OLAP concepts and Python/PowerBI.'
      },
      { 
        title: 'Social Media Sentiment AI', 
        reason: 'Data Extraction & NLP',
        brief: 'Extract tweets or posts using APIs and analyze public sentiment. Visualize the results in a real-time BI dashboard.'
      },
      { 
        title: 'Supply Chain ETL Pipeline', 
        reason: 'Data Warehousing',
        brief: 'Build a robust ETL (Extract, Transform, Load) pipeline using Python. Cleanse dirty supplier data and load it into a centralized warehouse.'
      },
      { 
        title: 'Financial Health Monitor', 
        reason: 'KPI Visualization',
        brief: 'Track KPIs like ROI and CAC for a mock business. Create automated PDF reports that summarize monthly financial performance.'
      },
      { 
        title: 'Customer Churn Predictor', 
        reason: 'Predictive Modeling',
        brief: 'Identify customers likely to leave using data extraction techniques. Create a priority list for retention marketing teams.'
      }
    ]
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Always Visible */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Real-time Performance</h2>
              <div className="flex gap-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Live Tracking</span>
              </div>
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

          {/* Student Academic Profile */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-neon-blue" /> Student Academic Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                const progress = JSON.parse(localStorage.getItem('neuroPathProgress') || '{}');
                const defaultSubjects = [
                  { id: 'java_programming', title: 'Java Programming' },
                  { id: 'dynamic_websites', title: 'Dynamic Websites' },
                  { id: 'software_engineering', title: 'Software Engineering' },
                  { id: 'business_intelligence', title: 'Business Intelligence' }
                ];

                return defaultSubjects.map(sub => {
                  const data = progress[sub.id] || { highestLevel: 0, status: 'neutral' };
                  const level = data.highestLevel;
                  const percentage = (level / 5) * 100;
                  
                  return (
                    <div key={sub.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold">{sub.title}</h3>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          data.status === 'lagging' ? 'bg-red-500/20 text-red-400' : 
                          level === 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neon-blue/20 text-neon-blue'
                        }`}>
                          LEVEL {level}/5
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            data.status === 'lagging' ? 'bg-red-500' : 'bg-gradient-to-r from-neon-blue to-neon-purple'
                          }`}
                          style={{ width: `${Math.max(5, percentage)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{data.status === 'lagging' ? 'Needs Review' : 'Progressing'}</span>
                        <span>{Math.round(percentage)}% Mastery</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* AI Recommendations & Innovations */}
        <div className="glass-card p-6 rounded-2xl flex flex-col min-h-[500px]">
          {!selectedProject ? (
            <>
              <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-neon-blue" /> Smart Suggestions
                </h2>
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setRecMode('projects')}
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${recMode === 'projects' ? 'bg-neon-blue text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'text-slate-500 hover:text-white'}`}
                  >
                    PROJECT IDEAS
                  </button>
                  <button 
                    onClick={() => setRecMode('qa')}
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${recMode === 'qa' ? 'bg-neon-purple text-white shadow-[0_0_10px_rgba(176,38,255,0.3)]' : 'text-slate-500 hover:text-white'}`}
                  >
                    PRACTICE Q&A
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {(() => {
                  const progress = JSON.parse(localStorage.getItem('neuroPathProgress') || '{}');
                  const subjects = Object.values(progress);
                  const targetSubject = subjects.find(s => s.status === 'lagging') || subjects[0] || { id: 'java_programming' };
                  
                  if (recMode === 'projects') {
                    const projects = subjectProjects[targetSubject.id] || subjectProjects.java_programming;
                    return projects.map((proj, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedProject(proj)}
                        className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                      >
                        <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors text-sm">{proj.title}</h3>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{proj.reason}</p>
                      </div>
                    ));
                  }

                  // Q&A Mode
                  const defaultQA = [
                    { title: 'Core Syntax Mastery', reason: 'Basic level concepts' },
                    { title: 'Algorithm Efficiency', reason: 'Optimizing performance' },
                    { title: 'System Architecture', reason: 'Structural design patterns' },
                    { title: 'Error Mitigation', reason: 'Robust exception handling' },
                    { title: 'API Integration', reason: 'Connecting external services' }
                  ];
                  return defaultQA.map((qa, i) => (
                    <div key={i} className="p-4 rounded-xl border border-neon-purple/20 bg-neon-purple/5 hover:bg-neon-purple/10 transition-colors cursor-pointer group">
                      <h3 className="font-semibold text-neon-purple text-sm">{qa.title}</h3>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{qa.reason}</p>
                    </div>
                  ));
                })()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col">
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Suggestions
              </button>
              
              <div className="p-6 rounded-2xl bg-neon-blue/5 border border-neon-blue/20 flex-1">
                <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedProject.title}</h3>
                <p className="text-xs text-neon-blue font-bold uppercase tracking-widest mb-6">{selectedProject.reason}</p>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Innovation Brief</h4>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "{selectedProject.brief}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mb-4">Core Competencies Required:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-400">Advanced Logic</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-400">System Design</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/quiz')}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
          >
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
