/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogicMaze } from './components/LogicMaze';
import { ScienceLab } from './components/ScienceLab';
import { StemQuiz } from './components/StemQuiz';
import { MatchingGame } from './components/MatchingGame';
import { SequenceGame } from './components/SequenceGame';
import { SortingGame } from './components/SortingGame';
import { MemoryGame } from './components/MemoryGame';
import { MathGame } from './components/MathGame';
import { ScrambleGame } from './components/ScrambleGame';
import { LabelingGame } from './components/LabelingGame';
import { CircuitGame } from './components/CircuitGame';
import { HabitatGame } from './components/HabitatGame';
import { BinaryGame } from './components/BinaryGame';
import { GravityGame } from './components/GravityGame';
import { LifeCycleGame } from './components/LifeCycleGame';
import { hustleService, StudentProfile } from './services/hustleService';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Beaker, 
  User, 
  Coins, 
  ChevronRight, 
  Menu, 
  X,
  Rocket,
  PawPrint,
  Zap,
  Bot,
  Star,
  TrendingUp,
  Lock,
  Unlock,
  Award,
  Bell,
  Flame,
  Cpu,
  Palette,
  Sparkles,
  BookOpen,
  LogOut
} from 'lucide-react';
import { Auth } from './components/Auth';
import { HustleBotLab } from './components/HustleBotLab';
import { AchievementBadges } from './components/AchievementBadges';
import { SmartWhiteboard } from './components/SmartWhiteboard';
import { SymmetryPainter } from './components/SymmetryPainter';
import { StickerBook } from './components/StickerBook';
import confetti from 'canvas-confetti';

interface Mission {
  id: number;
  title: string;
  xp: number;
  cost: number;
  icon: React.ReactNode;
  type: 'maze' | 'lab' | 'quiz' | 'matching' | 'sequence' | 'sorting' | 'memory' | 'math' | 'scramble' | 'labeling' | 'circuit' | 'habitat' | 'binary' | 'gravity' | 'lifecycle';
}

type ClassLevel = 1 | 2 | 3 | 4 | 5;

