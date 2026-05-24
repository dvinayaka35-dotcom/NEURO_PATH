import { useState, useEffect, useRef } from 'react';
import { Mic, X, Waves, Bot, Globe, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function VoiceAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US'); // en-US or kn-IN
  const [aiResponse, setAiResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    if (isMutedRef.current) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    
    // Try to find a better voice match
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (voice) utterance.voice = voice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleAIResponse = async (userText) => {
    setAiResponse('Thinking...');
    try {
      const response = await api.post('/ai/ask', {
        question: userText,
        lang: language
      });
      const answer = response.data.answer;
      setAiResponse(answer);
      speak(answer);
    } catch (err) {
      console.error('AI Error', err);
      setAiResponse('Sorry, I am having trouble connecting to my brain right now.');
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after one phrase to respond
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        handleAIResponse(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAiResponse('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

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
              
              <div className="flex gap-2 mb-6 items-center">
                <button 
                  onClick={() => setLanguage('en-US')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en-US' ? 'bg-neon-blue text-dark-bg' : 'bg-white/5 text-slate-400'}`}
                >
                  ENGLISH
                </button>
                <button 
                  onClick={() => setLanguage('kn-IN')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'kn-IN' ? 'bg-neon-purple text-white' : 'bg-white/5 text-slate-400'}`}
                >
                  KANNADA (ಕನ್ನಡ)
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-full transition-all ${isMuted ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="h-40 w-full flex flex-col items-center justify-center mb-6 overflow-y-auto px-4 space-y-4">
                {isListening ? (
                  <>
                    <div className="flex gap-1 items-center h-8 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ['20%', '100%', '20%'] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                          className="w-1.5 bg-gradient-to-t from-neon-blue to-neon-purple rounded-full"
                        />
                      ))}
                    </div>
                    <p className="text-white text-lg font-medium leading-relaxed italic">"{transcript || 'Listening...'}"</p>
                  </>
                ) : (
                  <div className="space-y-4">
                    {transcript && (
                      <p className="text-slate-500 text-sm italic">You: "{transcript}"</p>
                    )}
                    {aiResponse ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 p-4 rounded-2xl border border-white/10 text-neon-blue font-medium"
                      >
                        {aiResponse}
                      </motion.div>
                    ) : (
                      <p className="text-slate-500 italic">
                        {language === 'en-US' ? 'Tap the mic and say something...' : 'ಮೈಕ್ ಒತ್ತಿ ಮತ್ತು ಏನಾದರೂ ಹೇಳಿ...'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button 
                onClick={toggleListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {isListening ? <Waves className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
                {language === 'en-US' ? 'Powered by Neuro-AI Recognition' : 'ನ್ಯೂರೋ-ಎಐ ಇಂದ ಚಾಲಿತವಾಗಿದೆ'}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
