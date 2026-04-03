import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface SequenceGameProps {
  levelId: number;
  levelTitle: string;
  onClose: (reward?: any) => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

const GAME_DATA: Record<number, { sequence: string[], options: string[], target: string[] }> = {
  21: { // Pattern Builder (Class 2)
    sequence: ['🔴', '🔵', '🔴', '🔵'],
    options: ['🔴', '🔵', '🟢'],
    target: ['🔴', '🔵', '🔴', '🔵', '🔴', '🔵']
  },
  54: { // Code Logic (Class 5)
    sequence: ['START', 'MOVE', 'MOVE'],
    options: ['TURN', 'STOP', 'JUMP'],
    target: ['START', 'MOVE', 'MOVE', 'TURN', 'MOVE', 'STOP']
  },
  14: { // Plant Growth (Class 1) - Sequence fallback
    sequence: ['🌱', '🌿'],
    options: ['🌳', '🌻', '🍂'],
    target: ['🌱', '🌿', '🌳']
  }
};

export const SequenceGame: React.FC<SequenceGameProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[21];
  const [currentSeq, setCurrentSeq] = useState<string[]>(data.sequence);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Look closely at the pattern! What comes next in the sequence?", 'neutral');
    }
  }, []);

  const handleOptionClick = (opt: string) => {
    if (gameState === 'won') return;
    
    const nextSeq = [...currentSeq, opt];
    const isCorrect = data.target[currentSeq.length] === opt;
    setMoves(prev => [...prev, { option: opt, correct: isCorrect }]);

    if (isCorrect) {
      setWrongAttempts(0);
      hustleService.addPoints(20); // Points for correct sequence item
      setCurrentSeq(nextSeq);
      if (onBuddyMessage) {
        onBuddyMessage("That fits perfectly!", 'happy');
      }
      if (nextSeq.length === data.target.length) {
        setGameState('won');
        if (onBuddyMessage) {
          onBuddyMessage("SEQUENCE COMPLETE! You've mastered the pattern!", 'celebrating');
        }
        confetti({ particleCount: 150, spread: 70 });
        const reward = hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
        setTimeout(() => onClose(reward), 2000);
      }
    } else {
      setWrongAttempts(prev => prev + 1);
      if (onBuddyMessage) {
        if (wrongAttempts >= 2) {
          onBuddyMessage(`Try looking at the items that came before. What's the repeating part?`, 'encouraging');
        } else {
          onBuddyMessage("Oops! That doesn't follow the pattern. Try again!", 'thinking');
        }
      }
    }
  };

  const reset = () => {
    setCurrentSeq(data.sequence);
    setGameState('playing');
    setWrongAttempts(0);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-2xl rounded-[2rem] border border-primary/10 p-8 relative shadow-[0_0_50px_rgba(14,165,233,0.1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{(levelTitle || '').toUpperCase()}</h2>
          <p className="text-gray-500 font-bold mt-1">Complete the sequence!</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex gap-4 p-8 bg-primary/5 rounded-3xl border border-primary/10 min-h-[120px] items-center justify-center w-full">
            <AnimatePresence mode="popLayout">
              {currentSeq.map((item, i) => (
                <motion.div
                  key={`${item}-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl"
                >
                  {item}
                </motion.div>
              ))}
              {currentSeq.length < data.target.length && (
                <motion.div
                  key="placeholder"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-12 h-12 rounded-xl border-2 border-dashed border-primary/20"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4">
            {data.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className="w-20 h-20 bg-surface hover:bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center text-4xl transition-all hover:scale-110 active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            {gameState === 'won' ? (
              <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-6 h-6" />
                SEQUENCE COMPLETE!
              </div>
            ) : (
              <button onClick={reset} className="p-4 bg-surface hover:bg-primary/5 rounded-2xl border border-primary/10 transition-all text-primary">
                <RotateCcw className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
