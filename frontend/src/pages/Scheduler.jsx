import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus, Clock, Trash2, CheckCircle2, AlertTriangle, Brain, Target, ArrowRight, Timer, Lock, Zap, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Scheduler() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('studySessions');
        if (!saved) return [];
        
        // AUTO-MIGRATION: Convert Java sessions to Python
        let parsed = JSON.parse(saved);
        const migrated = parsed.map(s => {
            if (s.title === 'Java Programming' || s.title.toLowerCase().includes('java')) {
                return { ...s, title: 'Python Programming' };
            }
            return s;
        });
        
        if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
            localStorage.setItem('studySessions', JSON.stringify(migrated));
        }
        return migrated;
    });
    const [isRecommending, setIsRecommending] = useState(false);
    const [missedAlert, setMissedAlert] = useState(null);
    const [focusSession, setFocusSession] = useState(null);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [aiContent, setAiContent] = useState('');
    const [loadingContent, setLoadingContent] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        localStorage.setItem('studySessions', JSON.stringify(sessions));

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
                    if (currentTime > (sessionMinutes + 5)) {
                        setMissedAlert(`Attention! You missed your "${s.title}" session.`);
                    }
                }
            });
        }, 60000);

        return () => clearInterval(interval);
    }, [sessions]);

    useEffect(() => {
        if (focusSession) {
            window.dispatchEvent(new CustomEvent('focusModeToggle', { detail: true }));
        } else {
            window.dispatchEvent(new CustomEvent('focusModeToggle', { detail: false }));
        }
    }, [focusSession]);

    // Timer logic for focus mode
    useEffect(() => {
        let timer;
        if (focusSession && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                // Also sync with global study time
                const globalTime = parseInt(localStorage.getItem('totalStudyTime') || '0');
                localStorage.setItem('totalStudyTime', (globalTime + 1).toString());
            }, 1000);
        } else if (timeLeft === 0 && focusSession) {
            endFocusMode();
        }
        return () => clearInterval(timer);
    }, [focusSession, timeLeft]);

    const fetchAiContent = async (topic) => {
        setLoadingContent(true);
        try {
            const response = await api.post('/ai/ask', {
                question: `Provide a DETAILED and EXTENSIVE academic guide on "${topic}". Include introduction, history, core principles, modern applications, and future trends. Make it engaging for a 15-minute reading session.`,
                lang: 'en-US'
            });
            setAiContent(response.data.answer);
        } catch (err) {
            setAiContent(`Welcome to your deep focus session on ${topic}. Research suggests that consistent study in 15-minute bursts significantly improves memory retention.\n\nFocus on the core principles of ${topic} and try to visualize its real-world applications. Take your time to process each concept as you prepare for the upcoming adaptive quiz.`);
        } finally {
            setLoadingContent(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(() => { });
        }
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
    };

    const startFocusMode = (session) => {
        setFocusSession(session);
        setTimeLeft(900); // Reset to 15 mins
        setAiContent('');
        setShowSidebar(true);
        fetchAiContent(session.title);
        enterFullScreen();
    };

    const endFocusMode = (isCompleted = false) => {
        if (isCompleted) {
            // Increase focus score only if session was fully completed
            const currentScore = parseInt(localStorage.getItem('focusScore') || '0');
            localStorage.setItem('focusScore', Math.min(100, currentScore + 10).toString());

            // Mark session as completed
            setSessions(prev => prev.map(s => s.id === focusSession.id ? { ...s, completed: true } : s));
        }

        const completedTopic = focusSession.title;
        setFocusSession(null);
        exitFullScreen();

        localStorage.setItem('scheduledTopic', completedTopic);
        navigate('/quiz');
    };

    const generateAITimetable = () => {
        setIsRecommending(true);
        setTimeout(() => {
            const progress = JSON.parse(localStorage.getItem('neuroPathProgress') || '{}');
            const laggingSubject = Object.values(progress).find(s => s.status === 'lagging');

            const baseSubjects = [
                { id: 'python_programming', title: 'Python Programming' },
                { id: 'dynamic_websites', title: 'Dynamic Websites' },
                { id: 'software_engineering', title: 'Software Engineering' },
                { id: 'business_intelligence', title: 'Business Intelligence' }
            ];

            // If there's a lagging subject, ensure it appears more frequently
            const subjects = laggingSubject
                ? [laggingSubject, ...baseSubjects.filter(s => s.id !== laggingSubject.id)]
                : baseSubjects;

            const times = [{ t: '09:00 AM', d: '15m' }, { t: '11:00 AM', d: '15m' }, { t: '02:00 PM', d: '15m' }, { t: '04:00 PM', d: '15m' }];

            const newSessions = times.map((slot, i) => {
                // Use the prioritized subject for the first and third slots if lagging
                const sub = (laggingSubject && (i === 0 || i === 2))
                    ? laggingSubject
                    : subjects[i % subjects.length];

                return {
                    id: Date.now() + i,
                    title: sub.title || sub.id,
                    time: slot.t,
                    duration: '15m',
                    completed: false,
                    status: (laggingSubject && sub.id === laggingSubject.id) ? 'critical' : 'normal'
                };
            });
            setSessions(newSessions);
            setIsRecommending(false);
        }, 1000);
    };

    const addSession = () => {
        const title = prompt("Enter Study Topic:");
        if (!title) return;
        setSessions([...sessions, { id: Date.now(), title, time: '04:00 PM', duration: '15m', completed: false }]);
    };

    const deleteSession = (id) => setSessions(sessions.filter(s => s.id !== id));

    if (focusSession) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col p-8 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue/5 via-transparent to-transparent opacity-50" />

                {/* Header with Timer */}
                <div className="flex justify-between items-center relative z-10 mb-8 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center cursor-pointer" onClick={() => setShowSidebar(!showSidebar)}>
                            <Brain className="w-6 h-6 text-neon-blue animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">{focusSession.title}</h2>
                            <p className="text-neon-blue text-[10px] font-black tracking-widest uppercase">Deep Focus Reading</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-black text-white tracking-tighter font-mono">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-neon-blue shadow-[0_0_10px_#00f0ff]"
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${(timeLeft / 900) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="px-6 py-3 rounded-xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                {showSidebar ? 'Hide Goals' : 'Show Goals'}
                            </button>
                            <button
                                onClick={() => endFocusMode(false)}
                                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all"
                            >
                                Finish Early
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex gap-8 relative z-10 overflow-hidden">
                    <motion.div
                        layout
                        className={`${showSidebar ? 'lg:w-3/4' : 'w-full'} bg-white/[0.02] rounded-[2rem] border border-white/5 p-10 overflow-y-auto custom-scrollbar transition-all duration-500`}
                    >
                        {loadingContent ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
                                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">AI Generating Study Material...</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose prose-invert max-w-none"
                            >
                                <div className="flex items-center gap-2 text-neon-purple mb-6">
                                    <BookOpen className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-[0.4em]">Resource Material</span>
                                </div>
                                <div className="text-slate-300 text-lg leading-relaxed space-y-8 font-medium">
                                    {aiContent.split('\n').map((para, i) => (
                                        <p key={i} className="first-letter:text-4xl first-letter:font-black first-letter:text-neon-blue first-letter:mr-1">{para}</p>
                                    ))}
                                </div>
                                {timeLeft === 0 && (
                                    <div className="mt-12 p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                        <h3 className="text-2xl font-black text-emerald-400 uppercase italic mb-2">Session Complete!</h3>
                                        <p className="text-slate-400 mb-6">You've earned +10 Focus Score for staying the full 15 minutes.</p>
                                        <button
                                            onClick={() => endFocusMode(true)}
                                            className="px-12 py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest hover:scale-105 transition-all"
                                        >
                                            Collect Reward & Start Quiz
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    <AnimatePresence>
                        {showSidebar && (
                            <motion.div
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                className="w-1/4 space-y-6 hidden lg:block"
                            >
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-neon-blue" /> Study Goals
                                    </h3>
                                    <ul className="space-y-4">
                                        {[
                                            'Analyze Python Indentation Rules',
                                            'Note down core syntax definitions',
                                            'Test small Python snippets in your mind',
                                            'Prepare for Python Adaptive Quiz'
                                        ].map((goal, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[11px] text-slate-400 font-medium leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 flex-shrink-0" />
                                                {goal}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-transparent border border-neon-purple/20">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">Neuro Tip</h3>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                        Python relies on readability. Focus on the "Pythonic" way of writing code to maximize your mastery in the upcoming adaptive quiz.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-between items-center text-[10px] text-slate-700 font-black tracking-[0.5em] uppercase relative z-10">
                    <span>NeuroPath Focus Shield v2.0</span>
                    <span>Tracking Active Learning Session</span>
                </div>
            </motion.div>
        );
    }

    const focusScore = parseInt(localStorage.getItem('focusScore') || '0');

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {missedAlert && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between text-red-500 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5" />
                        <p className="text-sm font-bold uppercase tracking-tight">{missedAlert}</p>
                    </div>
                    <button onClick={() => setMissedAlert(null)} className="text-xs font-black uppercase hover:underline">Dismiss</button>
                </motion.div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neon-blue text-xs font-black uppercase tracking-widest">
                        <Timer className="w-4 h-4" /> Neuro-Scheduler
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Study <span className="text-neon-purple">Routine</span></h1>
                    <p className="text-slate-400 text-sm font-medium">Syncing with your AI Adaptive Quiz performance.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={generateAITimetable}
                        disabled={isRecommending}
                        className="group relative px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:border-neon-blue/50 transition-all disabled:opacity-50 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Brain className={`w-5 h-5 text-neon-blue ${isRecommending ? 'animate-spin' : ''}`} />
                            {isRecommending ? 'Analyzing...' : 'AI Generate'}
                        </span>
                    </button>
                    <button
                        onClick={addSession}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black uppercase tracking-widest shadow-lg shadow-neon-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> New Slot
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Upcoming Sessions</h2>
                        <span className="text-[10px] font-bold text-neon-blue bg-neon-blue/10 px-3 py-1 rounded-full uppercase italic">{sessions.length} Slots</span>
                    </div>

                    <AnimatePresence mode='popLayout'>
                        {sessions.map((session) => (
                            <motion.div
                                key={session.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`group p-1 rounded-[2rem] transition-all ${session.completed ? 'opacity-60 grayscale' : 'hover:scale-[1.01]'
                                    }`}
                            >
                                <div className={`relative overflow-hidden p-6 rounded-[1.9rem] bg-slate-900/40 border-2 transition-all flex items-center justify-between ${session.status === 'critical' ? 'border-red-500/20' :
                                        session.completed ? 'border-white/5' : 'border-white/5 group-hover:border-neon-blue/30'
                                    }`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />

                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${session.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-slate-500 group-hover:bg-neon-blue group-hover:text-white'
                                            }`}>
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className={`text-xl font-black uppercase tracking-tighter transition-all ${session.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                    {session.title}
                                                </h3>
                                                {session.status === 'critical' && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-[9px] font-black uppercase text-white rounded-md animate-pulse">Critical</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">
                                                <span className="flex items-center gap-1.5 text-neon-blue"><Clock className="w-3 h-3" /> {session.time}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                <span>{session.duration} Window</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 relative z-10">
                                        {!session.completed && (
                                            <button
                                                onClick={() => startFocusMode(session)}
                                                className="px-6 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-white transition-all shadow-xl"
                                            >
                                                Start Focus
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                                            className="p-3 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {sessions.length === 0 && (
                        <div className="text-center py-32 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                            <CalendarDays className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active sessions. Start your journey.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-[2rem] bg-gradient-to-b from-neon-blue/10 to-transparent border-2 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-20 h-20 text-neon-blue" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Focus Score</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-white">{focusScore}</span>
                            <span className="text-neon-blue font-black uppercase text-xs tracking-widest">/100</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 font-medium uppercase leading-relaxed">
                            {focusScore === 0 ? "You haven't completed any sessions yet." : "Your consistency is increasing. Keep it up!"}
                        </p>
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                <span>Daily Target</span>
                                <span>{focusScore}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-neon-blue"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${focusScore}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border-2 border-white/5">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6">AI Insights</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-5 h-5 text-neon-purple" />
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    <b className="text-white">COGNITIVE LOAD:</b> Based on your {focusScore}% focus rate, we've optimized your study windows.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    <b className="text-white text-red-400 uppercase tracking-tighter">LAGGING PERFORMANCE:</b> Mastery in <b className="text-neon-blue">Python Programming</b> is below 40%. Priority scheduling enabled.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-5 h-5 text-neon-blue" />
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    <b className="text-white">SUGGESTED FOCUS:</b> Concentrate on <b className="text-neon-purple">Python Data Types</b> during your next session for maximum XP.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
