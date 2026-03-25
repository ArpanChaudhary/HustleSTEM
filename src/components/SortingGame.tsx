import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface SortingGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

const GAME_DATA: Record<number, { items: { id: string, name: string, category: string }[], categories: string[] }> = {
  22: { // Living vs Non-Living
    items: [
      { id: '1', name: '🐶 Dog', category: 'Living' },
      { id: '2', name: '🪨 Rock', category: 'Non-Living' },
      { id: '3', name: '🌳 Tree', category: 'Living' },
      { id: '4', name: '🚗 Car', category: 'Non-Living' },
    ],
    categories: ['Living', 'Non-Living']
  },
  33: { // Magnetic vs Non-Magnetic
    items: [
      { id: '1', name: '📎 Clip', category: 'Magnetic' },
      { id: '2', name: '✏️ Pencil', category: 'Non-Magnetic' },
      { id: '3', name: '🔑 Key', category: 'Magnetic' },
      { id: '4', name: '🍎 Apple', category: 'Non-Magnetic' },
    ],
    categories: ['Magnetic', 'Non-Magnetic']
  }
};

export const SortingGame: React.FC<SortingGameProps> = ({ levelId, levelTitle, onClose }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[22];
  const [items, setItems] = useState(data.items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);

  const handleSort = (category: string) => {
    if (gameState === 'won') return;
    
    const currentItem = items[currentIndex];
    const isCorrect = currentItem.category === category;
    setMoves(prev => [...prev, { item: currentItem.name, category, correct: isCorrect }]);

    if (isCorrect) {
      hustleService.addPoints(25); // Points for correct sort
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('won');
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      }
    } else {
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
          <p className="text-gray-500 font-bold mt-1">Sort the items!</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <AnimatePresence mode="wait">
            {gameState === 'playing' ? (
              <motion.div
                key={currentIndex}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="w-40 h-40 bg-primary/5 rounded-3xl border-2 border-primary/10 flex items-center justify-center text-6xl shadow-xl relative"
              >
                {items[currentIndex].name.split(' ')[0]}
                <div className="absolute -bottom-8 text-sm font-bold text-gray-500">{items[currentIndex].name.split(' ')[1]}</div>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-6 h-6" />
                SORTING COMPLETE!
              </div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4 w-full">
            {data.categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleSort(cat)}
                className="p-6 bg-surface hover:bg-primary/5 border border-primary/10 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 text-text-main"
              >
                {(cat || '').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
