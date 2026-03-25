import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Droplets, RotateCcw, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface ScienceLabProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

type Color = 'red' | 'blue' | 'yellow' | 'none';

const COLOR_MAP: Record<string, string> = {
  'red+blue': 'purple',
  'blue+red': 'purple',
  'red+yellow': 'orange',
  'yellow+red': 'orange',
  'blue+yellow': 'green',
  'yellow+blue': 'green',
};

export const ScienceLab: React.FC<ScienceLabProps> = ({ levelId, levelTitle, onClose }) => {
  const [beaker1, setBeaker1] = useState<Color>('none');
  const [beaker2, setBeaker2] = useState<Color>('none');
  const [result, setResult] = useState<string>('none');
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  const targetColor = levelId === 12 ? 'purple' : levelId === 22 ? 'green' : 'orange';

  const mix = () => {
    if (beaker1 === 'none' || beaker2 === 'none') return;
    const combo = `${beaker1}+${beaker2}`;
    const mixedColor = COLOR_MAP[combo] || 'brown';
    setResult(mixedColor);

    if (mixedColor === targetColor) {
      setGameState('won');
      hustleService.addPoints(50); // Points for correct mix
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      hustleService.completeLevel(levelId, 1, [beaker1, beaker2, mixedColor]);
      hustleService.addXp(150);
    }
  };

  const reset = () => {
    setBeaker1('none');
    setBeaker2('none');
    setResult('none');
    setGameState('playing');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-2xl rounded-[2rem] border border-primary/10 p-8 relative overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{levelTitle.toUpperCase()}</h2>
          <p className="text-gray-500 font-bold mt-1">Goal: Create <span className="uppercase" style={{ color: targetColor }}>{targetColor}</span></p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex items-end gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className={`w-20 h-28 border-4 border-primary/20 rounded-b-3xl relative overflow-hidden bg-primary/5`}>
                {beaker1 !== 'none' && <div className={`absolute bottom-0 w-full h-3/4 opacity-80`} style={{ backgroundColor: beaker1 }} />}
              </div>
              <div className="flex gap-2">
                {['red', 'blue', 'yellow'].map(c => (
                  <button key={c} onClick={() => setBeaker1(c as Color)} className={`w-8 h-8 rounded-full border-2 border-primary/10 shadow-sm`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div className="text-3xl font-black text-gray-400 mb-12">+</div>

            <div className="flex flex-col items-center gap-4">
              <div className={`w-20 h-28 border-4 border-primary/20 rounded-b-3xl relative overflow-hidden bg-primary/5`}>
                {beaker2 !== 'none' && <div className={`absolute bottom-0 w-full h-3/4 opacity-80`} style={{ backgroundColor: beaker2 }} />}
              </div>
              <div className="flex gap-2">
                {['red', 'blue', 'yellow'].map(c => (
                  <button key={c} onClick={() => setBeaker2(c as Color)} className={`w-8 h-8 rounded-full border-2 border-primary/10 shadow-sm`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div className="text-3xl font-black text-gray-400 mb-12">=</div>

            <div className="flex flex-col items-center gap-4">
              <div className={`w-24 h-32 border-4 border-primary/30 rounded-b-3xl relative overflow-hidden bg-primary/10 shadow-[0_0_20px_rgba(14,165,233,0.05)]`}>
                {result !== 'none' && <div className={`absolute bottom-0 w-full h-3/4 opacity-90 transition-all duration-500`} style={{ backgroundColor: result }} />}
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Result</p>
            </div>
          </div>

          <div className="flex gap-4">
            {gameState === 'won' ? (
              <div className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                <CheckCircle2 className="w-6 h-6" />
                MISSION SUCCESS!
              </div>
            ) : (
              <>
                <button onClick={mix} disabled={beaker1 === 'none' || beaker2 === 'none'} className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50 transition-all hover:scale-105">
                  MIX CHEMICALS
                </button>
                <button onClick={reset} className="p-4 bg-primary/5 hover:bg-primary/10 rounded-2xl border border-primary/10 transition-all text-primary">
                  <RotateCcw className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
