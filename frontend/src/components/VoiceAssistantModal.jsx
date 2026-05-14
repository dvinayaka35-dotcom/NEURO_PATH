import { useState } from 'react';
import { Mic, X, Waves, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[1px] shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 transition-transform z-40"
      >
        <div className="w-full h-full rounded-full bg-dark-bg/80 flex items-center justify-center backdrop-blur-sm">
          <Mic className="w-6 h-6 text-white" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-neon-purple/20 blur-[60px] rounded-full pointer-events-none" />

              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 rounded-full border-2 border-neon-blue/30 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-lg">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">Neuro<span className="text-neon-blue">Voice</span></h2>
              <p className="text-slate-400 text-sm mb-8">Your AI Study Companion</p>

              <div className="h-24 w-full flex items-center justify-center mb-8">
                {isListening ? (
                  <div className="flex gap-1 items-center h-12">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ['20%', '100%', '20%'] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                        className="w-2 bg-gradient-to-t from-neon-blue to-neon-purple rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">Tap to speak...</p>
                )}
              </div>

              <button 
                onClick={() => setIsListening(!isListening)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {isListening ? <Waves className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
