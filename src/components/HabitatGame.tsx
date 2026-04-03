import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface HabitatGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

const GAME_DATA: Record<number, { animals: { id: string, name: string, habitat: string }[], habitats: string[] }> = {
  32: { // Animal Habitat (Class 3)
    animals: [
      { id: '1', name: '🦁 Lion', habitat: 'Savanna' },
      { id: '2', name: '🐧 Penguin', habitat: 'Arctic' },
      { id: '3', name: '🐒 Monkey', habitat: 'Jungle' },
      { id: '4', name: '🐪 Camel', habitat: 'Desert' },
    ],
    habitats: ['Savanna', 'Arctic', 'Jungle', 'Desert']
  }
};

export const HabitatGame: React.FC<HabitatGameProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[32];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Help these animals find their way home! Where does each one live?", 'neutral');
    }
  }, []);

  const handleHabitatClick = (habitat: string) => {
    if (gameState === 'won') return;
    
    const currentAnimal = data.animals[currentIndex];
    const isCorrect = currentAnimal.habitat === habitat;
    setMoves(prev => [...prev, { animal: currentAnimal.name, habitat, correct: isCorrect }]);

    if (isCorrect) {
      setWrongAttempts(0);
      hustleService.addPoints(25); // Points for correct habitat
      if (onBuddyMessage) {
        onBuddyMessage("That's exactly where they belong!", 'happy');
      }
      if (currentIndex < data.animals.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('won');
        if (onBuddyMessage) {
          onBuddyMessage("HABITAT HERO! You've safely returned all animals to their homes!", 'celebrating');
        }
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      }
    } else {
      setWrongAttempts(prev => prev + 1);
      if (onBuddyMessage) {
        if (wrongAttempts >= 2) {
          onBuddyMessage(`Think about the animal's features. Does it have thick fur for the cold?`, 'encouraging');
        } else {
          onBuddyMessage("Not quite! That's not their natural habitat.", 'thinking');
        }
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
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{(levelTitle || '').toUpperCase()}</h2>
          <p className="text-gray-500 font-bold mt-1">Match the animal to its home!</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <AnimatePresence mode="wait">
            {gameState === 'playing' ? (
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-48 h-48 bg-primary/5 rounded-full border-4 border-primary/20 flex items-center justify-center text-8xl shadow-[0_0_30px_rgba(14,165,233,0.1)]"
              >
                {data.animals[currentIndex].name.split(' ')[0]}
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-6 h-6" />
                HABITAT COMPLETE!
              </div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4 w-full">
            {data.habitats.map(habitat => (
              <button
                key={habitat}
                onClick={() => handleHabitatClick(habitat)}
                className="p-6 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 text-text-main"
              >
                {(habitat || '').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
