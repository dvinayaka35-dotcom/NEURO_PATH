import { useState, useEffect } from 'react';
import { User, CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';

export default function Profile() {
    const [email, setEmail] = useState('');
    const [joinedDate, setJoinedDate] = useState('Today');
    const [isVerified, setIsVerified] = useState(false);
    const [customName, setCustomName] = useState('');
    const [level, setLevel] = useState(1);
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('email') || '';
        const storedJoined = localStorage.getItem('joinedDate') || 'Today';
        const storedVerified = localStorage.getItem('verified') === 'true';
        const storedCustomName = localStorage.getItem('customName');
        const xp = parseInt(localStorage.getItem('xp') || '0');

        setEmail(storedEmail);
        setJoinedDate(storedJoined);
        setIsVerified(storedVerified);
        setCustomName(storedCustomName || (storedEmail ? storedEmail.split('@')[0].replace(/\b\w/g, (c) => c.toUpperCase()) : 'New Learner'));
        setLevel(Math.floor(xp / 100) + 1);
    }, []);

    const handleNameSave = () => {
        localStorage.setItem('customName', customName);
        setIsEditingName(false);
    };

    const handleNameKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleNameSave();
        }
    };

    const displayName = email ? email.split('@')[0].replace(/\b\w/g, (c) => c.toUpperCase()) : 'New Learner';
    const statusLabel = isVerified ? 'Verified account' : 'Unverified account';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-slate-400 mt-1">View your learning account, progress summary, and personalization settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    onBlur={handleNameSave}
                                    onKeyPress={handleNameKeyPress}
                                    className="text-xl font-semibold bg-transparent border-b border-neon-purple outline-none text-white"
                                    autoFocus
                                />
                            ) : (
                                <h2
                                    className="text-xl font-semibold cursor-pointer hover:text-neon-blue transition-colors"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    {customName}
                                </h2>
                            )}
                            <p className="text-slate-400">Level {level} Scholar</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-slate-300">
                        <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="mt-1">{email || 'Not signed in'}</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                            <p className="text-sm text-slate-400">Status</p>
                            <p className={`mt-1 ${isVerified ? 'text-emerald-300' : 'text-yellow-300'}`}>
                                {statusLabel}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                            <p className="text-sm text-slate-400">Joined</p>
                            <p className="mt-1">{joinedDate}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10">
                    <h2 className="text-xl font-semibold mb-4">Learning Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: ShieldCheck, label: 'Verified Email', value: 'Yes' },
                            { icon: Sparkles, label: 'Current XP', value: '0' },
                            { icon: CalendarDays, label: 'Study Time', value: '0h 0m' },
                            { icon: User, label: 'Focus Score', value: '0/100' },
                        ].map((item, index) => (
                            <div key={index} className="rounded-3xl bg-white/5 p-5 border border-white/5">
                                <div className="flex items-center gap-3 mb-3 text-slate-400">
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm uppercase tracking-[0.2em]">{item.label}</span>
                                </div>
                                <p className="text-3xl font-semibold text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
