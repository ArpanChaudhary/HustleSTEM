import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface ScrambleGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

const GAME_DATA: Record<number, { word: string, hint: string }> = {
  42: { word: 'BINARY', hint: 'Computer language' },
  43: { word: 'ROBOT', hint: 'Mechanical helper' },
  53: { word: 'GALAXY', hint: 'Collection of stars' },
  54: { word: 'LOGIC', hint: 'Clear thinking' }
};

export const ScrambleGame: React.FC<ScrambleGameProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[42];
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    const shuffled = data.word.split('').sort(() => Math.random() - 0.5);
    setScrambled(shuffled);
    setCurrentGuess([]);
    if (onBuddyMessage) {
      onBuddyMessage(`Can you unscramble this word? Hint: ${data.hint}`, 'neutral');
    }
  }, [data.word]);

  const handleCharClick = (char: string, idx: number) => {
    if (gameState === 'won') return;
    
    const newGuess = [...currentGuess, char];
    setCurrentGuess(newGuess);
    
    const newScrambled = [...scrambled];
    newScrambled.splice(idx, 1);
    setScrambled(newScrambled);

    if (newGuess.length === data.word.length) {
      const isCorrect = newGuess.join('') === data.word;
      setMoves(prev => [...prev, { guess: newGuess.join(''), correct: isCorrect }]);

      if (isCorrect) {
        setWrongAttempts(0);
        setGameState('won');
        if (onBuddyMessage) {
          onBuddyMessage("WORD MASTER! You've unscrambled the secret code!", 'celebrating');
        }
        hustleService.addPoints(50); // Points for correct word
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      } else {
        setWrongAttempts(prev => prev + 1);
        if (onBuddyMessage) {
          if (wrongAttempts >= 2) {
            onBuddyMessage(`Think about the hint: ${data.hint}. The word starts with ${data.word[0]}!`, 'encouraging');
          } else {
            onBuddyMessage("Not quite! Let's try unscrambling it again.", 'thinking');
          }
        }
        // Reset
        setTimeout(() => {
          setScrambled(data.word.split('').sort(() => Math.random() - 0.5));
          setCurrentGuess([]);
        }, 1000);
      }
    }
  };

  const reset = () => {
    setScrambled(data.word.split('').sort(() => Math.random() - 0.5));
    setCurrentGuess([]);
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
          <p className="text-gray-500 font-bold mt-1">Unscramble the word!</p>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 italic">Hint: {data.hint}</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex gap-2 min-h-[80px] items-center justify-center w-full bg-primary/5 rounded-2xl border border-primary/10 p-4">
            {currentGuess.map((char, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-12 h-12 bg-primary text-white font-black text-2xl rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]"
              >
                {char}
              </motion.div>
            ))}
            {currentGuess.length < data.word.length && (
              <div className="w-12 h-12 border-2 border-dashed border-primary/10 rounded-xl" />
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {scrambled.map((char, i) => (
              <button
                key={`${char}-${i}`}
                onClick={() => handleCharClick(char, i)}
                className="w-14 h-14 bg-surface hover:bg-primary/5 border border-primary/10 rounded-xl font-black text-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-text-main"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            {gameState === 'won' ? (
              <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-6 h-6" />
                WORD COMPLETE!
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
