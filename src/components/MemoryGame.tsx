import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface MemoryGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

const GAME_DATA: Record<number, { items: string[] }> = {
  23: { // Animal Memory
    items: ['🦁', '🦁', '🐘', '🐘', '🐒', '🐒', '🦓', '🦓']
  },
  42: { // Tech Memory
    items: ['💻', '💻', '📱', '📱', '🔋', '🔋', '🔌', '🔌']
  }
};

export const MemoryGame: React.FC<MemoryGameProps> = ({ levelId, levelTitle, onClose }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[23];
  const [cards, setCards] = useState<{ id: number, content: string, flipped: boolean, matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);

  useEffect(() => {
    const shuffled = [...data.items]
      .sort(() => Math.random() - 0.5)
      .map((content, id) => ({ id, content, flipped: false, matched: false }));
    setCards(shuffled);
  }, [data.items]);

  const handleCardClick = (idx: number) => {
    if (gameState === 'won' || flippedIndices.length === 2 || cards[idx].flipped || cards[idx].matched) return;

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const isMatch = cards[first].content === cards[second].content;
      setMoves(prev => [...prev, { pair: [cards[first].content, cards[second].content], match: isMatch }]);

      if (isMatch) {
        hustleService.addPoints(40); // Points for correct pair
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedIndices([]);

        if (newCards.every(c => c.matched)) {
          setGameState('won');
          confetti({ particleCount: 150, spread: 70 });
          hustleService.completeLevel(levelId, 1, moves);
          hustleService.addXp(150);
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
      }
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

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-2xl border-2 transition-all flex items-center justify-center text-4xl ${
                card.flipped || card.matched ? 'border-primary bg-primary/10 text-primary' : 'border-primary/5 bg-primary/5 text-gray-300'
              }`}
            >
              {(card.flipped || card.matched) ? card.content : '?'}
            </motion.button>
          ))}
        </div>

        {gameState === 'won' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-10 text-center">
            <div className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)] mx-auto w-fit">
              <CheckCircle2 className="w-6 h-6" />
              MEMORY COMPLETE!
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
