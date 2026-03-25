import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface MatchingGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

interface MatchItem {
  id: string;
  content: string;
  matchId: string;
  type: 'source' | 'target';
}

const GAME_DATA: Record<number, { sources: string[], targets: string[], pairs: Record<string, string> }> = {
  13: { // Animal Match
    sources: ['🦁', '🐘', '🐒'],
    targets: ['Roar', 'Trunk', 'Banana'],
    pairs: { '🦁': 'Roar', '🐘': 'Trunk', '🐒': 'Banana' }
  },
  31: { // Anatomy
    sources: ['🧠', '🫀', '🫁'],
    targets: ['Think', 'Pump', 'Breathe'],
    pairs: { '🧠': 'Think', '🫀': 'Pump', '🫁': 'Breathe' }
  },
  51: { // Planet Sort (Distance from Sun)
    sources: ['Mercury', 'Venus', 'Earth', 'Mars'],
    targets: ['1st', '2nd', '3rd', '4th'],
    pairs: { 'Mercury': '1st', 'Venus': '2nd', 'Earth': '3rd', 'Mars': '4th' }
  }
};

export const MatchingGame: React.FC<MatchingGameProps> = ({ levelId, levelTitle, onClose }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[13];
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);

  const handleSourceClick = (src: string) => {
    if (gameState === 'won') return;
    setSelectedSource(src);
  };

  const handleTargetClick = (target: string) => {
    if (!selectedSource || gameState === 'won') return;
    
    const isCorrect = data.pairs[selectedSource] === target;
    setMoves(prev => [...prev, { source: selectedSource, target, correct: isCorrect }]);

    if (isCorrect) {
      hustleService.addPoints(30); // Points for correct match
      const newMatches = { ...matches, [selectedSource]: target };
      setMatches(newMatches);
      setSelectedSource(null);

      if (Object.keys(newMatches).length === data.sources.length) {
        setGameState('won');
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      }
    } else {
      // Shake effect or something
      setSelectedSource(null);
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
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{levelTitle.toUpperCase()}</h2>
          <p className="text-gray-500 font-bold mt-1">Match the pairs!</p>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            {data.sources.map(src => (
              <button
                key={src}
                onClick={() => handleSourceClick(src)}
                disabled={!!matches[src]}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-3xl flex items-center justify-center ${
                  matches[src] ? 'border-primary/20 bg-primary/5 opacity-50 text-gray-400' :
                  selectedSource === src ? 'border-primary bg-primary/10 scale-105 shadow-[0_0_20px_rgba(14,165,233,0.2)]' : 'border-primary/5 bg-primary/5 hover:border-primary/10 text-text-main'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {data.targets.map(target => {
              const matchedSrc = Object.keys(matches).find(k => matches[k] === target);
              return (
                <button
                  key={target}
                  onClick={() => handleTargetClick(target)}
                  disabled={!!matchedSrc}
                  className={`w-full p-6 rounded-2xl border-2 transition-all font-bold flex items-center justify-center ${
                    matchedSrc ? 'border-primary/20 bg-primary/5 opacity-50 text-gray-400' : 'border-primary/5 bg-primary/5 hover:border-primary/10 text-text-main'
                  }`}
                >
                  {target}
                </button>
              );
            })}
          </div>
        </div>

        {gameState === 'won' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-10 text-center">
            <div className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)] mx-auto w-fit">
              <CheckCircle2 className="w-6 h-6" />
              WELL DONE!
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
