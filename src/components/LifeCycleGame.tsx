import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface LifeCycleGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

const GAME_DATA: Record<number, { stages: string[], target: string[] }> = {
  14: { // Plant Growth (Class 1)
    stages: ['🌻 Flower', '🌱 Sprout', '🌿 Plant', '🥚 Seed'],
    target: ['🥚 Seed', '🌱 Sprout', '🌿 Plant', '🌻 Flower']
  },
  22: { // Butterfly Life Cycle (Class 2)
    stages: ['🦋 Adult', '🐛 Larva', '🥚 Egg', '🕸️ Pupa'],
    target: ['🥚 Egg', '🐛 Larva', '🕸️ Pupa', '🦋 Adult']
  }
};

export const LifeCycleGame: React.FC<LifeCycleGameProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[22];
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Everything in nature has a cycle! Can you put these stages in the right order?", 'neutral');
    }
  }, []);

  const handleStageClick = (stage: string) => {
    if (gameState === 'won' || currentOrder.includes(stage)) return;
    
    const newOrder = [...currentOrder, stage];
    setCurrentOrder(newOrder);
    
    const isCorrect = data.target[currentOrder.length] === stage;
    setMoves(prev => [...prev, { stage, correct: isCorrect }]);

    if (isCorrect) {
      setWrongAttempts(0);
      hustleService.addPoints(35); // Points for correct stage
      if (onBuddyMessage) {
        onBuddyMessage("That's the next step in the cycle!", 'happy');
      }
      if (newOrder.length === data.target.length) {
        setGameState('won');
        if (onBuddyMessage) {
          onBuddyMessage("LIFE CYCLE MASTER! You've perfectly mapped out the journey from egg to adult!", 'celebrating');
        }
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      }
    } else {
      setWrongAttempts(prev => prev + 1);
      if (onBuddyMessage) {
        if (wrongAttempts >= 1) {
          onBuddyMessage(`Hint: It all starts with an egg! What happens after it hatches?`, 'encouraging');
        } else {
          onBuddyMessage("Oops! That's not the right order. Let's try again from the start.", 'thinking');
        }
      }
      // Reset
      setTimeout(() => setCurrentOrder([]), 1000);
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
          <p className="text-gray-500 font-bold mt-1">Put the stages in the correct order!</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex gap-4 p-8 bg-primary/5 rounded-3xl border border-primary/10 min-h-[120px] items-center justify-center w-full">
            <AnimatePresence mode="popLayout">
              {currentOrder.map((item, i) => (
                <motion.div
                  key={`${item}-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl bg-surface p-4 rounded-xl border border-primary/10 shadow-sm"
                >
                  {item}
                </motion.div>
              ))}
              {currentOrder.length < data.target.length && (
                <div className="w-12 h-12 rounded-xl border-2 border-dashed border-primary/20" />
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {data.stages.map(stage => (
              <button
                key={stage}
                onClick={() => handleStageClick(stage)}
                disabled={currentOrder.includes(stage)}
                className={`p-6 bg-surface hover:bg-primary/5 border border-primary/10 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 text-text-main ${
                  currentOrder.includes(stage) ? 'opacity-20' : ''
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          {gameState === 'won' && (
            <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
              <CheckCircle2 className="w-6 h-6" />
              LIFE CYCLE COMPLETE!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
