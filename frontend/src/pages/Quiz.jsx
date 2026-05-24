import { useState, useEffect } from 'react';
import { Bot, Lightbulb, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/quiz/questions');
      if (response.data && response.data.length > 0) {
        const formattedQuestions = response.data.map(q => ({
          ...q,
          correct: q.options.indexOf(q.answer),
          topic: q.topic || 'General',
          displayDifficulty: `Level ${q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3} (${q.difficulty})`
        }));
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback
      setQuestions([
        {
          topic: 'Quantum Physics',
          displayDifficulty: 'Level 4 (Adapting)',
          question: 'In the context of the Schrödinger equation, what does the wave function (Ψ) squared conceptually represent?',
          options: [
            'The exact momentum of the particle',
            'The probability density of finding the particle',
            'The total energy of the system',
            'The gravitational pull on the particle'
          ],
          correct: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (!isAnswered) {
      // Submit Answer
      setIsAnswered(true);
      if (selected === questions[currentIndex].correct) {
        setScore(prev => prev + 1);
      }
    } else {
      // Next Question
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setIsAnswered(false);
        setShowHint(false);
      } else {
        setCompleted(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    let level = "Beginner";
    if (percentage > 80) level = "Expert (Level 5)";
    else if (percentage > 50) level = "Intermediate (Level 3)";

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-12 rounded-3xl inline-block"
          >
            <div className="w-24 h-24 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-neon-purple" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-slate-400 mb-8">Here is your AI benchmark analysis.</p>
            
            <div className="grid grid-cols-2 gap-6 mb-8 text-left">
              <div className="glass-panel p-4 rounded-2xl border-white/5">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Your Score</span>
                <div className="text-3xl font-bold text-neon-blue">{score} / {questions.length}</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border-white/5">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Skill Level</span>
                <div className="text-3xl font-bold text-neon-purple">{level}</div>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="bg-neon-blue text-dark-bg px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
            >
              Restart Quiz
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Adaptive Quiz</h1>
          <p className="text-slate-400 mt-1">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-neon-blue/30 text-neon-blue">
          <Zap className="w-5 h-5" />
          <span className="font-bold">{currentQ.displayDifficulty}</span>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-neon-purple transition-all duration-500" style={{ width: `${((currentIndex) / questions.length) * 100}%` }} />

        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase mb-6">
          {currentQ.topic}
        </div>

        <h2 className="text-2xl font-medium mb-8 leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="space-y-4">
          {currentQ.options.map((opt, i) => {
            let stateClass = "border-white/10 hover:border-white/30 hover:bg-white/5";
            if (isAnswered) {
              if (i === currentQ.correct) stateClass = "border-emerald-500 bg-emerald-500/10 text-emerald-100";
              else if (selected === i) stateClass = "border-red-500 bg-red-500/10 text-red-100";
              else stateClass = "border-white/5 opacity-50";
            } else if (selected === i) {
              stateClass = "border-neon-purple bg-neon-purple/10";
            }

            return (
              <button
                key={i}
                onClick={() => !isAnswered && setSelected(i)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${stateClass}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isAnswered && i === currentQ.correct ? 'bg-emerald-500 text-dark-bg' : 'bg-white/10'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-lg">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Lightbulb className="w-5 h-5" />
            <span>Need an AI Hint?</span>
          </button>

          <button
            onClick={handleAction}
            disabled={selected === null}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${selected !== null
              ? 'bg-neon-purple text-white shadow-[0_0_20px_rgba(176,38,255,0.4)]'
              : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
          >
            {isAnswered ? (currentIndex + 1 === questions.length ? 'See Results' : 'Next Question') : 'Submit Answer'} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel border-amber-500/30 p-6 rounded-2xl flex gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-amber-500 font-bold mb-1 flex items-center gap-2">AI Tutor Hint</h3>
              <p className="text-slate-300 leading-relaxed">
                Think about the core concept of {currentQ.topic}. {currentQ.difficulty === 'easy' ? 'This is a fundamental concept.' : 'This requires a deeper understanding of the mechanics.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
