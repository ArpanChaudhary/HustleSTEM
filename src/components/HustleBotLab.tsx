import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Cpu, Zap, Shield, Rocket, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import { StudentProfile, hustleService } from '../services/hustleService';

interface HustleBotLabProps {
  profile: StudentProfile;
  onUpdate: (profile: StudentProfile) => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

const PARTS = {
  head: [
    { id: 'Classic', icon: Cpu, cost: 0 },
    { id: 'Sensor', icon: Zap, cost: 500 },
    { id: 'Visor', icon: Shield, cost: 1000 },
    { id: 'Aero', icon: Rocket, cost: 2000 },
  ],
  body: [
    { id: 'Classic', icon: Cpu, cost: 0 },
    { id: 'Core', icon: Zap, cost: 500 },
    { id: 'Plated', icon: Shield, cost: 1000 },
    { id: 'Reactor', icon: Rocket, cost: 2000 },
  ],
  arms: [
    { id: 'Classic', icon: Cpu, cost: 0 },
    { id: 'Servo', icon: Zap, cost: 500 },
    { id: 'Heavy', icon: Shield, cost: 1000 },
    { id: 'Plasma', icon: Rocket, cost: 2000 },
  ],
  legs: [
    { id: 'Classic', icon: Cpu, cost: 0 },
    { id: 'Hydraulic', icon: Zap, cost: 500 },
    { id: 'Tracked', icon: Shield, cost: 1000 },
    { id: 'Hover', icon: Rocket, cost: 2000 },
  ],
};

export const HustleBotLab: React.FC<HustleBotLabProps> = ({ profile, onUpdate, onBuddyMessage }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof PARTS>('head');

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Welcome to my home! You can use your points to upgrade my parts and make me even more powerful.", 'happy');
    }
  }, []);

  const handlePartSelect = (partId: string, cost: number) => {
    if (profile.unlockedBotParts.includes(partId)) {
      const newProfile = hustleService.setBotPart(activeTab, partId);
      onUpdate(newProfile);
      if (onBuddyMessage) {
        onBuddyMessage(`Looking good! This ${partId} ${activeTab} really suits me.`, 'happy');
      }
    } else if (profile.points >= cost) {
      const result = hustleService.unlockBotPart(partId, cost);
      if (result.success) {
        const newProfile = hustleService.setBotPart(activeTab, partId);
        onUpdate(newProfile);
        if (onBuddyMessage) {
          onBuddyMessage(`WOW! Thank you for the upgrade! I feel like a brand new robot!`, 'celebrating');
        }
      }
    } else {
      if (onBuddyMessage) {
        onBuddyMessage(`We need ${cost - profile.points} more points to unlock this part. Let's complete more missions!`, 'thinking');
      }
    }
  };

  return (
    <div id="bot-lab" className="glass-card p-8 text-white relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12">
        {/* Bot Preview Section */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-3xl p-12 border border-white/10 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-primary tracking-tight uppercase italic">Hustle-Bot Lab</h2>
            <p className="text-slate-400 font-mono text-sm">Build your ultimate STEM companion</p>
          </div>

          <div className="relative w-64 h-80 flex flex-col items-center">
            {/* Head */}
            <motion.div 
              key={profile.botLab.head}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-24 h-24 bg-sky-500 rounded-2xl mb-2 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.3)] border-4 border-sky-300"
            >
              <Cpu className="w-12 h-12 text-white" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-4 bg-sky-300 rounded-full" />
            </motion.div>

            {/* Arms & Body */}
            <div className="flex items-start gap-2">
              <motion.div 
                key={profile.botLab.arms + 'left'}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-12 h-32 bg-sky-600 rounded-full mt-4 shadow-lg border-2 border-sky-400" 
              />
              <motion.div 
                key={profile.botLab.body}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-40 bg-sky-500 rounded-3xl flex items-center justify-center shadow-xl border-4 border-sky-300 relative"
              >
                <div className="w-16 h-16 rounded-full bg-sky-900/50 flex items-center justify-center border-2 border-sky-300/30">
                  <Zap className="w-8 h-8 text-sky-300 animate-pulse" />
                </div>
              </motion.div>
              <motion.div 
                key={profile.botLab.arms + 'right'}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-12 h-32 bg-sky-600 rounded-full mt-4 shadow-lg border-2 border-sky-400" 
              />
            </div>

            {/* Legs */}
            <div className="flex gap-8 -mt-2">
              <motion.div 
                key={profile.botLab.legs + 'left'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-10 h-20 bg-sky-700 rounded-b-2xl shadow-lg border-2 border-sky-500" 
              />
              <motion.div 
                key={profile.botLab.legs + 'right'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-10 h-20 bg-sky-700 rounded-b-2xl shadow-lg border-2 border-sky-500" 
              />
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <div className="bg-slate-900/80 px-6 py-3 rounded-2xl border border-sky-500/30 flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-black text-xl">{profile.points}</span>
            </div>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            {(['head', 'body', 'arms', 'legs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-slate-900 shadow-lg' 
                    : 'text-slate-400 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {PARTS[activeTab].map((part) => {
              const isUnlocked = profile.unlockedBotParts.includes(part.id);
              const isActive = profile.botLab[activeTab] === part.id;
              const canAfford = profile.points >= part.cost;

              return (
                <button
                  key={part.id}
                  onClick={() => handlePartSelect(part.id, part.cost)}
                  disabled={!isUnlocked && !canAfford}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    isActive 
                      ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                      : isUnlocked
                      ? 'bg-white/5 border-white/10 hover:border-primary/50'
                      : 'bg-slate-900/50 border-white/5 opacity-80'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-primary text-slate-900' : 'bg-white/10 text-slate-400'
                  }`}>
                    <part.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg">{part.id}</div>
                    {!isUnlocked && (
                      <div className="flex items-center gap-1 text-amber-400 font-mono text-sm">
                        <Zap className="w-3 h-3" />
                        {part.cost}
                      </div>
                    )}
                  </div>

                  {isActive ? (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-slate-900" />
                    </div>
                  ) : !isUnlocked ? (
                    <Lock className={`w-5 h-5 ${canAfford ? 'text-slate-500' : 'text-red-500'}`} />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto p-6 bg-primary/5 rounded-3xl border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary uppercase text-sm tracking-widest">System Status</span>
            </div>
            <p className="text-slate-400 text-xs font-mono leading-relaxed">
              All systems operational. Bot customization allows for specialized STEM mission performance. Earn more points to unlock advanced components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
