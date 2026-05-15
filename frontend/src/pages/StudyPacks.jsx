import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export default function StudyPacks() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const recommendedPack = searchParams.get('recommended') || localStorage.getItem('recommendedStudyPack');
    const packs = useMemo(() => [
        {
            id: 'python-foundations',
            title: 'Python Foundations',
            description: 'Core syntax, data types, lists, and indentation rules for Python mastery.',
            duration: '4.5 Hours',
            level: 'Beginner',
            icon: '🐍',
            link: 'https://docs.python.org/3/tutorial/index.html',
        },
        {
            id: 'dws-foundations',
            title: 'DWS Foundations',
            description: 'Core principles of Data Warehousing and Data Mining.',
            color: 'from-neon-blue to-slate-800',
            link: 'https://www.w3schools.com/tutorials/',
        },
        {
            id: 'set-revision',
            title: 'SE&T Revision',
            description: 'Software Engineering and Testing methodologies, lifecycles, and practices.',
            color: 'from-neon-purple to-slate-800',
            link: 'https://www.geeksforgeeks.org/software-engineering/software-engineering/',
        },
        {
            id: 'bi-essentials',
            title: 'BI Essentials',
            description: 'Business Intelligence concepts, analytics, and reporting tools.',
            color: 'from-emerald-400 to-slate-800',
            link: 'https://www.geeksforgeeks.org/power-bi/what-is-business-intelligence/',
        },
        {
            id: 'python-advanced',
            title: 'Advanced Python Prep',
            description: 'Decorators, generators, context managers, and high-level Pythonic patterns.',
            duration: '8 Hours',
            level: 'Advanced',
            icon: '🔥',
            link: 'https://realpython.com/advanced-python-concepts/',
        },
    ], []);

    const startPack = (pack) => {
        if (pack.link) {
            window.open(pack.link, '_blank', 'noopener,noreferrer');
            return;
        }
        localStorage.setItem('activeStudyPack', pack.id);
        navigate('/quiz');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Study Packs</h1>
                    <p className="text-slate-400 mt-1">Browse curated learning bundles and start a new study session.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packs.map((pack) => {
                    const isRecommended = recommendedPack === pack.id;

                    return (
                    <div
                        key={pack.id}
                        className={`glass-card p-6 rounded-3xl border transition-all ${
                            isRecommended
                                ? 'border-red-400/60 shadow-[0_0_24px_rgba(248,113,113,0.18)]'
                                : 'border-white/10 hover:border-neon-purple/30'
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-3xl bg-gradient-to-br ${pack.color} flex items-center justify-center text-white`}>
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl font-semibold">{pack.title}</h2>
                                    {isRecommended && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
                                            <CheckCircle2 className="w-3 h-3" />
                                            AI Pick
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm">{pack.description}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => startPack(pack)}
                            className="mt-4 px-4 py-3 rounded-2xl bg-neon-blue text-white font-semibold hover:bg-neon-blue/90 transition-colors"
                        >
                            Start Pack
                        </button>
                    </div>
                )})}
            </div>
        </div>
    );
}
