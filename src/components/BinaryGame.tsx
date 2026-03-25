import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface BinaryGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

const GAME_DATA: Record<number, { target: string, hint: string }> = {
  42: { target: '1010', hint: 'Decimal 10' },
  43: { target: '1100', hint: 'Decimal 12' }
};

export const BinaryGame: React.FC<BinaryGameProps> = ({ levelId, levelTitle, onClose }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[42];
  const [currentBits, setCurrentBits] = useState<string[]>(new Array(data.target.length).fill('0'));
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);

  const toggleBit = (idx: number) => {
    if (gameState === 'won') return;
    
    const newBits = [...currentBits];
    newBits[idx] = newBits[idx] === '0' ? '1' : '0';
    setCurrentBits(newBits);
    
    setMoves(prev => [...prev, { bitIndex: idx, newValue: newBits[idx] }]);

    if (newBits.join('') === data.target) {
      setGameState('won');
      hustleService.addPoints(100); // Points for correct binary target
      confetti({ particleCount: 150, spread: 70 });
      hustleService.completeLevel(levelId, 1, moves);
      hustleService.addXp(150);
    }
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
          <p className="text-gray-500 font-bold mt-1">Flip the bits to match the target!</p>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 italic">Hint: {data.hint}</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex gap-4">
            {currentBits.map((bit, i) => (
              <button
                key={i}
                onClick={() => toggleBit(i)}
                className={`w-20 h-28 rounded-2xl border-4 transition-all flex items-center justify-center text-5xl font-black ${
                  bit === '1' ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-primary/5 border-primary/10 text-primary/20'
                }`}
              >
                {bit}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            {gameState === 'won' ? (
              <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-6 h-6" />
                BINARY COMPLETE!
              </div>
            ) : (
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Target: <span className="text-primary">{data.target}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
