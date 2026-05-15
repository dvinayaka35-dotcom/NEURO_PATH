import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Timer, BookOpen, ChevronRight, CheckCircle2, XCircle, AlertTriangle, RefreshCcw } from 'lucide-react';
import api from '../api';

const SUBJECTS = {
    python_programming: {
        id: "python_programming",
        title: "Python Programming",
        icon: "🐍",
        modules: [
            "1.0 Introduction to Python (4h)",
            "2.0 Python Data types and operators (10h)",
            "3.0 Python Program Flow Control (6h)",
            "4.0 Python Functions, Modules and Packages (4h)"
        ],
        description: "Organizes software design around objects and data structures containing fields.",
        content: `INTRODUCTION TO PYTHON ARCHITECTURE
Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with its use of significant indentation.

1. PYTHON FUNDAMENTALS:
- Interpreted Language: Python code is executed line by line, which makes debugging easier.
- Dynamic Typing: You don't need to declare variable types; they are determined at runtime.
- Indentation: Instead of curly braces, Python uses whitespace to define code blocks.

2. CORE DATA STRUCTURES:
- Lists: Ordered, mutable sequences of elements.
- Tuples: Ordered, immutable sequences of elements.
- Dictionaries: Key-value pairs for efficient data retrieval.
- Sets: Unordered collections of unique elements.

3. PROGRAM FLOW & FUNCTIONS:
- Control Flow: Using if, elif, else for decision making, and for/while for loops.
- Functions: Defined using the 'def' keyword, promoting code reusability.
- Modules: Python files containing code that can be imported and used in other scripts.

4. ERROR HANDLING & PACKAGES:
- Try-Except: Python's way of handling exceptions cleanly.
- PIP: The standard package manager used to install and manage additional libraries.`
    },
    dynamic_websites: {
        id: "dynamic_websites",
        title: "Dynamic Websites",
        icon: "🌐",
        modules: [
            "1.0 Introduction to the Module (6h)",
            "2.0 Designing and Coding a Website (8h)",
            "3.0 Design and Developing for Mobile Websites (6h)",
            "4.0 Design and Build a Database (1) (3h)"
        ],
        description: "Master the art of building responsive, data-driven web applications.",
        content: `THE EVOLUTION OF DYNAMIC WEB APPLICATIONS
Unlike static sites that serve fixed HTML, dynamic websites generate content on-the-fly using server-side processing and database integration.

1. FULL-STACK ARCHITECTURE:
- Frontend (Client-Side): Technologies like HTML5 for structure, CSS3 (including Flexbox and Grid) for styling, and JavaScript frameworks (React, Vue, Angular) for interactivity.
- Backend (Server-Side): Handles business logic, authentication, and database communication. Popular choices include Node.js (Express), Python (FastAPI/Django), and PHP.
- Database: Structured Query Language (SQL) like PostgreSQL is used for complex relationships, while NoSQL like MongoDB is used for high-velocity, unstructured data.

2. MOBILE-FIRST DESIGN:
Modern websites must be "Responsive." This is achieved through:
- Fluid Grids: Using percentages instead of fixed pixels.
- Media Queries: Applying different styles based on the device width.
- Viewport Meta Tag: Helping browsers scale content to fit the screen.

3. DATABASE DESIGN & CONNECTIVITY:
The 4.0 module focuses on CRUD operations (Create, Read, Update, Delete) and ensuring data integrity through Primary Keys and Foreign Keys. Understanding normalization is key to preventing data redundancy.`
    },
    software_engineering: {
        id: "software_engineering",
        title: "Software Engineering and Testing",
        icon: "⚙️",
        modules: [
            "1.0 Intro to Software Engineering & Testing (8h)",
            "2.0 Testing Techniques (8h)",
            "3.0 Software Testing Life Cycle (6h)",
            "4.0 Defect Management (6h)"
        ],
        description: "Learn the systematic approach to building and validating robust software.",
        content: `PRINCIPLES OF SOFTWARE QUALITY ASSURANCE
Software Engineering is the application of a systematic, disciplined approach to software development. Testing ensures that the final product meets requirements.

1. SOFTWARE DEVELOPMENT LIFE CYCLE (SDLC):
Common models include:
- Waterfall: Linear and sequential (Requirement -> Design -> Implementation -> Verification -> Maintenance).
- Agile: Iterative and incremental, focusing on customer feedback and rapid releases.

2. THE TESTING PYRAMID:
- Unit Testing: Testing individual components or functions in isolation.
- Integration Testing: Testing how different modules work together.
- System Testing: Validating the complete and integrated software product.
- Acceptance Testing (UAT): Ensuring the system meets business requirements.

3. SOFTWARE TESTING LIFE CYCLE (STLC):
This specific process involves:
- Test Planning: Estimating effort and defining the test strategy.
- Test Case Development: Writing detailed steps to verify functionality.
- Execution & Bug Reporting: Finding defects and logging them in systems like Jira.

4. DEFECT MANAGEMENT:
When a bug is found, it is assigned a Priority (How soon it needs fixing) and Severity (Impact on the system). A 'Showstopper' bug has High Severity and High Priority.`
    },
    business_intelligence: {
        id: "business_intelligence",
        title: "Business Intelligence",
        icon: "📊",
        modules: [
            "1.0 BI Introduction (6h)",
            "2.0 BI Essentials (6h)",
            "3.0 Architecting the Data (9h)",
            "4.0 Data Extraction (7h)"
        ],
        description: "Transform raw data into actionable insights for business growth.",
        content: `STRATEGIC DATA ANALYSIS WITH BUSINESS INTELLIGENCE
Business Intelligence (BI) turns raw data into meaningful information that helps organizations make better decisions.

1. CORE COMPONENTS OF BI:
- Data Warehousing: A centralized repository of data from multiple sources, optimized for reading and analysis.
- ETL Process:
  a. Extract: Gathering data from various source systems (CRMs, ERPs, Flat files).
  b. Transform: Cleaning, filtering, and formatting data to fit the warehouse schema.
  c. Load: Writing the transformed data into the target warehouse.

2. DATA ARCHITECTURE:
Architecting involves defining how data is stored and organized.
- OLTP (Online Transactional Processing): Optimized for fast transactions (e.g., bank transfers).
- OLAP (Online Analytical Processing): Optimized for complex queries and data discovery (e.g., yearly sales trends).

3. DATA EXTRACTION & VISUALIZATION:
The goal of BI is to present data in a way that is easy to understand. Tools like PowerBI and Tableau allow users to create interactive dashboards. Key metrics often tracked are KPIs (Key Performance Indicators) and ROI (Return on Investment).`
    }
};

