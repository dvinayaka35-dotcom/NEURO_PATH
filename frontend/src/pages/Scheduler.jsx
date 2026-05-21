import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Clock, Trash2, CheckCircle2, AlertTriangle, Brain, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Scheduler() {
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('studySessions');
        return saved ? JSON.parse(saved) : [];
    });
    const [isRecommending, setIsRecommending] = useState(false);
    const [missedAlert, setMissedAlert] = useState(null);

    useEffect(() => {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        
        // Check for missed sessions every minute
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            sessions.forEach(s => {
                if (!s.completed) {
                    const [timeStr, ampm] = s.time.split(' ');
                    let [hours, mins] = timeStr.split(':').map(Number);
                    if (ampm === 'PM' && hours !== 12) hours += 12;
                    if (ampm === 'AM' && hours === 12) hours = 0;
                    
                    const sessionMinutes = hours * 60 + mins;
                    // If session started more than 5 minutes ago and not completed
                    if (currentTime > (sessionMinutes + 5)) {
                        setMissedAlert(`Attention! You missed your "${s.title}" session scheduled for ${s.time}.`);
                    }
                }
            });
        }, 60000);

        return () => clearInterval(interval);
    }, [sessions]);

    const generateAITimetable = () => {
        setIsRecommending(true);
        setTimeout(() => {
            const progress = JSON.parse(localStorage.getItem('neuroPathProgress') || '{}');
            const subjects = Object.values(progress);
            const lagging = subjects.filter(s => s.status === 'lagging');
            const learning = subjects.filter(s => s.status !== 'lagging');
            
            const curriculum = [
                { id: 'java_programming', title: 'Java Programming' },
                { id: 'dynamic_websites', title: 'Dynamic Websites' },
                { id: 'software_engineering', title: 'Software Engineering' },
                { id: 'business_intelligence', title: 'Business Intelligence' }
            ].filter(c => !subjects.find(s => s.id === c.id));

            const allPossible = [...lagging, ...learning, ...curriculum];
            
            const times = [
                { t: '09:00 AM', d: '90m' },
                { t: '11:00 AM', d: '60m' },
                { t: '02:00 PM', d: '90m' },
                { t: '04:00 PM', d: '60m' }
            ];

            const newSessions = times.map((slot, i) => {
                const sub = allPossible[i % allPossible.length] || allPossible[0] || { title: 'General Revision' };
                return {
                    id: Date.now() + i,
                    title: sub.status === 'lagging' ? `RECOVERY: ${sub.title}` : `STUDY: ${sub.title}`,
                    time: slot.t,
                    duration: slot.d,
                    completed: false,
                    status: sub.status === 'lagging' ? 'critical' : 'normal'
                };
            });

            setSessions(newSessions);
            setIsRecommending(false);
        }, 1000);
    };

    const addSession = () => {
        const title = prompt("Enter Study Topic:", "Biology Revision");
        if (!title) return;
        const newSession = { id: Date.now(), title, time: '04:00 PM', duration: '30m', completed: false };
        setSessions([...sessions, newSession]);
    };

    const deleteSession = (id) => setSessions(sessions.filter(s => s.id !== id));

    const toggleComplete = (id) => {
        setSessions(sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
        if (missedAlert) setMissedAlert(null);
    };

    return (
        <div className="space-y-6">
            {missedAlert && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-4 bg-red-500 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-red-500/20"
                >
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5" />
                        <p className="text-sm font-bold">{missedAlert}</p>
                    </div>
                    <button onClick={() => setMissedAlert(null)} className="text-xs font-black uppercase hover:underline">Dismiss</button>
                </motion.div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Smart Scheduler</h1>
                    <p className="text-slate-400 mt-1">Manage your routine with AI Adaptive Quiz insights.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={generateAITimetable}
                        disabled={isRecommending}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-neon-blue font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        <Brain className="w-5 h-5" /> {isRecommending ? 'Generating...' : 'AI Timetable'}
                    </button>
                    <button 
                        onClick={addSession}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all"
                    >
                        <Plus className="w-5 h-5" /> Manual Slot
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {sessions.map((session) => (
                            <motion.div 
                                key={session.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
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
                                                <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-glow-red">
                                                    Lagging
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">
                                            <span className="flex items-center gap-1 text-neon-blue"><Clock className="w-3 h-3" /> {session.time}</span>
                                            <span className="text-slate-700">|</span>
                                            <span>{session.duration} Study Window</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => deleteSession(session.id)} className="opacity-0 group-hover:opacity-100 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {sessions.length === 0 && (
                        <div className="text-center py-20 glass-card rounded-3xl border border-white/5 border-dashed">
                            <CalendarDays className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Click "AI Timetable" to generate your plan based on Quiz progress.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl border border-white/10">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-neon-blue" /> Adaptive Sync
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            The scheduler is actively monitoring your <b>AI Adaptive Quiz</b> performance. Lagging subjects are automatically injected into high-focus morning slots.
                        </p>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Target Intensity</p>
                                <p className="text-xl font-bold text-white">Dynamic AI Mode</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
