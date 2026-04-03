import React from 'react';
import { motion } from 'motion/react';
import { Bot, Play, X, Rocket, Shield, Zap, Target } from 'lucide-react';

interface MissionBriefingProps {
  mission: {
    title: string;
    story: string;
    objective: string;
    xp: number;
    icon: React.ReactNode;
  };
  onStart: () => void;
  onClose: () => void;
  theme: string;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ mission, onStart, onClose, theme }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-dark w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col"
      >
        <div className="p-8 md:p-12 flex flex-col items-center text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-xs font-black text-primary uppercase tracking-[0.2em]">
            <Rocket className="w-4 h-4" />
            {theme}
          </div>

          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 shadow-[0_0_40px_rgba(14,165,233,0.2)] border border-primary/20">
            {mission.icon}
          </div>

          <h2 className="text-4xl md:text-5xl font-hustle font-black italic tracking-tighter text-white mb-6 uppercase">
            {mission.title}
          </h2>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl border-2 border-primary/20 flex items-center justify-center text-primary">
              <Bot className="w-8 h-8" />
            </div>
            <p className="text-lg md:text-xl font-bold text-slate-300 leading-relaxed italic">
              "{mission.story}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-10">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Objective</p>
                <p className="text-sm font-bold text-white">{mission.objective}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reward</p>
                <p className="text-sm font-bold text-white">{mission.xp} XP</p>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full py-5 bg-primary text-slate-950 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-current" />
            START MISSION
          </button>
        </div>
      </motion.div>
    </div>
  );
};