export default function Quiz() {
    const [view, setView] = useState('selection'); // selection, study, quiz, result
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 });
    const [studyTimer, setStudyTimer] = useState(600); // 10 minutes in seconds
    const [isStudyComplete, setIsStudyComplete] = useState(false);
    const [realContent, setRealContent] = useState("");

    // Auto-select topic if redirected from Scheduler
    useEffect(() => {
        const scheduledTopic = localStorage.getItem('scheduledTopic');
        if (scheduledTopic) {
            const subjectId = Object.keys(SUBJECTS).find(key =>
                SUBJECTS[key].title.toLowerCase().includes(scheduledTopic.toLowerCase()) ||
                scheduledTopic.toLowerCase().includes(SUBJECTS[key].title.toLowerCase())
            );

            if (subjectId) {
                setSelectedSubject(SUBJECTS[subjectId]);
                setView('study'); // Go directly to study/module view
            }
            localStorage.removeItem('scheduledTopic');
        }
    }, []);

    // Study Timer Logic
    useEffect(() => {
        let interval;
        if (view === 'study' && studyTimer > 0) {
            interval = setInterval(() => {
                setStudyTimer(prev => prev - 1);
            }, 1000);
        } else if (view === 'study' && studyTimer === 0) {
            setIsStudyComplete(true);
        }
        return () => clearInterval(interval);
    }, [view, studyTimer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startStudy = (subject) => {
        setSelectedSubject(subject);
        setStudyTimer(600); // 10 MINUTE TIMER
        setIsStudyComplete(false);
        setRealContent(subject.content);
        setView('study');
    };

    const fetchQuestions = async (level) => {
        try {
            const res = await api.get(`/quiz/generate/${selectedSubject.id}/${level}`);
            setQuestions(res.data);
            setCurrentIndex(0);
            setScore(0);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setView('quiz');
        } catch (err) {
            console.error(err);
        }
    };

    const handleAnswer = (idx) => {
        if (isAnswered) return;
        setSelectedAnswer(idx);
        setIsAnswered(true);
        if (idx === questions[currentIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            completeLevel();
        }
    };

    const startLevelStudy = async (level) => {
        setCurrentLevel(level);
        setStudyTimer(600); // RESET TO 10 MINS FOR EACH LEVEL
        setIsStudyComplete(false);
        setScore(0);

        try {
            const res = await api.get(`/quiz/subjects/${selectedSubject.id}/${level}`);
            setRealContent(res.data.content);
        } catch (err) {
            setRealContent(`Welcome to Level ${level} of ${selectedSubject.title}. Please study the curriculum for this tier carefully.`);
        }
        setView('study');
    };

    const saveProgress = (lvl, resultScore, passed) => {
        const currentProgress = JSON.parse(localStorage.getItem('neuroPathProgress') || '{}');
        const subjectData = currentProgress[selectedSubject.id] || {
            title: selectedSubject.title,
            highestLevel: 0,
            lastScore: 0,
            status: 'neutral'
        };

        if (passed) {
            subjectData.highestLevel = Math.max(subjectData.highestLevel, lvl);
            subjectData.status = 'improving';

            // Update XP for passing
            const currentXP = parseInt(localStorage.getItem('xp') || '0');
            localStorage.setItem('xp', (currentXP + 50).toString());
        } else {
            subjectData.status = 'lagging';
        }
        subjectData.lastScore = resultScore;

        // Update Focus Score based on accuracy
        const currentFocus = parseInt(localStorage.getItem('focusScore') || '0');
        const newFocus = Math.min(100, Math.max(0, currentFocus + (passed ? 5 : -5)));
        localStorage.setItem('focusScore', newFocus.toString());

        currentProgress[selectedSubject.id] = subjectData;
        localStorage.setItem('neuroPathProgress', JSON.stringify(currentProgress));

        // Trigger profile update
        window.dispatchEvent(new Event('profileUpdate'));
    };

    const completeLevel = () => {
        const pass = score >= 4;
        setLevelScores(prev => ({ ...prev, [currentLevel]: score }));
        saveProgress(currentLevel, score, pass);

        if (!pass) {
            alert(`Level ${currentLevel} failed. Score: ${score}/5. You must re-study the Level ${currentLevel} material.`);
            setStudyTimer(300); // 5 mins forced re-study
            setIsStudyComplete(false);
            setView('study');
        } else if (currentLevel < 5) {
            alert(`Level ${currentLevel} PASSED! Unlocking Level ${currentLevel + 1} study material.`);
            startLevelStudy(currentLevel + 1);
        } else {
            setView('result');
        }
    };

    const resetQuiz = () => {
        setView('selection');
        setSelectedSubject(null);
        setCurrentLevel(1);
        setLevelScores({ 1: 0, 2: 0, 3: 0 });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <AnimatePresence mode="wait">
                {view === 'selection' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl font-black italic tracking-tighter">
                                ADAPTIVE <span className="text-neon-blue">QUIZ</span>
                            </h1>
                            <p className="text-slate-400 max-w-xl mx-auto uppercase tracking-widest text-xs">
                                Choose your module to begin the certification process.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.values(SUBJECTS).map((sub) => (
                                <motion.div
                                    key={sub.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => startStudy(sub)}
                                    className="glass-card p-6 rounded-3xl border border-white/10 hover:border-neon-blue/50 cursor-pointer group transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-4xl">{sub.icon}</div>
                                        <div className="bg-neon-blue/10 text-neon-blue px-3 py-1 rounded-full text-[10px] font-bold">
                                            {sub.modules.length} MODULES
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue">{sub.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4">{sub.description}</p>
                                    <div className="space-y-2">
                                        {sub.modules.slice(0, 2).map((m, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-neon-blue" />
                                                {m}
                                            </div>
                                        ))}
                                        {sub.modules.length > 2 && <p className="text-[10px] text-slate-600">+{sub.modules.length - 2} more modules</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {view === 'study' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card rounded-3xl border border-white/10 overflow-hidden"
                    >
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neon-blue/20 rounded-2xl text-neon-blue">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedSubject.title}</h2>
                                    <p className="text-slate-400 text-sm">Mandatory Study Phase</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${isStudyComplete ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-neon-blue/50 bg-neon-blue/10'}`}>
                                <Timer className={`w-5 h-5 ${isStudyComplete ? 'text-emerald-400' : 'text-neon-blue animate-pulse'}`} />
                                <span className={`text-xl font-mono font-bold ${isStudyComplete ? 'text-emerald-400' : 'text-white'}`}>
                                    {isStudyComplete ? 'READY' : formatTime(studyTimer)}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 h-[500px] overflow-y-auto space-y-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-bold mb-4 text-neon-blue">Module Curriculum:</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedSubject.modules.map((m, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xl font-bold mb-4">Core Concepts & Study Material</h3>
                                <div className="p-6 bg-neon-blue/5 border border-neon-blue/10 rounded-2xl text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                                    {realContent || "Loading study material from AI brain..."}
                                </div>

                                <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                                    <p className="text-sm text-amber-200">
                                        <b>Attention:</b> You must remain on this page for the duration of the study timer. Level 1 will unlock automatically once the timer expires.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white/5 border-t border-white/10 flex justify-end">
                            <button
                                disabled={!isStudyComplete}
                                onClick={() => fetchQuestions(currentLevel)}
                                className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${isStudyComplete
                                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                                    : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'
                                    }`}
                            >
                                START LEVEL {currentLevel} ASSESSMENT <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {view === 'quiz' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-3xl mx-auto space-y-8"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg font-bold ${currentLevel === 1 ? 'bg-emerald-500/20 text-emerald-500' :
                                    currentLevel === 2 ? 'bg-orange-500/20 text-orange-500' :
                                        'bg-red-500/20 text-red-500'
                                    }`}>
                                    LEVEL {currentLevel}
                                </div>
                                <div className="text-slate-400 font-medium">
                                    Question {currentIndex + 1} of {questions.length}
                                </div>
                            </div>
                            <div className="text-neon-blue font-bold tracking-widest uppercase text-xs">
                                Score: {score}/5
                            </div>
                        </div>

                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Brain className="w-40 h-40" />
                            </div>

                            <h2 className="text-2xl font-bold leading-relaxed mb-8 relative z-10">
                                {questions[currentIndex].question}
                            </h2>

                            <div className="space-y-4">
                                {questions[currentIndex].options.map((option, idx) => {
                                    let state = 'default';
                                    if (isAnswered) {
                                        if (idx === questions[currentIndex].answer) state = 'correct';
                                        else if (idx === selectedAnswer) state = 'wrong';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled={isAnswered}
                                            onClick={() => handleAnswer(idx)}
                                            className={`w-full p-6 rounded-2xl text-left font-medium transition-all flex items-center justify-between border ${state === 'correct' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                                state === 'wrong' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                                    selectedAnswer === idx ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' :
                                                        'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="flex items-center gap-4">
                                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs border border-white/10">
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                {option}
                                            </span>
                                            {state === 'correct' && <CheckCircle2 className="w-5 h-5" />}
                                            {state === 'wrong' && <XCircle className="w-5 h-5" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2 text-sm">
                                        {selectedAnswer === questions[currentIndex].answer ? (
                                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                                <CheckCircle2 className="w-4 h-4" /> EXCELLENT!
                                            </span>
                                        ) : (
                                            <span className="text-red-400 flex items-center gap-1 font-bold">
                                                <AlertTriangle className="w-4 h-4" /> WRONG. CORRECT: {questions[currentIndex].options[questions[currentIndex].answer]}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={nextQuestion}
                                        className="bg-white text-dark-bg px-8 py-3 rounded-xl font-bold hover:bg-neon-blue hover:text-white transition-all shadow-lg"
                                    >
                                        {currentIndex === questions.length - 1 ? 'COMPLETE LEVEL' : 'NEXT QUESTION'}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {view === 'result' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto glass-card p-12 rounded-[3rem] border border-white/10 text-center space-y-8"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>

                        <div>
                            <h2 className="text-4xl font-black italic tracking-tighter mb-2">CONGRATULATIONS!</h2>
                            <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Module Certification Complete</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[1, 2, 3, 4, 5].map(lvl => (
                                <div key={lvl} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase">LVL {lvl}</div>
                                    <div className="text-xl font-black text-neon-blue">{levelScores[lvl] || 0}/5</div>
                                    <div className="mt-1 text-[8px] text-emerald-500 font-bold">PASSED</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 text-emerald-400 text-sm font-medium leading-relaxed">
                            "You have demonstrated exceptional understanding of {selectedSubject.title} across all complexity tiers. Your digital certificate has been issued."
                        </div>

                        <button
                            onClick={resetQuiz}
                            className="w-full py-4 rounded-2xl bg-white text-dark-bg font-black hover:bg-neon-blue hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-5 h-5" /> START ANOTHER MODULE
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
