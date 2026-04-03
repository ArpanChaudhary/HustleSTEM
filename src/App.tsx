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
import { hustleService, StudentProfile, UserRole } from './services/hustleService';
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
  Target,
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
  LogOut,
  Users,
  Share2,
  Settings,
  ShieldCheck,
  Globe,
  Activity,
  Database,
  BarChart3,
  Trophy,
  Calendar,
  Gift,
  Shield,
  ArrowUp,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Sprout,
  Shapes,
  Dna,
  Brain,
  CloudSun,
  Box,
  Calculator,
  Binary,
  Code,
  Waves,
  Percent,
  Compass,
  Microscope,
  Terminal,
  Lightbulb,
} from 'lucide-react';
import { Auth } from './components/Auth';
import { Certificate } from './components/Certificate';
import { HustleBotLab } from './components/HustleBotLab';
import { AchievementBadges } from './components/AchievementBadges';
import { SmartWhiteboard } from './components/SmartWhiteboard';
import { SymmetryPainter } from './components/SymmetryPainter';
import { StickerBook } from './components/StickerBook';
import { StemModels } from './components/StemModels';
import { FloatingBackground } from './components/FloatingBackground';
import { AIBuddy } from './components/AIBuddy';
import { EmotionalAITutor } from './components/EmotionalAITutor';
import { MissionBriefing } from './components/MissionBriefing';
import confetti from 'canvas-confetti';

const classThemes: Record<ClassLevel, string> = {
  1: "Jungle Adventure",
  2: "Space Explorer",
  3: "Robot City",
  4: "Ocean World",
  5: "Future Lab"
};

