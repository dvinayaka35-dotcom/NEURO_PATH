import { useState } from 'react';
import { Bot, Lightbulb, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockQuestion = {
  topic: 'Quantum Physics',
  difficulty: 'Level 4 (Adapting)',
  question: 'In the context of the Schrödinger equation, what does the wave function (Ψ) squared conceptually represent?',
  options: [
    'The exact momentum of the particle',
    'The probability density of finding the particle',
    'The total energy of the system',
    'The gravitational pull on the particle'
  ],
  correct: 1
};

export default function Quiz() {
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Adaptive Quiz</h1>
          <p className="text-slate-400 mt-1">Difficulty adjusting in real-time based on your BKT model.</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-neon-blue/30 text-neon-blue">
          <Zap className="w-5 h-5" />
          <span className="font-bold">{mockQuestion.difficulty}</span>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase mb-6">
          {mockQuestion.topic}
        </div>

        <h2 className="text-2xl font-medium mb-8 leading-relaxed">
          {mockQuestion.question}
        </h2>

        <div className="space-y-4">
          {mockQuestion.options.map((opt, i) => {
            let stateClass = "border-white/10 hover:border-white/30 hover:bg-white/5";
            if (isAnswered) {
              if (i === mockQuestion.correct) stateClass = "border-emerald-500 bg-emerald-500/10 text-emerald-100";
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isAnswered && i === mockQuestion.correct ? 'bg-emerald-500 text-dark-bg' : 'bg-white/10'}`}>
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
            onClick={() => setIsAnswered(true)}
            disabled={selected === null || isAnswered}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              selected !== null && !isAnswered
                ? 'bg-neon-purple text-white shadow-[0_0_20px_rgba(176,38,255,0.4)]'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isAnswered ? 'Next Question' : 'Submit Answer'} <ArrowRight className="w-5 h-5" />
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
                Think about what "probability density" implies in quantum mechanics. It's not about certainty or physical force, but rather the likelihood of finding a particle in a specific region of space (Born rule).
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
