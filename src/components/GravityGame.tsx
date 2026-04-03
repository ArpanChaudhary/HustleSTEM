import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface GravityGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

const GAME_DATA: Record<number, { planets: { name: string, gravity: number }[] }> = {
  52: { // Gravity Sort (Class 5)
    planets: [
      { name: 'Moon', gravity: 1.6 },
      { name: 'Mars', gravity: 3.7 },
      { name: 'Earth', gravity: 9.8 },
      { name: 'Jupiter', gravity: 24.7 },
    ]
  }
};

export const GravityGame: React.FC<GravityGameProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[52];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Gravity is different everywhere! Can you find the planet that matches the gravity reading?", 'neutral');
    }
  }, []);

  const handleJump = (planetName: string) => {
    if (gameState === 'won') return;
    
    const currentPlanet = data.planets[currentIndex];
    const isCorrect = currentPlanet.name === planetName;
    setMoves(prev => [...prev, { planet: planetName, correct: isCorrect }]);

    if (isCorrect) {
      setWrongAttempts(0);
      hustleService.addPoints(30); // Points for correct jump
      if (onBuddyMessage) {
        onBuddyMessage("Perfect landing! You've mastered this planet's gravity.", 'happy');
      }
      if (currentIndex < data.planets.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('won');
        if (onBuddyMessage) {
          onBuddyMessage("SPACE EXPLORER! You've successfully navigated all gravity zones!", 'celebrating');
        }
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      }
    } else {
      setWrongAttempts(prev => prev + 1);
      if (onBuddyMessage) {
        if (wrongAttempts >= 2) {
          onBuddyMessage(`Hint: Smaller planets usually have lower gravity. Jupiter is the biggest!`, 'encouraging');
        } else {
          onBuddyMessage("Whoa! That gravity doesn't match our readings. Try another planet!", 'thinking');
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
          <p className="text-gray-500 font-bold mt-1">Jump to the planet with gravity: <span className="text-text-main">{data.planets[currentIndex].gravity} m/s²</span></p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center animate-bounce shadow-inner">
            <Rocket className="w-16 h-16 text-primary" />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {data.planets.map(planet => (
              <button
                key={planet.name}
                onClick={() => handleJump(planet.name)}
                className="p-6 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 text-text-main"
              >
                {(planet.name || '').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {gameState === 'won' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-10 text-center">
            <div className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)] mx-auto w-fit">
              <CheckCircle2 className="w-6 h-6" />
              GRAVITY COMPLETE!
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
