import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';
import { validateMathInput, cleanNumericInput } from '../lib/validation';

interface MathGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

const GAME_DATA: Record<number, { problems: { q: string, a: number }[] }> = {
  33: { // Basic Addition/Subtraction
    problems: [
      { q: '5 + 3', a: 8 },
      { q: '10 - 4', a: 6 },
      { q: '7 + 2', a: 9 },
      { q: '12 - 5', a: 7 },
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

export const MathGame: React.FC<MathGameProps> = ({ levelId, levelTitle, onClose }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[33];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState === 'won' || !userInput) return;

    const validation = validateMathInput(userInput);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }
    setError(null);

    const currentProblem = data.problems[currentIndex];
    const isCorrect = parseInt(userInput) === currentProblem.a;
    setMoves(prev => [...prev, { problem: currentProblem.q, input: userInput, correct: isCorrect }]);

    if (isCorrect) {
      hustleService.addPoints(25); // Points for correct answer
      if (currentIndex < data.problems.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput('');
      } else {
        setGameState('won');
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      }
    } else {
      setUserInput('');
      // Shake effect
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-xl rounded-[2rem] border border-primary/10 p-8 relative shadow-[0_0_50px_rgba(14,165,233,0.1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{(levelTitle || '').toUpperCase()}</h2>
          <p className="text-gray-500 font-bold mt-1">Solve the problems!</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <AnimatePresence mode="wait">
            {gameState === 'playing' ? (
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-6xl font-black text-text-main tracking-tighter"
              >
                {data.problems[currentIndex].q}
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-6 h-6" />
                MATH COMPLETE!
              </div>
            )}
          </AnimatePresence>

          {gameState === 'playing' && (
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
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
                className={`w-full p-6 bg-primary/5 border-2 rounded-2xl text-center text-4xl font-black text-primary outline-none transition-all ${error ? 'border-red-500' : 'border-primary/10 focus:border-primary'}`}
                placeholder="?"
              />
              {error && <p className="text-red-500 text-xs font-bold mt-2 text-center">{error}</p>}
              <button
                type="submit"
                className="w-full mt-4 p-4 bg-primary text-white font-black rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-105 transition-all"
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
