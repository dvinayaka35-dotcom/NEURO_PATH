import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Scheduler() {
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('studySessions');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Physics Focus', time: '10:00 AM', duration: '45m', completed: false },
            { id: 2, title: 'Maths Mastery', time: '02:30 PM', duration: '60m', completed: false }
        ];
    });
    const [isRecommending, setIsRecommending] = useState(false);

    useEffect(() => {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
    }, [sessions]);

    const getAIRecommendation = async () => {
        setIsRecommending(true);
        try {
            // Fetch real progress from the Quiz module
            const progress = JSON.parse(localStorage.getItem('neuroPathProgress') || '{}');
            const laggingSubjects = Object.keys(progress).filter(id => progress[id].status === 'lagging');
            
            let recommended;
            let status = 'recommended';

            if (laggingSubjects.length > 0) {
                // Prioritize subjects the student is failing
                const subId = laggingSubjects[0];
                recommended = `RECOVERY: ${progress[subId].title}`;
                status = 'critical';
            } else {
                // Suggest a new subject from the curriculum
                const curriculum = ['Java Programming', 'Dynamic Websites', 'Software Engineering', 'Business Intelligence'];
                recommended = `ADVANCED: ${curriculum[Math.floor(Math.random() * curriculum.length)]}`;
            }
            
            const newSession = {
                id: Date.now(),
                title: recommended,
                time: '05:00 PM',
                duration: '45m',
                completed: false,
                status: status // Track if it's a lagging subject
            };
            setSessions([...sessions, newSession]);
        } finally {
            setIsRecommending(false);
        }
    };

    const addSession = () => {
        const title = prompt("Enter Study Topic:", "Biology Revision");
        if (!title) return;

        const newSession = {
            id: Date.now(),
            title: title,
            time: '04:00 PM',
            duration: '30m',
            completed: false
        };
        setSessions([...sessions, newSession]);
    };

    const deleteSession = (id) => {
        setSessions(sessions.filter(s => s.id !== id));
    };

    const toggleComplete = (id) => {
        setSessions(sessions.map(s => 
            s.id === id ? { ...s, completed: !s.completed } : s
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Smart Scheduler</h1>
                    <p className="text-slate-400 mt-1">Manage your weekly learning routine with AI-optimized intervals.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={getAIRecommendation}
                        disabled={isRecommending}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-neon-blue font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        {isRecommending ? 'Thinking...' : 'AI Suggestion'}
                    </button>
                    <button 
                        onClick={addSession}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all"
                    >
                        <Plus className="w-5 h-5" /> Quick Schedule
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Session List */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {sessions.map((session) => (
                            <motion.div 
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`glass-card p-5 rounded-3xl border flex items-center justify-between group transition-all ${
                                    session.status === 'critical' ? 'border-red-500/50 bg-red-500/10' :
                                    session.completed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => toggleComplete(session.id)}
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                                            session.completed ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                        }`}
                                    >
                                        <CheckCircle2 className="w-6 h-6" />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-bold transition-all ${session.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                {session.title}
                                            </h3>
                                            {session.status === 'critical' && (
                                                <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                    Lagging
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                                            <span>•</span>
                                            <span>{session.duration} Duration</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteSession(session.id)}
                                    className="opacity-0 group-hover:opacity-100 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {sessions.length === 0 && (
                        <div className="text-center py-20 glass-card rounded-3xl border border-white/5 border-dashed">
                            <CalendarDays className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No sessions scheduled for today.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl border border-white/10">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-neon-blue" /> Stats
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total Time</p>
                                <p className="text-2xl font-bold text-white">1h 45m</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Completion Rate</p>
                                <p className="text-2xl font-bold text-emerald-400">85%</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-neon-purple/20 bg-neon-purple/5">
                        <h2 className="font-bold mb-2">AI Tip</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Based on your morning focus levels, scheduling Physics at 10:00 AM is optimal for retention.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
