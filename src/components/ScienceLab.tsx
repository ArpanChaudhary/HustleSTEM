import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Droplets, RotateCcw, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface ScienceLabProps {
  levelId: number;
  levelTitle: string;
  onClose: (reward?: any, performance?: { accuracy: number; time: number }) => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
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

export const ScienceLab: React.FC<ScienceLabProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const [beaker1, setBeaker1] = useState<Color>('none');
  const [beaker2, setBeaker2] = useState<Color>('none');
  const [result, setResult] = useState<string>('none');
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [hint, setHint] = useState<string | null>(null);

  const targetColor = levelId === 12 ? 'purple' : levelId === 35 ? 'green' : 'orange';

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage(`The jungle flowers need ${targetColor} potion! Mix two primary colors to create it.`, 'neutral');
    }
  }, [targetColor]);

  const mix = () => {
    if (beaker1 === 'none' || beaker2 === 'none') return;
    const combo = `${beaker1}+${beaker2}`;
    const mixedColor = COLOR_MAP[combo] || 'brown';
    setResult(mixedColor);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setHint(null);

    if (mixedColor === targetColor) {
      setGameState('won');
      if (onBuddyMessage) {
        onBuddyMessage(`PERFECT MIX! The ${targetColor} potion is ready to save the jungle!`, 'celebrating');
      }
      hustleService.addPoints(50); // Points for correct mix
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      const reward = hustleService.completeLevel(levelId, 1, [beaker1, beaker2, mixedColor]);
      hustleService.addXp(150);
      
      const accuracy = Math.max(10, 100 - (newAttempts - 1) * 25);
      const time = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => onClose(reward, { accuracy, time }), 2000);
    } else {
      setHint(`That's ${mixedColor}! Remember: ${targetColor === 'purple' ? 'Red + Blue = Purple' : targetColor === 'green' ? 'Blue + Yellow = Green' : 'Red + Yellow = Orange'}`);
      if (onBuddyMessage) {
        if (newAttempts >= 2) {
          onBuddyMessage(`Remember: Red + Blue = Purple, Red + Yellow = Orange, Blue + Yellow = Green!`, 'encouraging');
        } else {
          onBuddyMessage(`That's ${mixedColor}, but we need ${targetColor}. Let's try another combination!`, 'thinking');
        }
      }
    }
  };

  const reset = () => {
    setBeaker1('none');
    setBeaker2('none');
    setResult('none');
    setGameState('playing');
    setHint(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-2xl rounded-[2.5rem] border border-primary/20 p-10 relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] glass"
      >
        <button onClick={() => onClose()} className="absolute top-8 right-8 p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black italic text-primary tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{(levelTitle || '').toUpperCase()}</h2>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Goal: Create <span className="font-black" style={{ color: targetColor }}>{targetColor}</span></p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex items-end gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className={`w-20 h-28 border-4 border-white/10 rounded-b-3xl relative overflow-hidden bg-white/5 shadow-inner`}>
                {beaker1 !== 'none' && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '75%' }}
                    className="absolute bottom-0 w-full opacity-80"
                    style={{ backgroundColor: beaker1 }}
                  />
                )}
              </div>
              <div className="flex gap-2">
                {['red', 'blue', 'yellow'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setBeaker1(c as Color)} 
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-90 ${beaker1 === c ? 'border-white shadow-[0_0_10px_currentColor]' : 'border-white/10'}`} 
                    style={{ backgroundColor: c }} 
                  />
                ))}
              </div>
            </div>

            <div className="text-4xl font-black text-white/20 mb-14">+</div>

            <div className="flex flex-col items-center gap-4">
              <div className={`w-20 h-28 border-4 border-white/10 rounded-b-3xl relative overflow-hidden bg-white/5 shadow-inner`}>
                {beaker2 !== 'none' && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '75%' }}
                    className="absolute bottom-0 w-full opacity-80"
                    style={{ backgroundColor: beaker2 }}
                  />
                )}
              </div>
              <div className="flex gap-2">
                {['red', 'blue', 'yellow'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setBeaker2(c as Color)} 
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-90 ${beaker2 === c ? 'border-white shadow-[0_0_10px_currentColor]' : 'border-white/10'}`} 
                    style={{ backgroundColor: c }} 
                  />
                ))}
              </div>
            </div>

            <div className="text-4xl font-black text-white/20 mb-14">=</div>

            <div className="flex flex-col items-center gap-4">
              <div className={`w-24 h-32 border-4 rounded-b-3xl relative overflow-hidden bg-white/5 transition-all duration-500 ${
                gameState === 'won' ? 'border-success success-glow animate-success bg-success/10' : 
                result !== 'none' && result !== targetColor ? 'border-danger animate-shake bg-danger/10' : 
                'border-white/10'
              }`}>
                {result !== 'none' && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '75%' }}
                    className="absolute bottom-0 w-full opacity-90"
                    style={{ backgroundColor: result }}
                  />
                )}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Result</p>
            </div>
          </div>

          <AnimatePresence>
            {hint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl text-amber-400 text-xs font-bold text-center italic"
              >
                💡 {hint}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-6">
            {gameState === 'won' ? (
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3 bg-success text-slate-900 px-10 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(16,185,129,0.4)] uppercase tracking-widest"
              >
                <CheckCircle2 className="w-6 h-6" />
                MISSION SUCCESS!
              </motion.div>
            ) : (
              <>
                <button 
                  onClick={mix} 
                  disabled={beaker1 === 'none' || beaker2 === 'none'} 
                  className="px-12 py-4 bg-primary text-slate-900 font-black rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.3)] disabled:opacity-50 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                >
                  MIX CHEMICALS
                </button>
                <button 
                  onClick={reset} 
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-primary group"
                >
                  <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
