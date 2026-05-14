import { CalendarDays } from 'lucide-react';

export default function Scheduler() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Scheduler</h1>
                    <p className="text-slate-400 mt-1">Plan your study sessions and manage your weekly learning routine.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Weekly Planner</h2>
                            <p className="text-slate-400 text-sm">Create and track your upcoming study sessions.</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-slate-200">
                        <div className="rounded-3xl bg-white/5 p-5 border border-white/5">
                            <p className="font-semibold">Next session</p>
                            <p className="text-slate-400 mt-1">No sessions scheduled yet.</p>
                        </div>
                        <div className="rounded-3xl bg-white/5 p-5 border border-white/5">
                            <p className="font-semibold">Recommended duration</p>
                            <p className="text-slate-400 mt-1">45 minutes of focused study</p>
                        </div>
                    </div>
                    <button className="mt-6 px-4 py-3 rounded-2xl bg-neon-purple text-white font-semibold hover:bg-neon-purple/90 transition-colors">
                        Add Session
                    </button>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-white/10">
                    <h2 className="text-xl font-semibold mb-4">Calendar Overview</h2>
                    <p className="text-slate-400">Your schedule will appear here after you add sessions. This helps you stay on track with your learning goals.</p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-white/5 p-5 border border-white/5">
                            <p className="text-sm text-slate-400">Today</p>
                            <p className="mt-2 text-white font-semibold">No sessions</p>
                        </div>
                        <div className="rounded-3xl bg-white/5 p-5 border border-white/5">
                            <p className="text-sm text-slate-400">Tomorrow</p>
                            <p className="mt-2 text-white font-semibold">No sessions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
