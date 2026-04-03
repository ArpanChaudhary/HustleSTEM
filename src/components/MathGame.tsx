import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';
import { validateMathInput, cleanNumericInput } from '../lib/validation';

interface MathGameProps {
  levelId: number;
  levelTitle: string;
  onClose: (reward?: any, performance?: { accuracy: number; time: number }) => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

const GAME_DATA: Record<number, { problems: { q: string, a: number }[] }> = {
  15: { // Counting Stars (Class 1)
    problems: [
      { q: '3 + 2', a: 5 },
      { q: '1 + 4', a: 5 },
      { q: '2 + 2', a: 4 },
      { q: '5 + 1', a: 6 },
    ]
  },
  33: { // Math Challenge (Class 3)
    problems: [
      { q: '15 + 12', a: 27 },
      { q: '45 - 15', a: 30 },
      { q: '22 + 18', a: 40 },
      { q: '60 - 25', a: 35 },
    ]
  },
  45: { // Fraction Fun (Class 4)
    problems: [
      { q: '1/2 of 10', a: 5 },
      { q: '1/4 of 20', a: 5 },
      { q: '1/3 of 9', a: 3 },
      { q: '1/2 of 16', a: 8 },
    ]
  },
  52: { // Space Math (Multiplication)
    problems: [
      { q: '4 x 3', a: 12 },
      { q: '6 x 2', a: 12 },
      { q: '9 x 5', a: 45 },
      { q: '8 x 7', a: 56 },
    ]
  }
};

export const MathGame: React.FC<MathGameProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[33];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Let's solve these math puzzles to reboot the city's power grid!", 'neutral');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState === 'won' || !userInput || feedback) return;

    const validation = validateMathInput(userInput);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }
    setError(null);
    setTotalAttempts(prev => prev + 1);

    const currentProblem = data.problems[currentIndex];
    const isCorrect = parseInt(userInput) === currentProblem.a;
    setMoves(prev => [...prev, { problem: currentProblem.q, input: userInput, correct: isCorrect }]);

    if (isCorrect) {
      setFeedback('correct');
      setWrongAttempts(0);
      hustleService.addPoints(25); // Points for correct answer
      
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < data.problems.length - 1) {
          if (onBuddyMessage) {
            onBuddyMessage("Spot on! Next one!", 'happy');
          }
          setCurrentIndex(prev => prev + 1);
          setUserInput('');
        } else {
          setGameState('won');
          if (onBuddyMessage) {
            onBuddyMessage("MATH MASTER! The power grid is back online! You saved Robot City!", 'celebrating');
          }
          confetti({ particleCount: 150, spread: 70 });
          const reward = hustleService.completeLevel(levelId, 1, moves);
          hustleService.addXp(150);
          
          const accuracy = Math.max(10, Math.floor((data.problems.length / (totalAttempts + 1)) * 100));
          const time = Math.floor((Date.now() - startTime) / 1000);
          setTimeout(() => onClose(reward, { accuracy, time }), 2000);
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setWrongAttempts(prev => prev + 1);
      if (onBuddyMessage) {
        if (wrongAttempts >= 2) {
          onBuddyMessage(`Hint: The answer is ${currentProblem.a}!`, 'encouraging');
        } else {
          onBuddyMessage("Not quite! Double check your calculation.", 'thinking');
        }
      }
      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-xl rounded-[2.5rem] border border-primary/20 p-10 relative shadow-[0_0_50px_rgba(34,211,238,0.15)] glass"
      >
        <button onClick={() => onClose()} className="absolute top-8 right-8 p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black italic text-primary tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{(levelTitle || '').toUpperCase()}</h2>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Problem {currentIndex + 1} of {data.problems.length}</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <AnimatePresence mode="wait">
            {gameState === 'playing' ? (
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {data.problems[currentIndex].q}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">MATH COMPLETE!</h3>
              </motion.div>
            )}
          </AnimatePresence>

          {gameState === 'playing' && (
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={userInput}
                  onChange={(e) => {
                    const val = cleanNumericInput(e.target.value);
                    setUserInput(val);
                    setError(null);
                  }}
                  className={`w-full p-8 bg-white/5 border-2 rounded-[2rem] text-center text-5xl font-black text-primary outline-none transition-all ${
                    feedback === 'wrong' ? 'border-danger bg-danger/10 animate-shake' : 
                    feedback === 'correct' ? 'border-success bg-success/10 success-glow animate-success' :
                    error ? 'border-danger' : 'border-white/10 focus:border-primary'
                  }`}
                  placeholder="?"
                />
                {feedback === 'correct' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    className="absolute inset-0 border-4 border-success rounded-[2rem] pointer-events-none"
                  />
                )}
              </div>
              {error && <p className="text-danger text-xs font-bold mt-3 text-center uppercase tracking-widest">{error}</p>}
              <button
                type="submit"
                disabled={feedback !== null}
                className="w-full mt-6 p-5 bg-primary text-slate-900 font-black rounded-[1.5rem] shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
              >
                SUBMIT
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