const missionsByClass: Record<ClassLevel, Mission[]> = {
  1: [
    { id: 11, title: "Lion's Path", xp: 100, cost: 0, icon: <PawPrint className="w-8 h-8" />, type: 'maze' },
    { id: 12, title: "Color Lab", xp: 150, cost: 0, icon: <Beaker className="w-8 h-8" />, type: 'lab' },
    { id: 13, title: "Animal Match", xp: 200, cost: 0, icon: <Bot className="w-8 h-8" />, type: 'matching' },
  ],
  2: [
    { id: 21, title: "Pattern Builder", xp: 100, cost: 200, icon: <Zap className="w-8 h-8" />, type: 'sequence' },
    { id: 22, title: "Life Cycle", xp: 150, cost: 200, icon: <Beaker className="w-8 h-8" />, type: 'lifecycle' },
    { id: 23, title: "Animal Memory", xp: 200, cost: 200, icon: <Bot className="w-8 h-8" />, type: 'memory' },
  ],
  3: [
    { id: 31, title: "Anatomy Labeling", xp: 100, cost: 400, icon: <Beaker className="w-8 h-8" />, type: 'labeling' },
    { id: 32, title: "Habitat Match", xp: 150, cost: 400, icon: <Beaker className="w-8 h-8" />, type: 'habitat' },
    { id: 33, title: "Math Challenge", xp: 200, cost: 400, icon: <Bot className="w-8 h-8" />, type: 'math' },
  ],
  4: [
    { id: 41, title: "Circuit Builder", xp: 100, cost: 600, icon: <Zap className="w-8 h-8" />, type: 'circuit' },
    { id: 42, title: "Binary Decoder", xp: 150, cost: 600, icon: <Beaker className="w-8 h-8" />, type: 'binary' },
    { id: 43, title: "Robot Scramble", xp: 200, cost: 600, icon: <Bot className="w-8 h-8" />, type: 'scramble' },
  ],
  5: [
    { id: 51, title: "Planet Order", xp: 100, cost: 800, icon: <Rocket className="w-8 h-8" />, type: 'labeling' },
    { id: 52, title: "Gravity Jump", xp: 150, cost: 800, icon: <Beaker className="w-8 h-8" />, type: 'gravity' },
    { id: 53, title: "Space Quiz", xp: 200, cost: 800, icon: <Bot className="w-8 h-8" />, type: 'quiz' },
  ],
};

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const p = await hustleService.getProfile();
      setProfile(p);
    };
    initAuth();
  }, []);

  const handleLogin = (userProfile: StudentProfile) => {
    setProfile(userProfile);
  };

  const handleLogout = () => {
    hustleService.logout();
    setProfile(null);
  };

  const [selectedClass, setSelectedClass] = useState<ClassLevel>(1);
  
  useEffect(() => {
    if (profile) {
      setSelectedClass(profile.classLevel as ClassLevel);
      hustleService.checkStreak();
    }
  }, [profile]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Mission Map');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Check streak on mount
    if (!profile) return;
    const newStreak = hustleService.checkStreak();
    if (newStreak > profile.streak) {
      refreshProfile();
      setNotification(`Streak Maintained! ${newStreak} days!`);
      setTimeout(() => setNotification(null), 5000);
      
      if (newStreak === 3) checkBadge('streak_3');
      if (newStreak === 7) checkBadge('streak_7');
    }
  }, [profile]);

  const checkBadge = (badgeId: string) => {
    const earned = hustleService.addBadge(badgeId);
    if (earned) {
      refreshProfile();
      setNotification(`New Achievement: ${badgeId.replace('_', ' ')}!`);
      setTimeout(() => setNotification(null), 5000);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0EA5E9', '#ffffff', '#F0F9FF']
      });
    }
  };

  const refreshProfile = async () => {
    const newProfile = await hustleService.getProfile();
    if (!newProfile) return;
    setProfile(newProfile);
    
    // Milestone check
    if (newProfile.completedLevels.length === 1 && !notification) {
      setNotification(`You are in the Top 10% of Class ${newProfile.classLevel} Hustlers in India!`);
      setTimeout(() => setNotification(null), 5000);
      checkBadge('first_mission');
    }

    // Check for subject badges
    const completedBySubject = (type: string) => {
      return newProfile.completedLevels.filter(id => {
        const mission = Object.values(missionsByClass).flat().find(m => m.id === id);
        return mission?.type === type;
      }).length;
    };

    if (completedBySubject('math') >= 5) checkBadge('math_whiz');
    if (completedBySubject('lab') >= 5) checkBadge('science_star');
    if (completedBySubject('scramble') >= 5) checkBadge('tech_titan');
    if (completedBySubject('maze') >= 5) checkBadge('logic_legend');
    if (newProfile.points >= 5000) checkBadge('point_master');
  };

  const handleBuySkin = async (skin: string, cost: number) => {
    const result = hustleService.unlockSkin(skin, cost);
    if (result.success) {
      await refreshProfile();
      setNotification(`${skin} unlocked!`);
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification("Not enough Points, Hustler! Keep grinding!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUnlockLevel = async (levelId: number, cost: number) => {
    const result = hustleService.unlockLevel(levelId, cost);
    if (result.success) {
      await refreshProfile();
      setNotification(`Mission ${levelId} unlocked!`);
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification("Not enough Points to unlock this mission!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSetSkin = async (skin: string) => {
    hustleService.setActiveSkin(skin);
    await refreshProfile();
  };

  const navItems = [
    { name: 'Mission Map', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Smart Whiteboard', icon: <Palette className="w-5 h-5" /> },
    { name: 'Bot Lab', icon: <Cpu className="w-5 h-5" /> },
    { name: 'Achievements', icon: <Award className="w-5 h-5" /> },
    { name: 'STEAM Sandbox', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Sticker Book', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Hustle Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Science Lab', icon: <Beaker className="w-5 h-5" /> },
    { name: 'Parent Report', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  if (!profile) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col md:flex-row overflow-hidden">
      {/* Game Modal */}
      <AnimatePresence>
        {selectedMission && (
          <>
            {selectedMission.type === 'maze' && (
              <LogicMaze 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'lab' && (
              <ScienceLab 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'quiz' && (
              <StemQuiz 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'matching' && (
              <MatchingGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'sequence' && (
              <SequenceGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'sorting' && (
              <SortingGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'memory' && (
              <MemoryGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'math' && (
              <MathGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'scramble' && (
              <ScrambleGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'labeling' && (
              <LabelingGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'circuit' && (
              <CircuitGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'habitat' && (
              <HabitatGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'binary' && (
              <BinaryGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'gravity' && (
              <GravityGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
            {selectedMission.type === 'lifecycle' && (
              <LifeCycleGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onClose={async () => {
                  setSelectedMission(null);
                  await refreshProfile();
                }} 
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Milestone Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-[0_0_30_rgba(14,165,233,0.5)] flex items-center gap-4 border-2 border-white/20"
          >
            <Bell className="w-6 h-6 animate-bounce" />
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-primary/10 bg-background z-50">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/30">
          <Coins className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm text-primary">{profile.points} PTS</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed md:relative top-0 left-0 h-full w-64 bg-surface border-r border-primary/10 z-50 flex flex-col ${!isSidebarOpen && 'hidden md:flex'}`}
          >
            <div className="p-6 flex items-center justify-between">
              <h1 className="text-xl font-black tracking-tighter italic text-primary">
                HUSTLE<span className="text-text-main">STEM</span>
              </h1>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-text-main">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.name 
                      ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                      : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-primary/10 space-y-4">
              {/* User Profile & Logout */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-text-main truncate">{profile.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class {profile.classLevel}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-xl transition-colors group"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Streak Display */}
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Streak</div>
                  <div className="text-lg font-black text-orange-600">{profile.streak} Days</div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Daily Goal</p>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-3/4 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                </div>
                <p className="text-xs text-right mt-2 text-primary font-bold">750/1000 XP</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-end p-6 gap-6">
          <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/30 shadow-[inset_0_0_10px_rgba(14,165,233,0.1)]">
            <Coins className="w-5 h-5 text-primary" />
            <span className="font-black text-lg tracking-tight text-primary">{profile.points} <span className="text-xs text-gray-500">HUSTLE-POINTS</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-black text-text-main">{profile.name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class {profile.classLevel}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all group"
              title="Logout"
            >
              <LogOut className="w-6 h-6 text-primary group-hover:text-red-500 group-hover:scale-110 transition-all" />
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
          {activeTab === 'Mission Map' && (
            <>
              {/* Class Selector */}
              <section className="mb-10">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Select Your Level</h2>
                <div className="flex flex-wrap gap-3">
                  {([1, 2, 3, 4, 5] as ClassLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedClass(level)}
                      className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 border-2 ${
                        selectedClass === level
                          ? 'bg-primary border-primary text-white scale-105 shadow-[0_0_20px_rgba(14,165,233,0.4)]'
                          : 'bg-surface border-primary/10 text-gray-500 hover:border-primary/50'
                      }`}
                    >
                      CLASS {level}
                    </button>
                  ))}
                </div>
              </section>

              {/* Mission Map */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">MISSION MAP</h2>
                    <p className="text-gray-400 mt-1">Class {selectedClass} • {selectedClass === 1 ? 'Animals' : selectedClass === 5 ? 'Space' : 'Science'} Explorer</p>
                  </div>
                  <div className="hidden sm:block px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 text-xs font-bold text-gray-500">
                    {profile.completedLevels.length} / 50 LEVELS DONE
                  </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {missionsByClass[selectedClass].map((mission, idx) => {
                    const isCompleted = profile.completedLevels.includes(mission.id);
                    const isUnlocked = profile.unlockedLevels.includes(mission.id);
                    
                    return (
                      <motion.div
                        key={`${selectedClass}-${mission.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => {
                          if (isUnlocked) {
                            setSelectedMission(mission);
                          } else {
                            handleUnlockLevel(mission.id, mission.cost);
                          }
                        }}
                        className={`group relative bg-surface rounded-3xl p-8 border transition-all duration-500 cursor-pointer overflow-hidden ${
                          isCompleted ? 'border-primary/40 bg-primary/5' : 
                          !isUnlocked ? 'border-primary/5 opacity-80 grayscale hover:grayscale-0' :
                          'border-primary/10 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10'
                        }`}
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          {mission.icon}
                        </div>
                        
                        <div className={`w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-500 border border-primary/5 ${
                          isCompleted ? 'border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : 
                          !isUnlocked ? 'text-gray-400' : ''
                        }`}>
                          {isUnlocked ? mission.icon : <Lock className="w-8 h-8" />}
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-xl font-black transition-colors ${!isUnlocked ? 'text-gray-400' : 'group-hover:text-primary'}`}>
                            {isUnlocked ? mission.title : 'LOCKED MISSION'}
                          </h3>
                          {isCompleted && (
                            <div className="bg-primary/20 p-1 rounded-full">
                              <Star className="w-4 h-4 text-primary fill-primary" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                          <Coins className="w-4 h-4 text-primary/70" />
                          <span>{isUnlocked ? `${mission.xp} XP REWARD` : `${mission.cost} PTS TO UNLOCK`}</span>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">
                            {isCompleted ? 'Replay Mission' : isUnlocked ? 'Start Mission' : 'Unlock Now'}
                          </span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform ${
                            isUnlocked ? 'bg-primary text-white' : 'bg-primary/5 text-gray-400'
                          }`}>
                            {isUnlocked ? <ChevronRight className="w-5 h-5" /> : <Unlock className="w-4 h-4" />}
                          </div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {activeTab === 'Smart Whiteboard' && (
            <SmartWhiteboard />
          )}

          {activeTab === 'Bot Lab' && (
            <HustleBotLab profile={profile} onUpdate={setProfile} />
          )}

          {activeTab === 'Achievements' && (
            <AchievementBadges profile={profile} />
          )}

          {activeTab === 'STEAM Sandbox' && (
            <SymmetryPainter />
          )}

          {activeTab === 'Sticker Book' && (
            <StickerBook />
          )}

          {activeTab === 'Hustle Shop' && (
            <section>
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-8">HUSTLE SHOP</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Default Bot', cost: 0, color: 'text-primary' },
                  { name: 'Golden Bot', cost: 500, color: 'text-yellow-400' },
                  { name: 'Neon Bot', cost: 1000, color: 'text-cyan-400' },
                  { name: 'Space Bot', cost: 2000, color: 'text-purple-400' },
                ].map((skin) => (
                  <div key={skin.name} className="bg-surface p-6 rounded-3xl border border-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center ${skin.color}`}>
                        <Bot className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-text-main">{skin.name}</h3>
                        <p className="text-sm text-gray-500">{skin.cost} PTS</p>
                      </div>
                    </div>
                    {profile.unlockedSkins.includes(skin.name) ? (
                      <button 
                        onClick={() => handleSetSkin(skin.name)}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${profile.activeSkin === skin.name ? 'bg-primary text-white' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                      >
                        {profile.activeSkin === skin.name ? 'ACTIVE' : 'EQUIP'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBuySkin(skin.name, skin.cost)}
                        className="px-6 py-2 bg-primary/5 hover:bg-primary hover:text-white rounded-xl font-bold transition-all border border-primary/10 text-primary"
                      >
                        UNLOCK
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'Parent Report' && (
            <section>
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-2">PARENT REPORT</h2>
              <p className="text-gray-400 mb-8">Tracking {profile.name}'s Hustle Journey</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-surface p-8 rounded-3xl border border-primary/5 text-center shadow-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Hustle Score</p>
                  <div className="text-5xl font-black text-primary mb-2">{hustleService.calculateHustleScore()}%</div>
                  <p className="text-xs text-gray-500">Based on problem-solving speed</p>
                </div>
                <div className="bg-surface p-8 rounded-3xl border border-primary/5 text-center shadow-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Levels Completed</p>
                  <div className="text-5xl font-black text-text-main mb-2">{profile.completedLevels.length}</div>
                  <p className="text-xs text-gray-500">Out of 50 total missions</p>
                </div>
                <div className="bg-surface p-8 rounded-3xl border border-primary/5 text-center shadow-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Hustle Points</p>
                  <div className="text-5xl font-black text-yellow-500 mb-2">{profile.points}</div>
                  <p className="text-xs text-gray-500">Available to spend in shop</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface p-8 rounded-3xl border border-primary/5 shadow-sm">
                  <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-text-main">
                    <Award className="w-6 h-6 text-primary" />
                    Skill Breakdown
                  </h3>
                  <div className="space-y-6">
                    {[
                      { name: 'Logic & Reasoning', value: 85 },
                      { name: 'Spatial Awareness', value: 72 },
                      { name: 'Persistence', value: 94 },
                      { name: 'STEM Knowledge', value: 60 },
                    ].map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-sm font-bold mb-2 text-gray-700">
                          <span>{skill.name}</span>
                          <span className="text-primary">{skill.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            className="bg-primary h-full shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface p-8 rounded-3xl border border-primary/5 shadow-sm">
                  <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-text-main">
                    <LayoutDashboard className="w-6 h-6 text-primary" />
                    Recent Hustles
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {profile.completedLevels.length === 0 ? (
                      <p className="text-gray-500 text-center py-10 font-bold italic">No missions completed yet, Hustler!</p>
                    ) : (
                      profile.completedLevels.slice().reverse().map((levelId) => {
                        const moves = profile.levelMoves?.[levelId]?.[0] || [];
                        return (
                          <div key={levelId} className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-black text-sm text-primary">Level {levelId}</span>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                {moves.length} Actions Recorded
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {moves.map((move: any, i: number) => (
                                <div key={i} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-mono text-gray-500">
                                  {typeof move === 'string' ? move[0].toUpperCase() : i + 1}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
