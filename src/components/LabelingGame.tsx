import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface LabelingGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

const GAME_DATA: Record<number, { image: string, labels: { id: string, name: string, x: number, y: number }[] }> = {
  31: { // Anatomy
    image: 'https://picsum.photos/seed/anatomy/400/400?blur=2',
    labels: [
      { id: '1', name: 'Brain', x: 50, y: 20 },
      { id: '2', name: 'Heart', x: 50, y: 50 },
      { id: '3', name: 'Lungs', x: 30, y: 45 },
      { id: '4', name: 'Stomach', x: 50, y: 70 },
    ]
  },
  51: { // Solar System
    image: 'https://picsum.photos/seed/space/400/400?blur=2',
    labels: [
      { id: '1', name: 'Sun', x: 10, y: 50 },
      { id: '2', name: 'Earth', x: 40, y: 50 },
      { id: '3', name: 'Mars', x: 60, y: 50 },
      { id: '4', name: 'Jupiter', x: 85, y: 50 },
    ]
  }
};

export const LabelingGame: React.FC<LabelingGameProps> = ({ levelId, levelTitle, onClose }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[31];
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, boolean>>({});
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);

  const handleLabelClick = (labelId: string) => {
    if (gameState === 'won') return;
    setSelectedLabel(labelId);
  };

  const handlePointClick = (labelId: string) => {
    if (!selectedLabel || gameState === 'won') return;
    
    const isCorrect = selectedLabel === labelId;
    setMoves(prev => [...prev, { selected: selectedLabel, target: labelId, correct: isCorrect }]);

    if (isCorrect) {
      hustleService.addPoints(30); // Points for correct label
      const newMatches = { ...matches, [labelId]: true };
      setMatches(newMatches);
      setSelectedLabel(null);

      if (Object.keys(newMatches).length === data.labels.length) {
        setGameState('won');
        confetti({ particleCount: 150, spread: 70 });
        hustleService.completeLevel(levelId, 1, moves);
        hustleService.addXp(150);
      }
    } else {
      setSelectedLabel(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-3xl rounded-[2rem] border border-primary/10 p-8 relative shadow-[0_0_50px_rgba(14,165,233,0.1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{(levelTitle || '').toUpperCase()}</h2>
          <p className="text-gray-500 font-bold mt-1">Label the diagram!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 relative aspect-square bg-primary/5 rounded-3xl border border-primary/10 overflow-hidden">
            <img src={data.image} alt="Diagram" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            {data.labels.map(label => (
              <button
                key={label.id}
                onClick={() => handlePointClick(label.id)}
                disabled={matches[label.id]}
                style={{ left: `${label.x}%`, top: `${label.y}%` }}
                className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  matches[label.id] ? 'bg-primary border-primary text-white' : 'bg-white/80 border-primary/20 hover:scale-110 text-primary font-black'
                }`}
              >
                {matches[label.id] ? <CheckCircle2 className="w-5 h-5" /> : '?'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select a label:</p>
            {data.labels.map(label => (
              <button
                key={label.id}
                onClick={() => handleLabelClick(label.id)}
                disabled={matches[label.id]}
                className={`p-4 rounded-2xl border-2 font-bold transition-all text-left ${
                  matches[label.id] ? 'border-primary/20 bg-primary/5 opacity-50 text-gray-400' :
                  selectedLabel === label.id ? 'border-primary bg-primary/10 text-primary' : 'border-primary/5 bg-primary/5 hover:border-primary/10 text-text-main'
                }`}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>

        {gameState === 'won' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-10 text-center">
            <div className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)] mx-auto w-fit">
              <CheckCircle2 className="w-6 h-6" />
              LABELING COMPLETE!
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