const CelebrationOverlay = ({ title, message, onClose }: { title: string; message: string; onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[300] bg-white/80 backdrop-blur-xl flex items-center justify-center p-6"
  >
    <motion.div
      initial={{ scale: 0.5, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white max-w-lg w-full rounded-[3rem] border-4 border-primary/30 p-12 text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: 3 }}
        className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <Trophy className="w-12 h-12 text-primary" />
      </motion.div>
      <h2 className="text-5xl font-black italic tracking-tighter text-slate-900 mb-4 uppercase leading-none">{title}</h2>
      <p className="text-xl font-bold text-slate-600 mb-10 leading-relaxed">{message}</p>
      <button 
        onClick={onClose}
        className="w-full py-5 bg-primary text-slate-900 font-black rounded-2xl text-xl shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform"
      >
        YOU'RE AWESOME!
      </button>
    </motion.div>
  </motion.div>
);

interface Mission {
  id: number;
  title: string;
  story: string;
  objective: string;
  xp: number;
  cost: number;
  icon: React.ReactNode;
  type: 'maze' | 'lab' | 'quiz' | 'matching' | 'sequence' | 'sorting' | 'memory' | 'math' | 'scramble' | 'labeling' | 'circuit' | 'habitat' | 'binary' | 'gravity' | 'lifecycle';
  subject: 'math' | 'science' | 'tech' | 'logic';
  level: number;
}

type ClassLevel = 1 | 2 | 3 | 4 | 5;

const missionsByClass: Record<ClassLevel, Mission[]> = {
  1: [
    { id: 11, title: "Lion's Path", xp: 100, cost: 0, icon: <PawPrint className="w-8 h-8" />, type: 'maze', subject: 'logic', level: 1, story: "A baby lion is lost in the thick jungle! Use your logic to guide him back to his family.", objective: "Reach the family pride" },
    { id: 12, title: "Color Lab", xp: 150, cost: 0, icon: <Beaker className="w-8 h-8" />, type: 'lab', subject: 'science', level: 1, story: "The jungle flowers have lost their color. Mix the right potions to bring back the vibrant jungle!", objective: "Restore the flowers" },
    { id: 13, title: "Animal Match", xp: 200, cost: 0, icon: <Bot className="w-8 h-8" />, type: 'matching', subject: 'logic', level: 2, story: "The jungle animals are all mixed up. Help them find their pairs so they can play together.", objective: "Match all animals" },
    { id: 14, title: "Plant Growth", xp: 150, cost: 0, icon: <Sprout className="w-8 h-8" />, type: 'lifecycle', subject: 'science', level: 1, story: "How does a tiny seed become a big tree? Sequence the growth stages of a jungle plant.", objective: "Sequence the growth" },
    { id: 15, title: "Counting Stars", xp: 100, cost: 0, icon: <Star className="w-8 h-8" />, type: 'math', subject: 'math', level: 1, story: "The night sky is beautiful! Count the stars to help the jungle animals find their way.", objective: "Count the stars" },
  ],
  2: [
    { id: 21, title: "Pattern Builder", xp: 100, cost: 200, icon: <Shapes className="w-8 h-8" />, type: 'sequence', subject: 'logic', level: 3, story: "Our spaceship's navigation system is broken! Fix the patterns to stay on course to Mars.", objective: "Complete the patterns" },
    { id: 22, title: "Life Cycle", xp: 150, cost: 200, icon: <Dna className="w-8 h-8" />, type: 'lifecycle', subject: 'science', level: 3, story: "We've found alien life! Study how they grow from eggs to adults to understand them.", objective: "Sequence the life cycle" },
    { id: 23, title: "Animal Memory", xp: 200, cost: 200, icon: <Brain className="w-8 h-8" />, type: 'memory', subject: 'logic', level: 4, story: "The space station's database is scrambled. Match the creature files to restore the records.", objective: "Find all pairs" },
    { id: 24, title: "Weather Watch", xp: 150, cost: 200, icon: <CloudSun className="w-8 h-8" />, type: 'sorting', subject: 'science', level: 3, story: "Mars has strange weather! Sort the weather symbols to help the astronauts prepare.", objective: "Sort the weather" },
    { id: 25, title: "Shape Sorter", xp: 100, cost: 200, icon: <Box className="w-8 h-8" />, type: 'sorting', subject: 'math', level: 3, story: "The cargo bay is a mess! Sort the space supplies by their shape to save space.", objective: "Sort by shape" },
  ],
  3: [
    { id: 31, title: "Anatomy Labeling", xp: 100, cost: 400, icon: <Activity className="w-8 h-8" />, type: 'labeling', subject: 'science', level: 5, story: "The Robot City mayor needs a checkup. Label his parts to make sure he's running smoothly.", objective: "Label all parts" },
    { id: 32, title: "Habitat Match", xp: 150, cost: 400, icon: <Globe className="w-8 h-8" />, type: 'habitat', subject: 'science', level: 6, story: "Robots from different planets are arriving. Help them find the right home in our city.", objective: "Match habitats" },
    { id: 33, title: "Math Challenge", xp: 200, cost: 400, icon: <Calculator className="w-8 h-8" />, type: 'math', subject: 'math', level: 5, story: "The city's power grid is failing! Solve the math puzzles to reboot the energy core.", objective: "Solve the equations" },
    { id: 34, title: "Robot Parts", xp: 150, cost: 400, icon: <Cpu className="w-8 h-8" />, type: 'labeling', subject: 'tech', level: 5, story: "A new delivery of robot parts has arrived. Label them correctly for the assembly line.", objective: "Label the parts" },
    { id: 35, title: "Magnet Pull", xp: 100, cost: 400, icon: <Zap className="w-8 h-8" />, type: 'lab', subject: 'science', level: 6, story: "Use magnets to sort the scrap metal in the city junkyard. Find what's magnetic!", objective: "Find magnetic items" },
  ],
  4: [
    { id: 41, title: "Circuit Builder", xp: 100, cost: 600, icon: <Zap className="w-8 h-8" />, type: 'circuit', subject: 'tech', level: 7, story: "Our deep-sea submarine has lost power. Connect the circuits to explore the ocean floor.", objective: "Complete the circuit" },
    { id: 42, title: "Binary Decoder", xp: 150, cost: 600, icon: <Binary className="w-8 h-8" />, type: 'binary', subject: 'tech', level: 8, story: "We've intercepted a secret message from a sunken city. Decode the binary to read it!", objective: "Decode the message" },
    { id: 43, title: "Robot Scramble", xp: 200, cost: 600, icon: <Code className="w-8 h-8" />, type: 'scramble', subject: 'tech', level: 7, story: "The underwater repair bots are malfunctioning. Fix their code to save the coral reef.", objective: "Unscramble the code" },
    { id: 44, title: "Ecosystem Balance", xp: 150, cost: 600, icon: <Waves className="w-8 h-8" />, type: 'sorting', subject: 'science', level: 7, story: "The ocean ecosystem is delicate. Sort the sea creatures into their correct food chains.", objective: "Balance the ecosystem" },
    { id: 45, title: "Fraction Fun", xp: 100, cost: 600, icon: <Percent className="w-8 h-8" />, type: 'math', subject: 'math', level: 7, story: "Divide the submarine's rations fairly among the crew using your knowledge of fractions.", objective: "Divide the rations" },
  ],
  5: [
    { id: 51, title: "Planet Order", xp: 100, cost: 800, icon: <Rocket className="w-8 h-8" />, type: 'labeling', subject: 'science', level: 9, story: "The Future Lab is launching a probe. Map the planets correctly to ensure a safe journey.", objective: "Order the planets" },
    { id: 52, title: "Gravity Jump", xp: 150, cost: 800, icon: <Compass className="w-8 h-8" />, type: 'gravity', subject: 'science', level: 10, story: "We're testing a new gravity suit. Help our scientist jump across the floating platforms.", objective: "Reach the goal" },
    { id: 53, title: "Space Quiz", xp: 200, cost: 800, icon: <Microscope className="w-8 h-8" />, type: 'quiz', subject: 'science', level: 9, story: "The final exam at the Future Lab is here. Prove your STEM knowledge to become a Master!", objective: "Pass the quiz" },
    { id: 54, title: "Code Logic", xp: 150, cost: 800, icon: <Terminal className="w-8 h-8" />, type: 'sequence', subject: 'tech', level: 9, story: "Program the Lab's supercomputer to process data. Sequence the commands correctly.", objective: "Sequence the code" },
    { id: 55, title: "Bridge Builder", xp: 100, cost: 800, icon: <Lightbulb className="w-8 h-8" />, type: 'lab', subject: 'logic', level: 10, story: "Design a bridge that can withstand the high winds of the future city. Test your design!", objective: "Build a stable bridge" },
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Mission Map');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(1);
  const [celebration, setCelebration] = useState<{ title: string; message: string } | null>(null);
  
  useEffect(() => {
    if (profile) {
      setSelectedClass(profile.classLevel as ClassLevel);
      hustleService.checkStreak();
      if (profile.role === 'admin' && activeTab === 'Mission Map') {
        setActiveTab('Platform Overview');
      }
    }
  }, [profile, activeTab]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [buddyMessage, setBuddyMessage] = useState<string | null>(null);
  const [buddyMood, setBuddyMood] = useState<'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral'>('neutral');
  const [notification, setNotification] = useState<string | null>(null);
  const [mysteryBoxReward, setMysteryBoxReward] = useState<any | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [originalUserToEdit, setOriginalUserToEdit] = useState<{ name: string; schoolId: string } | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  // Admin Data States
  const [globalUsers, setGlobalUsers] = useState<StudentProfile[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [curriculumStatus, setCurriculumStatus] = useState<any>(null);
  const [challengeToCreate, setChallengeToCreate] = useState<{ to: string; subject: string; missionId: number; score: number } | null>(null);

  const handleBuddyMessage = (msg: string, mood: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral' = 'neutral') => {
    setBuddyMessage(msg);
    setBuddyMood(mood);
  };

  useEffect(() => {
    if (activeTab === 'Mission Map' && !selectedMission && profile?.role === 'student') {
      const timer = setTimeout(() => {
        setBuddyMessage(hustleService.getMotivationalMessage());
        setBuddyMood('encouraging');
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, selectedMission, profile]);

  const handleMissionClose = async (subject: string, reward?: any, performance?: { accuracy: number, time: number }) => {
    setSelectedMission(null);
    setBuddyMessage(null);
    
    if (performance) {
      const result = hustleService.recordPerformance(subject, performance.accuracy, performance.time);
      if (result) {
        setBuddyMessage(result.feedback);
        setBuddyMood(performance.accuracy > 80 ? 'celebrating' : 'encouraging');
        
        if (performance.accuracy === 100) {
          setCelebration({
            title: "PERFECT SCORE!",
            message: "You're an absolute genius! That was incredible work! 🌟"
          });
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        } else if (performance.accuracy >= 80) {
          setCelebration({
            title: "MISSION SUCCESS!",
            message: "Great job! You've mastered this challenge with flying colors! 🚀"
          });
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }

        if (result.improvement > 0) {
          setNotification(`AI Insight: You've improved by ${result.improvement}%! Keep it up! 📈`);
          setTimeout(() => setNotification(null), 5000);
        }
      }
    } else if (reward) {
      setCelebration({
        title: "MISSION COMPLETE!",
        message: "You did it! Another step towards becoming a STEM Master! ✨"
      });
      confetti({ particleCount: 100, spread: 50, origin: { y: 0.6 } });
    } else {
      setBuddyMessage("Don't worry! You can always try again. I believe in you! 💪");
      setBuddyMood('encouraging');
    }
    
    await refreshProfile();
    if (reward) setMysteryBoxReward(reward);
  };

  const handleShareAchievement = (type: 'badge' | 'certificate', id: string) => {
    const reward = hustleService.shareAchievement(type, id);
    if (reward) {
      setNotification(`Shared! You earned ${reward.points} Coins and ${reward.xp} XP! 🚀`);
      confetti({ particleCount: 50, spread: 30, origin: { y: 0.8 } });
      refreshProfile();
    }
  };

  const handleRespondToChallenge = (challengeId: string, action: 'accepted' | 'declined') => {
    const challenge = hustleService.respondToChallenge(challengeId, action);
    if (challenge) {
      setNotification(action === 'accepted' ? "Challenge Accepted! Go to Mission Map to complete it!" : "Challenge Declined.");
      refreshProfile();
    }
  };

  const handleExportData = () => {
    const data = hustleService.getAllUsers();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hustlestem_users_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification("Data exported successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetAll = async () => {
    hustleService.resetAllData();
    setIsResetConfirmOpen(false);
    setNotification("All data has been reset successfully!");
    setTimeout(() => {
      setNotification(null);
      window.location.reload();
    }, 2000);
  };

  const handleCreateChallenge = (to: string, subject: string, missionId: number, score: number) => {
    const challenge = hustleService.createChallenge(to, subject, missionId, score);
    if (challenge) {
      setNotification(`Challenge sent to ${to}! You'll get rewards when they complete it!`);
      setIsChallengeModalOpen(false);
      refreshProfile();
    }
  };
  const [earnedCertificate, setEarnedCertificate] = useState<{ classLevel: number; date: string; id: string } | null>(null);

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
    
    // Update leaderboard if active
    if (activeTab === 'Leaderboard') {
      setLeaderboardData(hustleService.getLeaderboard());
    }

    // Update Admin Data if on Admin tabs
    if (newProfile.role === 'admin') {
      setGlobalUsers(hustleService.getAllUsers());
      setGlobalMetrics(hustleService.getGlobalMetrics());
      setSystemHealth(hustleService.getSystemHealth());
      setCurriculumStatus(hustleService.getCurriculumStatus());
    }
    
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

    // Check for certificates
    const newCerts = hustleService.checkCertificates();
    if (newCerts && newCerts.length > 0) {
      setEarnedCertificate(newCerts[0]);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#0EA5E9', '#A855F7', '#ffffff']
      });
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin' && ['Platform Overview', 'Global Users', 'Content Control', 'System Health'].includes(activeTab)) {
      refreshProfile();
    }
  }, [activeTab]);

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

  const handleOpenMysteryBox = async () => {
    if (mysteryBoxReward) {
      hustleService.openMysteryBox(mysteryBoxReward);
      setMysteryBoxReward(null);
      await refreshProfile();
      setNotification(`Reward Claimed: ${mysteryBoxReward.label}!`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleClaimDailyChallenge = async (challengeId: string) => {
    const reward = hustleService.claimDailyChallengeReward(challengeId);
    if (reward) {
      await refreshProfile();
      setNotification(`Challenge Claimed! +${reward.points} Points, +${reward.xp} XP`);
      setTimeout(() => setNotification(null), 3000);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const navItems = profile?.role === 'admin'
    ? [
        { name: 'Platform Overview', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Global Users', icon: <Users className="w-5 h-5" /> },
        { name: 'Content Control', icon: <Database className="w-5 h-5" /> },
        { name: 'System Health', icon: <Activity className="w-5 h-5" /> },
      ]
    : [
        { name: 'Mission Map', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['student', 'teacher'] },
        { name: 'Hustle Challenges', icon: <Target className="w-5 h-5" />, roles: ['student'] },
        { name: 'Daily Challenges', icon: <Calendar className="w-5 h-5" />, roles: ['student'] },
        { name: 'Leaderboard', icon: <Trophy className="w-5 h-5" />, roles: ['student', 'teacher'] },
        { name: 'STEM Models', icon: <Cpu className="w-5 h-5" />, roles: ['student', 'teacher'] },
        { name: 'Smart Whiteboard', icon: <Palette className="w-5 h-5" />, roles: ['student', 'teacher'] },
        { name: 'Bot Lab', icon: <Cpu className="w-5 h-5" />, roles: ['student'] },
        { name: 'Achievements', icon: <Award className="w-5 h-5" />, roles: ['student'] },
        { name: 'STEAM Sandbox', icon: <Sparkles className="w-5 h-5" />, roles: ['student', 'teacher'] },
        { name: 'Sticker Book', icon: <BookOpen className="w-5 h-5" />, roles: ['student'] },
        { name: 'Certificates', icon: <Award className="w-5 h-5" />, roles: ['student'] },
        { name: 'Hustle Shop', icon: <ShoppingBag className="w-5 h-5" />, roles: ['student'] },
        { name: 'Science Lab', icon: <Beaker className="w-5 h-5" />, roles: ['student', 'teacher'] },
        { name: 'Parent Report', icon: <TrendingUp className="w-5 h-5" />, roles: ['student'] },
        { name: 'Teacher Dashboard', icon: <Users className="w-5 h-5" />, roles: ['teacher'] },
      ].filter(item => {
        if (!profile) return false;
        return item.roles.includes(profile.role);
      });

  if (!profile) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/30 relative flex flex-col">
      <FloatingBackground />
      
      {/* Certificate Modal */}
      <AnimatePresence>
        {earnedCertificate && (
          <Certificate
            studentName={profile.name}
            classLevel={earnedCertificate.classLevel}
            date={earnedCertificate.date}
            certificateId={earnedCertificate.id}
            onClose={() => setEarnedCertificate(null)}
            onShare={() => handleShareAchievement('certificate', earnedCertificate.id)}
          />
        )}
      </AnimatePresence>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {celebration && (
          <CelebrationOverlay 
            title={celebration.title}
            message={celebration.message}
            onClose={() => setCelebration(null)}
          />
        )}
      </AnimatePresence>

      {/* AI Buddy */}
      <AnimatePresence>
        {buddyMessage && (
          <AIBuddy 
            message={buddyMessage} 
            mood={buddyMood}
            onClose={() => setBuddyMessage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Emotional AI Tutor */}
      {profile && (
        <EmotionalAITutor 
          userName={profile.name}
          missionContext={selectedMission ? {
            title: selectedMission.title,
            story: selectedMission.story,
            objective: selectedMission.objective,
            subject: selectedMission.subject,
            classLevel: selectedClass
          } : undefined}
        />
      )}

      {/* Mission Briefing */}
      <AnimatePresence>
        {isBriefingOpen && selectedMission && (
          <MissionBriefing
            mission={selectedMission}
            theme={classThemes[selectedClass]}
            onStart={() => setIsBriefingOpen(false)}
            onClose={() => {
              setIsBriefingOpen(false);
              setSelectedMission(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedMission && !isBriefingOpen && (
          <>
            {selectedMission.type === 'maze' && (
              <LogicMaze 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any, performance?: { accuracy: number, time: number }) => 
                  handleMissionClose('logic', reward, performance)
                } 
              />
            )}
            {selectedMission.type === 'lab' && (
              <ScienceLab 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any, performance?: { accuracy: number, time: number }) => 
                  handleMissionClose('science', reward, performance)
                } 
              />
            )}
            {selectedMission.type === 'quiz' && (
              <StemQuiz 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any, performance?: { accuracy: number, time: number }) => 
                  handleMissionClose('science', reward, performance)
                } 
              />
            )}
            {selectedMission.type === 'matching' && (
              <MatchingGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('logic', reward)} 
              />
            )}
            {selectedMission.type === 'sequence' && (
              <SequenceGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('logic', reward)} 
              />
            )}
            {selectedMission.type === 'sorting' && (
              <SortingGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('logic', reward)} 
              />
            )}
            {selectedMission.type === 'memory' && (
              <MemoryGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('logic', reward)} 
              />
            )}
            {selectedMission.type === 'math' && (
              <MathGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any, performance?: { accuracy: number, time: number }) => 
                  handleMissionClose('math', reward, performance)
                } 
              />
            )}
            {selectedMission.type === 'scramble' && (
              <ScrambleGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('tech', reward)} 
              />
            )}
            {selectedMission.type === 'labeling' && (
              <LabelingGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('science', reward)} 
              />
            )}
            {selectedMission.type === 'circuit' && (
              <CircuitGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('tech', reward)} 
              />
            )}
            {selectedMission.type === 'habitat' && (
              <HabitatGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('science', reward)} 
              />
            )}
            {selectedMission.type === 'binary' && (
              <BinaryGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('tech', reward)} 
              />
            )}
            {selectedMission.type === 'gravity' && (
              <GravityGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('science', reward)} 
              />
            )}
            {selectedMission.type === 'lifecycle' && (
              <LifeCycleGame 
                levelId={selectedMission.id}
                levelTitle={selectedMission.title}
                onBuddyMessage={handleBuddyMessage}
                onClose={(reward?: any) => handleMissionClose('science', reward)} 
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
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-primary text-slate-900 px-6 py-4 rounded-2xl font-black shadow-[0_0_30_rgba(14,165,233,0.5)] flex items-center gap-4 border-2 border-white/20"
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
      <div className="md:hidden glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">HUSTLE<span className="text-accent">STEM</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Challenge Friend Modal */}
      <AnimatePresence>
        {isChallengeModalOpen && (
          <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-primary/20 p-8 rounded-[2.5rem] max-w-md w-full relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 italic">CREATE CHALLENGE</h3>
                  <button onClick={() => setIsChallengeModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full text-slate-400">
                    <X />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Friend</label>
                    <div className="grid grid-cols-2 gap-2">
                      {profile.friends?.map(friend => (
                        <button 
                          key={friend}
                          onClick={() => setChallengeToCreate(prev => ({ ...prev!, to: friend }))}
                          className={`p-3 rounded-xl border font-bold text-sm transition-all ${
                            challengeToCreate?.to === friend ? 'bg-primary text-slate-900 border-primary shadow-lg shadow-primary/20' : 'bg-black/5 text-slate-500 border-black/5'
                          }`}
                        >
                          {friend}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Subject</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['math', 'science', 'tech', 'logic'].map(sub => (
                        <button 
                          key={sub}
                          onClick={() => setChallengeToCreate(prev => ({ ...prev!, subject: sub }))}
                          className={`p-3 rounded-xl border font-bold text-sm uppercase transition-all ${
                            challengeToCreate?.subject === sub ? 'bg-primary text-slate-900 border-primary shadow-lg shadow-primary/20' : 'bg-black/5 text-slate-500 border-black/5'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Score to Beat (%)</label>
                    <input 
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={challengeToCreate?.score || 80}
                      onChange={(e) => setChallengeToCreate(prev => ({ ...prev!, score: parseInt(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between mt-2 font-black text-primary">
                      <span>50%</span>
                      <span className="text-2xl">{challengeToCreate?.score || 80}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleCreateChallenge(
                      challengeToCreate?.to || profile.friends[0],
                      challengeToCreate?.subject || 'math',
                      1,
                      challengeToCreate?.score || 80
                    )}
                    className="w-full py-4 bg-primary text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                  >
                    SEND CHALLENGE 🚀
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mystery Box Modal */}
      <AnimatePresence>
        {mysteryBoxReward && (
          <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="bg-white border border-primary/20 p-10 rounded-[3rem] text-center max-w-md w-full relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-32 h-32 bg-primary/20 rounded-3xl mx-auto mb-8 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(34,211,238,0.3)] border-2 border-primary/30"
              >
                <Gift className="w-16 h-16" />
              </motion.div>

              <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2 uppercase">MYSTERY BOX!</h2>
              <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">You've earned a special reward!</p>

              <div className="bg-black/5 rounded-2xl p-6 border border-black/5 mb-8">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Potential Reward</p>
                <p className="text-2xl font-black text-primary">???</p>
              </div>

              <button
                onClick={handleOpenMysteryBox}
                className="w-full py-4 bg-primary text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)]"
              >
                OPEN BOX
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditUserModalOpen && userToEdit && (
          <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-primary/20 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Edit User</h2>
                <button onClick={() => setIsEditUserModalOpen(false)} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">User Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['student', 'teacher', 'admin'] as UserRole[]).map(role => (
                      <button
                        key={role}
                        onClick={() => setUserToEdit({ ...userToEdit, role })}
                        className={`py-3 rounded-xl border font-black text-[10px] uppercase transition-all ${
                          userToEdit.role === role ? 'bg-primary text-slate-900 border-primary shadow-lg shadow-primary/20' : 'bg-black/5 text-slate-500 border-black/5'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">School ID</label>
                  <input 
                    type="text"
                    value={userToEdit.schoolId}
                    onChange={(e) => setUserToEdit({ ...userToEdit, schoolId: e.target.value.toUpperCase() })}
                    className="w-full bg-black/5 border border-black/5 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all"
                  >
                    DELETE USER
                  </button>
                  <button
                    onClick={() => {
                      if (originalUserToEdit) {
                        hustleService.updateUser(originalUserToEdit.name, originalUserToEdit.schoolId, { role: userToEdit.role, schoolId: userToEdit.schoolId });
                        setIsEditUserModalOpen(false);
                        refreshProfile();
                        setNotification("User updated successfully!");
                        setTimeout(() => setNotification(null), 3000);
                      }
                    }}
                    className="py-4 bg-primary text-slate-900 rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && userToEdit && (
          <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-red-500/20 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase mb-2">Are you sure?</h2>
              <p className="text-slate-600 font-bold mb-8">
                You are about to delete <span className="text-red-500">{userToEdit.name}</span>. This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="py-4 bg-black/5 text-slate-500 rounded-2xl font-black text-xs hover:bg-black/10 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    if (originalUserToEdit) {
                      hustleService.deleteUser(originalUserToEdit.name, originalUserToEdit.schoolId);
                      setIsDeleteConfirmOpen(false);
                      setIsEditUserModalOpen(false);
                      refreshProfile();
                      setNotification("User deleted successfully!");
                      setTimeout(() => setNotification(null), 3000);
                    }
                  }}
                  className="py-4 bg-red-500 text-white rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-red-500/20"
                >
                  CONFIRM DELETE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-red-500/20 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase mb-2">Nuclear Reset?</h2>
              <p className="text-slate-600 font-bold mb-8">
                This will permanently delete <span className="text-red-500 text-lg">ALL</span> user data and registrations. This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="py-4 bg-black/5 text-slate-500 rounded-2xl font-black text-xs hover:bg-black/10 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleResetAll}
                  className="py-4 bg-red-500 text-white rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-red-500/20"
                >
                  CONFIRM RESET
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 768) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`fixed md:sticky top-0 left-0 h-screen w-72 glass-sidebar z-50 flex flex-col ${!isSidebarOpen && 'hidden md:flex'}`}
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4 px-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight text-white leading-none">HUSTLE<span className="text-accent">STEM</span></span>
                    <span className="text-[10px] font-medium text-white/60 uppercase tracking-widest mt-1">{profile.schoolId}</span>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md font-medium text-sm transition-all group
                      ${activeTab === item.name 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    <div className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.name ? 'text-white' : 'text-accent'}`}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>

              <div className="p-6 border-t border-white/5 space-y-6">
                {/* User Profile Summary */}
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-tight">{profile.name}</h3>
                    <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">
                      {profile.role}
                    </p>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="px-2 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-primary">Level {profile.level || 1}</span>
                  <span className="text-text-muted">{profile.totalXp % 1000} / 1000 XP</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(profile.totalXp % 1000) / 10}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-warning" />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Streak</span>
                  </div>
                  <p className="text-base font-bold text-white">{profile.streak}d</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3 h-3 text-accent" />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Score</span>
                  </div>
                  <p className="text-base font-bold text-white">{profile.hustleScore || 0}</p>
                </div>
              </div>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Logout
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative z-10 min-h-0">
          {/* Desktop Header */}
          <header className="hidden md:flex items-center justify-end p-4 gap-6 shrink-0 sticky top-0 z-40 glass-header">
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm tracking-tight text-primary">{profile.points} <span className="text-[10px] text-text-muted">HUSTLE-POINTS</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-text-main">{profile.name}</p>
                <p className="text-[10px] font-semibold text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-md inline-block">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-12 h-12 rounded-2xl bg-black/5 border border-black/5 flex items-center justify-center hover:bg-red-400/10 hover:border-red-400/30 transition-all group"
                title="Logout"
              >
                <LogOut className="w-6 h-6 text-primary group-hover:text-red-400 group-hover:scale-110 transition-all" />
              </button>
            </div>
          </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
          {activeTab === 'Mission Map' && profile.role !== 'admin' && (
            <>
              {/* Learning Insights */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] rotate-3">
                    <Activity className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">LEARNING INSIGHTS</h2>
                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">AI-Powered Performance Analytics</p>
                  </div>
                </div>

                {/* Progress Motivation Banner */}
                {profile.role === 'student' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {hustleService.getTodayImprovement() > 0 && (
                      <div className="bg-gradient-to-r from-emerald-500/20 to-transparent p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                          <TrendingUp className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-lg leading-tight">You improved by {hustleService.getTodayImprovement()}% today!</p>
                          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Keep pushing your limits!</p>
                        </div>
                      </div>
                    )}
                    {profile.streak >= 3 && (
                      <div className="bg-gradient-to-r from-orange-500/20 to-transparent p-4 rounded-2xl border border-orange-500/30 flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                          <Flame className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-lg leading-tight">You're on fire! {profile.streak} Day Streak!</p>
                          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">You're unstoppable!</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Hustle Score Card */}
                  <div className="md:col-span-1 glass-card flex flex-col items-center justify-center text-center relative overflow-hidden group border-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                        <svg className="w-full h-full -rotate-90 absolute inset-0">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="12"
                          />
                          <motion.circle
                            initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - (profile.hustleScore || 0) / 100) }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            cx="64"
                            cy="64"
                            r="56"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={2 * Math.PI * 56}
                            className="text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                          />
                        </svg>
                        <div className="flex flex-col items-center">
                          <span className="text-4xl font-black text-slate-900 leading-none">
                            {profile.hustleScore || 0}
                          </span>
                          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">Score</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Hustle Master</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Overall Mastery</p>
                    </div>
                  </div>

                  {/* AI Tutor Insights Card */}
                  {profile.intelligenceProfile && (
                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Mistake Analysis Card */}
                      {Object.values(profile.intelligenceProfile.mistakePatterns).some(patterns => patterns.length > 0) && (
                        <div className="md:col-span-4 glass-card border-amber-500/20 bg-amber-500/5 p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                              <Zap className="w-4 h-4 text-amber-500" />
                            </div>
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Smart Mistake Analysis</h4>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            {Object.entries(profile.intelligenceProfile.mistakePatterns).map(([subject, patterns]) => 
                              patterns.map((pattern, i) => (
                                <div key={`${subject}-${i}`} className="px-4 py-2 bg-black/5 rounded-xl border border-black/5 flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mr-1">{subject}:</span>
                                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{pattern}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      <div className="md:col-span-2 glass-card border-primary/20 bg-primary/5 p-8">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                            <Bot className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-slate-900 italic tracking-tighter">AI TUTOR INSIGHTS</h4>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Personalized Mentorship</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {hustleService.getAIInsights()?.map((insight, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3 p-4 bg-black/5 rounded-2xl border border-black/5"
                            >
                              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <p className="text-sm font-medium text-slate-700">{insight}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="glass-card border-accent/20 bg-accent/5 p-8">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Predictive Forecast</h4>
                        <div className="space-y-6">
                          {Object.entries(profile.intelligenceProfile.predictions.nextLevelEstimate).map(([sub, days]) => (
                            <div key={sub} className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{sub}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-slate-900">~{days}d</span>
                                <div className="w-8 h-1 bg-black/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-accent" style={{ width: `${Math.max(10, 100 - (days * 10))}%` }} />
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="mt-8 p-4 bg-black/5 rounded-2xl border border-black/5">
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Mastery Forecast</p>
                            <p className="text-xs font-medium text-slate-600 italic">{profile.intelligenceProfile.predictions.masteryForecast}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subject Levels Card */}
                  <div className="md:col-span-3 glass-card border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {Object.entries(profile.subjectLevels || { math: 1, science: 1, tech: 1, logic: 1 }).map(([subject, level]) => (
                        <div key={subject} className="space-y-4 group/item">
                          <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/item:text-primary transition-colors">{subject}</span>
                              <span className="text-2xl font-black text-slate-900">LVL {level}</span>
                            </div>
                            <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center text-primary/40 group-hover/item:text-primary group-hover/item:bg-primary/10 transition-all">
                              {subject === 'math' && <Target className="w-4 h-4" />}
                              {subject === 'science' && <Activity className="w-4 h-4" />}
                              {subject === 'tech' && <Rocket className="w-4 h-4" />}
                              {subject === 'logic' && <Zap className="w-4 h-4" />}
                            </div>
                          </div>
                          <div className="h-3 bg-black/5 rounded-full overflow-hidden border border-black/5 p-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(level / 10) * 100}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Improvement Trend */}
                    <div className="mt-10 pt-10 border-t border-black/5">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-400/10 rounded-lg border border-green-400/20">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          </div>
                          <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest">Growth Trajectory</h4>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-400/10 rounded-full border border-green-400/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">+12% Gain</span>
                        </div>
                      </div>
                      <div className="flex items-end gap-3 h-20">
                        {[40, 65, 55, 80, 70, 90, 85].map((val, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${val}%` }}
                            transition={{ delay: i * 0.1, duration: 1 }}
                            className={`flex-1 rounded-t-xl relative group/bar ${i === 6 ? 'bg-primary shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'bg-black/10 hover:bg-black/20'} transition-all`}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-black text-primary">
                              {val}%
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Class Selector */}
              <section className="mb-10">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Select Your Level</h2>
                <div className="flex flex-wrap gap-3">
                  {([1, 2, 3, 4, 5] as ClassLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedClass(level)}
                      className={`px-8 py-4 rounded-2xl font-black transition-all duration-500 border-2 relative overflow-hidden group ${
                        selectedClass === level
                          ? 'bg-primary border-primary text-slate-900 scale-105 shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-primary/50 hover:bg-white/10'
                      }`}
                    >
                      <div className="relative z-10">CLASS {level}</div>
                      {selectedClass === level && (
                        <motion.div 
                          layoutId="activeClass"
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Mission Map */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900">MISSION MAP</h2>
                    <p className="text-slate-500 mt-1">
                      {profile.role === 'student' 
                        ? `Class ${selectedClass} • ${selectedClass === 1 ? 'Animals' : selectedClass === 5 ? 'Space' : 'Science'} Explorer`
                        : `${(profile.role || 'student').toUpperCase()} VIEW • Class ${selectedClass} Content`}
                    </p>
                  </div>
                  <div className="hidden sm:block px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {profile.role === 'student' 
                      ? `${profile.completedLevels.length} / 50 LEVELS DONE`
                      : 'ALL MISSIONS UNLOCKED FOR REVIEW'}
                  </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {missionsByClass[selectedClass]
                    .filter(mission => {
                      if (profile.role !== 'student') return true;
                      const subjectLevel = profile.subjectLevels?.[mission.subject] || 1;
                      // Show missions within level ±1
                      return mission.level >= subjectLevel - 1 && mission.level <= subjectLevel + 1;
                    })
                    .map((mission, idx) => {
                      const isCompleted = profile.completedLevels.includes(mission.id);
                      const isUnlocked = profile.unlockedLevels.includes(mission.id);
                      
                      return (
                        <motion.div
                          key={`${selectedClass}-${mission.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => {
                            if (isUnlocked || profile.role !== 'student') {
                              setSelectedMission(mission);
                              setIsBriefingOpen(true);
                            } else {
                              handleUnlockLevel(mission.id, mission.cost);
                            }
                          }}
                          className={`group relative glass-card p-8 cursor-pointer overflow-hidden ${
                            isCompleted ? 'border-primary/40 bg-primary/5' : 
                            (!isUnlocked && profile.role === 'student') ? 'border-black/5 opacity-80 grayscale hover:grayscale-0' :
                            'border-black/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20'
                          }`}
                        >
                          {/* AI Recommended Badge */}
                          {profile.intelligenceProfile && (
                            (profile.intelligenceProfile.weakTopics.includes(mission.subject) || 
                             mission.level === (profile.subjectLevels?.[mission.subject] || 1)) && !isCompleted && isUnlocked && (
                              <div className="absolute top-0 left-0 z-20">
                                <div className="bg-primary text-slate-900 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-br-xl shadow-lg flex items-center gap-1">
                                  <Sparkles className="w-2 h-2" />
                                  AI RECOMMENDED
                                </div>
                              </div>
                            )
                          )}
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                          </div>

                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            {mission.icon}
                          </div>

                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                mission.subject === 'math' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
                                mission.subject === 'science' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                                mission.subject === 'tech' ? 'bg-purple-500/10 border-purple-500/20 text-purple-600' :
                                'bg-amber-500/10 border-amber-500/20 text-amber-600'
                              }`}>
                                {mission.subject}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <Star className={`w-3 h-3 ${isCompleted ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                                Level {mission.level}
                              </div>
                            </div>

                            <div className={`w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-500 border border-primary/5 ${
                              isCompleted ? 'border-primary/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 
                              (!isUnlocked && profile.role === 'student') ? 'text-slate-500' : ''
                            }`}>
                              {(isUnlocked || profile.role !== 'student') ? mission.icon : <Lock className="w-8 h-8" />}
                            </div>

                            <h3 className={`text-xl font-black mb-2 transition-colors leading-tight ${(!isUnlocked && profile.role === 'student') ? 'text-slate-400' : 'text-slate-900 group-hover:text-primary'}`}>
                              {(isUnlocked || profile.role !== 'student') ? mission.title : 'LOCKED MISSION'}
                            </h3>
                            <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-6">
                              {mission.story}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                              {isCompleted ? (
                                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Mission Complete
                                </div>
                              ) : (!isUnlocked && profile.role === 'student') ? (
                                <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                                  <Lock className="w-4 h-4" />
                                  Unlock for {mission.cost} XP
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                                  Start Mission
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
              </section>
            </>
          )}

          {activeTab === 'Hustle Challenges' && profile.role !== 'admin' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Hustle Challenges</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Challenge your friends and earn epic rewards!</p>
                </div>
                <button 
                  onClick={() => setIsChallengeModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                >
                  <Users className="w-5 h-5" />
                  NEW CHALLENGE
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Received Challenges */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-primary" />
                    INCOMING CHALLENGES
                  </h3>
                  <div className="space-y-4">
                    {profile.challenges?.filter(c => c.type === 'received').length === 0 ? (
                      <div className="glass-card p-8 text-center text-slate-500 italic font-bold">
                        No incoming challenges yet.
                      </div>
                    ) : (
                      profile.challenges?.filter(c => c.type === 'received').map(challenge => (
                        <motion.div 
                          key={challenge.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="glass-card p-6 border-primary/20 bg-primary/5"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30">
                                <Trophy className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-slate-900 font-black">{challenge.from} challenged you!</p>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Subject: {challenge.subject}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Score to Beat</p>
                              <p className="text-2xl font-black text-primary">{challenge.scoreToBeat}%</p>
                            </div>
                          </div>
                          
                          {challenge.status === 'pending' ? (
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleRespondToChallenge(challenge.id, 'accepted')}
                                className="flex-1 py-3 bg-primary text-slate-900 font-black rounded-xl hover:scale-105 transition-transform"
                              >
                                ACCEPT
                              </button>
                              <button 
                                onClick={() => handleRespondToChallenge(challenge.id, 'declined')}
                                className="flex-1 py-3 bg-black/5 text-slate-500 font-black rounded-xl hover:bg-black/10 transition-colors"
                              >
                                DECLINE
                              </button>
                            </div>
                          ) : (
                            <div className={`py-3 text-center rounded-xl font-black text-xs uppercase tracking-widest ${
                              challenge.status === 'accepted' ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30' :
                              challenge.status === 'completed' ? 'bg-green-500/20 text-green-600 border border-green-500/30' :
                              'bg-black/5 text-slate-500'
                            }`}>
                              {challenge.status}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sent Challenges */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-accent" />
                    SENT CHALLENGES
                  </h3>
                  <div className="space-y-4">
                    {profile.challenges?.filter(c => c.type === 'sent').length === 0 ? (
                      <div className="glass-card p-8 text-center text-slate-500 italic font-bold">
                        You haven't sent any challenges yet.
                      </div>
                    ) : (
                      profile.challenges?.filter(c => c.type === 'sent').map(challenge => (
                        <motion.div 
                          key={challenge.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="glass-card p-6 border-black/5"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-slate-500">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-slate-900 font-black">To: {challenge.to}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{challenge.subject} • {challenge.scoreToBeat}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                challenge.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                                challenge.status === 'declined' ? 'bg-red-500/20 text-red-600' :
                                'bg-black/10 text-slate-500'
                              }`}>
                                {challenge.status}
                              </div>
                              <button 
                                onClick={() => handleShareAchievement('badge', 'challenge_sent')}
                                className="p-2 bg-black/5 hover:bg-primary hover:text-slate-900 rounded-xl transition-all text-slate-500"
                                title="Share Challenge"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'Daily Challenges' && profile.role !== 'admin' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900">DAILY CHALLENGES</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Complete these for bonus rewards!</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Resets Daily</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profile.dailyChallenges?.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ y: -5 }}
                    className={`bg-black/5 backdrop-blur-md p-6 rounded-3xl border transition-all ${challenge.completed ? 'border-primary/40 bg-primary/5' : 'border-black/5'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${challenge.completed ? 'bg-primary text-slate-900' : 'bg-black/5 text-primary'}`}>
                        {challenge.type === 'complete_mission' ? <Target className="w-6 h-6" /> : 
                         challenge.type === 'earn_points' ? <Coins className="w-6 h-6" /> :
                         challenge.type === 'use_whiteboard' ? <Palette className="w-6 h-6" /> :
                         <Cpu className="w-6 h-6" />}
                      </div>
                      {challenge.completed && !challenge.claimed && (
                        <span className="bg-green-500/20 text-green-500 text-[10px] font-black px-2 py-1 rounded-full animate-pulse">READY TO CLAIM</span>
                      )}
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mb-2">{challenge.title}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Progress</span>
                        <span>{challenge.current} / {challenge.target}</span>
                      </div>
                      <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                          className={`h-full ${challenge.completed ? 'bg-green-500' : 'bg-primary'}`}
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-primary" />
                          <span className="text-xs font-black text-primary">+{challenge.rewardPoints}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span className="text-xs font-black text-amber-400">+{challenge.rewardXp} XP</span>
                        </div>
                      </div>
                      <button
                        disabled={!challenge.completed || challenge.claimed}
                        onClick={() => handleClaimDailyChallenge(challenge.id)}
                        className={`w-full py-3 rounded-xl font-black text-xs transition-all ${
                          challenge.claimed ? 'bg-black/5 text-slate-500 cursor-not-allowed' :
                          challenge.completed ? 'bg-primary text-slate-900 hover:scale-105 shadow-lg shadow-primary/20' :
                          'bg-black/5 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {challenge.claimed ? 'CLAIMED' : challenge.completed ? 'CLAIM REWARD' : 'IN PROGRESS'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'Leaderboard' && profile.role !== 'admin' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900">HUSTLE LEADERBOARD</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Top Hustlers in your school</p>
                </div>
                <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <Trophy className="w-7 h-7" />
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-black/5 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-black/5 bg-black/5 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-4">Hustler</div>
                  <div className="col-span-2 text-center">Level</div>
                  <div className="col-span-2 text-right">Total XP</div>
                  <div className="col-span-3 text-center">Actions</div>
                </div>
                <div className="divide-y divide-black/5">
                  {leaderboardData.map((entry) => (
                    <div 
                      key={entry.name}
                      className={`grid grid-cols-12 gap-4 p-6 items-center transition-colors ${entry.isCurrentUser ? 'bg-primary/10' : 'hover:bg-black/5'}`}
                    >
                      <div className="col-span-1 flex justify-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                          entry.rank === 1 ? 'bg-amber-400 text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.4)]' :
                          entry.rank === 2 ? 'bg-slate-300 text-slate-900' :
                          entry.rank === 3 ? 'bg-amber-700 text-slate-900' :
                          'bg-white/5 text-slate-400'
                        }`}>
                          {entry.rank}
                        </div>
                      </div>
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-black text-primary border border-primary/20">
                          {entry.name.charAt(0)}
                        </div>
                        <div>
                          <span className={`font-black text-lg ${entry.isCurrentUser ? 'text-primary' : 'text-slate-900'}`}>
                            {entry.name}
                          </span>
                          {entry.isCurrentUser && <span className="ml-2 text-[10px] bg-primary text-slate-900 px-2 py-0.5 rounded-full font-black">YOU</span>}
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-black text-slate-500">
                        Lvl {entry.level}
                      </div>
                      <div className="col-span-2 text-right font-black text-primary text-lg">
                        {entry.xp.toLocaleString()}
                      </div>
                      <div className="col-span-3 flex justify-center gap-2">
                        <button 
                          onClick={() => handleShareAchievement('badge', `rank_${entry.rank}`)}
                          className="p-2 bg-black/5 hover:bg-primary hover:text-slate-900 rounded-xl transition-all text-slate-500 group/share"
                          title="Share Rank"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        {!entry.isCurrentUser && (
                          <button 
                            onClick={() => {
                              setChallengeToCreate({ to: entry.name, subject: 'Math', missionId: 1, score: 90 });
                              setIsChallengeModalOpen(true);
                            }}
                            className="p-2 bg-black/5 hover:bg-accent hover:text-slate-900 rounded-xl transition-all text-slate-500 group/challenge"
                            title="Challenge Friend"
                          >
                            <Target className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'Smart Whiteboard' && profile.role !== 'admin' && (
            <SmartWhiteboard onBuddyMessage={handleBuddyMessage} />
          )}

          {activeTab === 'Bot Lab' && profile.role !== 'admin' && (
            <HustleBotLab profile={profile} onUpdate={setProfile} onBuddyMessage={handleBuddyMessage} />
          )}

          {activeTab === 'Achievements' && profile.role !== 'admin' && (
            <AchievementBadges profile={profile} onShare={(id) => handleShareAchievement('badge', id)} />
          )}

          {activeTab === 'STEAM Sandbox' && profile.role !== 'admin' && (
            <SymmetryPainter />
          )}

          {activeTab === 'Sticker Book' && profile.role !== 'admin' && (
            <StickerBook />
          )}

          {activeTab === 'Hustle Shop' && profile.role !== 'admin' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900">HUSTLE SHOP</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Upgrade your gear with Hustle Points</p>
                </div>
                <div className="flex items-center gap-3 bg-black/5 px-6 py-3 rounded-2xl border border-black/5 shadow-lg">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="font-black text-2xl text-primary">{profile.points}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hustleService.getShopItems().map((item) => {
                  const isUnlocked = item.type === 'skin' ? profile.unlockedSkins.includes(item.name) :
                                   item.type === 'theme' ? profile.inventory.themes?.includes(item.id) :
                                   false;
                  
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5 }}
                      className="bg-black/5 backdrop-blur-md p-6 rounded-[2rem] border border-black/5 flex flex-col group"
                    >
                      <div className="w-full aspect-square bg-black/5 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.type === 'skin' ? <Bot className="w-20 h-20 text-primary" /> :
                         item.type === 'theme' ? <Palette className="w-20 h-20 text-primary" /> :
                         item.type === 'powerup' ? <Zap className="w-20 h-20 text-amber-400" /> :
                         <Gift className="w-20 h-20 text-primary" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-black text-xl text-slate-900">{item.name}</h3>
                          <span className="text-[10px] font-black bg-black/10 text-slate-500 px-2 py-1 rounded-full uppercase tracking-widest">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-bold mb-6">
                          {item.type === 'powerup' ? 'One-time use boost' : 'Permanent unlock'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-primary" />
                          <span className="font-black text-lg text-slate-900">{item.cost}</span>
                        </div>
                        {isUnlocked ? (
                          <button 
                            disabled
                            className="px-6 py-2 bg-green-500/20 text-green-500 rounded-xl font-black text-xs border border-green-500/30"
                          >
                            UNLOCKED
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              const success = hustleService.buyShopItem(item.id, item.cost);
                              if (success) {
                                refreshProfile();
                                setNotification(`${item.name} Unlocked!`);
                                setTimeout(() => setNotification(null), 3000);
                              } else {
                                setNotification("Not enough Points, Hustler!");
                                setTimeout(() => setNotification(null), 3000);
                              }
                            }}
                            className="px-6 py-2 bg-primary text-slate-900 hover:scale-105 rounded-xl font-black text-xs transition-all shadow-lg shadow-primary/20"
                          >
                            BUY NOW
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === 'Parent Report' && profile.role !== 'admin' && (
            <section>
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-2 text-slate-900">PARENT REPORT</h2>
              <p className="text-slate-500 mb-8">Tracking {profile.name}'s Hustle Journey</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 text-center shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hustle Score</p>
                  <div className="text-5xl font-black text-primary mb-2">{hustleService.calculateHustleScore()}%</div>
                  <p className="text-xs text-slate-500">Based on problem-solving speed</p>
                </div>
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 text-center shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Levels Completed</p>
                  <div className="text-5xl font-black text-slate-900 mb-2">{profile.completedLevels.length}</div>
                  <p className="text-xs text-slate-500">Out of 50 total missions</p>
                </div>
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 text-center shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hustle Points</p>
                  <div className="text-5xl font-black text-amber-400 mb-2">{profile.points}</div>
                  <p className="text-xs text-slate-500">Available to spend in shop</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-sm">
                  <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-slate-900">
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
                        <div className="flex justify-between text-sm font-bold mb-2 text-slate-600">
                          <span>{skill.name}</span>
                          <span className="text-primary">{skill.value}%</span>
                        </div>
                        <div className="w-full bg-black/10 h-3 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            className="bg-primary h-full shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-sm">
                  <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-slate-900">
                    <LayoutDashboard className="w-6 h-6 text-primary" />
                    Recent Hustles
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {profile.completedLevels.length === 0 ? (
                      <p className="text-slate-500 text-center py-10 font-bold italic">No missions completed yet, Hustler!</p>
                    ) : (
                      profile.completedLevels.slice().reverse().map((levelId) => {
                        const moves = profile.levelMoves?.[levelId]?.[0] || [];
                        return (
                          <div key={levelId} className="bg-black/5 p-4 rounded-2xl border border-black/5">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-black text-sm text-primary">Level {levelId}</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {moves.length} Actions Recorded
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {moves.map((move: any, i: number) => (
                                <div key={i} className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-mono text-slate-500">
                                  {typeof move === 'string' && move.length > 0 ? move[0].toUpperCase() : i + 1}
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

          {activeTab === 'Certificates' && profile.role !== 'admin' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900">MY CERTIFICATES</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Official STEM Achievements</p>
                </div>
                <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 text-xs font-black text-primary uppercase tracking-widest">
                  {profile.certificates?.length || 0} Earned
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.certificates && profile.certificates.length > 0 ? (
                  profile.certificates.map((cert) => (
                    <motion.div
                      key={cert.id}
                      whileHover={{ y: -5 }}
                      className="bg-black/5 backdrop-blur-md p-6 rounded-3xl border border-black/5 shadow-xl group cursor-pointer"
                      onClick={() => setEarnedCertificate(cert)}
                    >
                      <div className="aspect-[1.414/1] bg-black/5 rounded-2xl mb-6 flex flex-col items-center justify-center p-4 border-2 border-dashed border-black/5 group-hover:border-primary/30 transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Award className="w-12 h-12 text-primary mb-3 relative z-10" />
                        <p className="text-[10px] font-mono text-slate-500 relative z-10">{cert.id}</p>
                      </div>
                      <h3 className="font-black text-lg text-slate-900 mb-1">Class {cert.classLevel} Graduate</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">
                        Awarded {new Date(cert.date).toLocaleDateString()}
                      </p>
                      <button className="w-full py-3 bg-black/5 hover:bg-primary hover:text-slate-900 rounded-xl font-black text-xs transition-all border border-black/5 hover:border-primary">
                        VIEW CERTIFICATE
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 bg-black/5 rounded-3xl border border-dashed border-black/5 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                      <Award className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Certificates Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto font-bold">
                      Complete all missions in Class 5 to earn your first official <span className="text-primary">HustleSTEM Certificate</span>!
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'Platform Overview' && profile.role === 'admin' && (
            <section className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter text-slate-900">PLATFORM VISION</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Global STEM Education Control Center</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="font-black text-slate-900">GLOBAL LIVE</span>
                  </div>
                </div>
              </div>

              {/* Vision Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-xl">
                  <h3 className="text-primary font-black mb-2 uppercase text-xs tracking-widest">The Mission</h3>
                  <p className="text-slate-900 text-lg font-bold leading-tight">Democratizing world-class STEM education through gamified mastery.</p>
                </div>
                <div className="bg-primary/10 backdrop-blur-md p-8 rounded-3xl border border-primary/20 shadow-xl">
                  <h3 className="text-primary font-black mb-2 uppercase text-xs tracking-widest">Registered Hustlers</h3>
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <p className="text-slate-900 text-3xl font-black leading-tight">{hustleService.getUserCount()}</p>
                  </div>
                  <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest">Active innovators on platform</p>
                </div>
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-xl">
                  <h3 className="text-emerald-400 font-black mb-2 uppercase text-xs tracking-widest">Core Values</h3>
                  <p className="text-slate-900 text-lg font-bold leading-tight">Logic, Creativity, and Technical Excellence for the next generation.</p>
                </div>
              </div>

              {/* Global Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: globalMetrics?.totalStudents || 0, icon: <Users className="w-5 h-5" />, color: 'text-primary' },
                  { label: 'Active Schools', value: globalMetrics?.activeSchools || 0, icon: <Globe className="w-5 h-5" />, color: 'text-accent' },
                  { label: 'Missions Live', value: globalMetrics?.missionsLive || 0, icon: <Rocket className="w-5 h-5" />, color: 'text-emerald-400' },
                  { label: 'Avg. Engagement', value: globalMetrics?.avgEngagement || '0%', icon: <Activity className="w-5 h-5" />, color: 'text-amber-400' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-black/5 p-6 rounded-3xl border border-black/5">
                    <div className={`w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'Global Users' && profile.role === 'admin' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Global User Directory</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Manage all students and teachers across schools</p>
                </div>
              </div>
              
              <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-xl">
                <div className="space-y-4">
                  {/* This would normally fetch all users, for now we show school-specific as a demo of the UI */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20 mb-6">
                    <p className="text-primary text-sm font-black">Showing all registered platform users</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsResetConfirmOpen(true)}
                        className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black text-xs hover:bg-red-500 hover:text-white transition-all"
                      >
                        RESET ALL REGISTRATIONS
                      </button>
                      <button 
                        onClick={handleExportData}
                        className="px-4 py-2 bg-primary text-slate-900 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20"
                      >
                        EXPORT DATA
                      </button>
                    </div>
                  </div>
                  
                  {globalUsers.map(user => (
                    <div key={`${user.name}:${user.schoolId}`} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border border-black/5 hover:bg-black/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                          user.role === 'admin' ? 'bg-red-400/10 text-red-600' : 
                          user.role === 'teacher' ? 'bg-amber-400/10 text-amber-600' : 
                          'bg-primary/10 text-primary'
                        }`}>
                          {user.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : 
                           user.role === 'teacher' ? <Users className="w-5 h-5" /> : 
                           <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-black text-sm text-slate-900">{user.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.role} • {user.schoolId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-black text-slate-900">{user.totalXp} XP</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.completedLevels.length} Missions</p>
                        </div>
                        <button 
                          onClick={() => {
                            setUserToEdit(user);
                            setOriginalUserToEdit({ name: user.name, schoolId: user.schoolId });
                            setIsEditUserModalOpen(true);
                          }}
                          className="p-2 hover:bg-black/10 rounded-lg text-slate-500"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'Content Control' && profile.role === 'admin' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Curriculum Control</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Manage missions, levels, and learning paths</p>
                </div>
                <button 
                  onClick={() => {
                    setNotification("Mission Builder Coming Soon!");
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="px-6 py-3 bg-primary text-slate-900 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                  ADD NEW MISSION
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Module 1 Status (Classes 1-5)</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <div key={lvl} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border border-black/5">
                        <span className="font-black text-slate-900">Class {lvl}</span>
                        <div className="flex items-center gap-3">
                          {curriculumStatus?.[lvl] ? (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">Active</span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-black/5 px-2 py-1 rounded">Inactive</span>
                          )}
                          <button 
                            onClick={() => {
                              setNotification("Curriculum Editor Coming Soon!");
                              setTimeout(() => setNotification(null), 3000);
                            }}
                            className="text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Module 2 Roadmap (Classes 6-9)</h3>
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 border-dashed">
                    <p className="text-primary text-sm font-bold italic mb-4">In Development: Advanced STEM Concepts</p>
                    <ul className="space-y-2">
                      <li className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        Advanced Robotics & AI Logic
                      </li>
                      <li className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        Complex Physics Simulations
                      </li>
                      <li className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        Data Science Fundamentals
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'System Health' && profile.role === 'admin' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900 uppercase">System Health</h2>
                  <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Platform stability and security monitoring</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/5 p-8 rounded-3xl border border-emerald-400/20 shadow-lg shadow-emerald-500/5">
                  <div className="flex items-center gap-4 mb-4">
                    <Activity className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-lg font-black text-slate-900">Server Status</h3>
                  </div>
                  <p className="text-3xl font-black text-emerald-400">{systemHealth?.serverStatus || 'ONLINE'}</p>
                  <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Uptime: {systemHealth?.uptime || '99.9%'}</p>
                </div>

                <div className="bg-black/5 p-8 rounded-3xl border border-primary/20 shadow-lg shadow-primary/5">
                  <div className="flex items-center gap-4 mb-4">
                    <Database className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-black text-slate-900">Database Load</h3>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{systemHealth?.databaseLoad || '2%'}</p>
                  <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Normal Latency</p>
                </div>

                <div className="bg-black/5 p-8 rounded-3xl border border-red-400/20 shadow-lg shadow-red-500/5">
                  <div className="flex items-center gap-4 mb-4">
                    <ShieldCheck className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-black text-slate-900">Security</h3>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{hustleService.getSystemHealth().securityStatus}</p>
                  <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">No Threats Detected</p>
                </div>
              </div>

              <div className="bg-red-400/5 backdrop-blur-md p-8 rounded-3xl border border-red-400/20">
                <h3 className="text-xl font-black text-red-400 mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" />
                  Critical Controls
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-black/5 rounded-2xl border border-black/5">
                    <h4 className="text-slate-900 font-bold mb-2">Maintenance Mode</h4>
                    <p className="text-xs text-slate-500 mb-4">Disable all student access for system updates.</p>
                    <button className="px-4 py-2 bg-black/10 text-slate-900 rounded-xl font-black text-xs hover:bg-black/20 transition-colors">ACTIVATE</button>
                  </div>
                  <div className="p-6 bg-black/5 rounded-2xl border border-black/5">
                    <h4 className="text-slate-900 font-bold mb-2">Platform Data Reset</h4>
                    <p className="text-xs text-slate-500 mb-4">Wipe all user registrations, progress, and system data.</p>
                    <button 
                      onClick={() => {
                        const confirmed = window.localStorage.getItem('hustle_reset_confirm');
                        if (confirmed === 'true') {
                          window.localStorage.removeItem('hustle_reset_confirm');
                          hustleService.resetAllData();
                          window.location.reload();
                        } else {
                          window.localStorage.setItem('hustle_reset_confirm', 'true');
                          // Using a simple UI feedback instead of alert
                          const btn = document.activeElement as HTMLButtonElement;
                          if (btn) {
                            const originalText = btn.innerText;
                            btn.innerText = 'CLICK AGAIN TO CONFIRM';
                            btn.classList.add('bg-red-500/40');
                            setTimeout(() => {
                              window.localStorage.removeItem('hustle_reset_confirm');
                              btn.innerText = originalText;
                              btn.classList.remove('bg-red-500/40');
                            }, 3000);
                          }
                        }
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-black text-xs hover:bg-red-500/30 transition-colors border border-red-400/20"
                    >
                      EXECUTE FULL RESET
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'Teacher Dashboard' && profile.role === 'teacher' && (
            <section>
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-8 uppercase text-slate-900">School: {profile.schoolId}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-xl shadow-primary/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">School Students</p>
                      <h3 className="text-2xl font-black text-slate-900">{hustleService.getSchoolUsers(profile.schoolId).filter(u => u.role === 'student').length}</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/5 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-xl shadow-primary/5">
                <h3 className="text-xl font-black mb-6 text-slate-900">Student Roster</h3>
                <div className="space-y-4">
                  {hustleService.getSchoolUsers(profile.schoolId).filter(u => u.role === 'student').map(student => (
                    <div key={student.name} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border border-black/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-primary shadow-sm border border-black/5">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-slate-900">{student.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Class {student.classLevel} • {student.totalXp} XP</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-primary">{student.points} PTS</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{student.completedLevels.length} Missions</p>
                      </div>
                    </div>
                  ))}
                  {hustleService.getSchoolUsers(profile.schoolId).filter(u => u.role === 'student').length === 0 && (
                    <p className="text-slate-500 font-bold italic text-center py-10">No students registered in this school yet.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Admin Panel is now replaced by specific admin tabs */}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  </div>
);
}
