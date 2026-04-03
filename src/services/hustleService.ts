/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher' | 'admin';

export interface DailyChallenge {
  id: string;
  title: string;
  type: 'complete_mission' | 'earn_points' | 'use_whiteboard' | 'custom_part';
  target: number;
  current: number;
  rewardPoints: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export interface PerformanceRecord {
  subject: string;
  accuracy: number;
  time: number; // in seconds
  date: string;
  level: number;
}

export interface IntelligenceProfile {
  subjectMastery: Record<string, number>; // 0-100
  responseTimeAvg: Record<string, number>; // subject -> avg time
  improvementRate: number; // overall percentage
  weakTopics: string[];
  strongTopics: string[];
  mistakePatterns: Record<string, string[]>;
  learningConsistency: number; // 0-100 score
  predictions: {
    nextLevelEstimate: Record<string, number>; // days to next level
    masteryForecast: string;
  };
}

export interface StudentProfile {
  name: string;
  role: UserRole;
  classLevel: number;
  totalXp: number;
  points: number;
  level: number;
  completedLevels: number[];
  unlockedLevels: number[];
  unlockedSkins: string[];
  activeSkin: string;
  schoolId: string;
  mazeAttempts: Record<number, number>; // levelId: attempts
  levelMoves: Record<number, any[][]>; // levelId: array of attempts, each attempt is an array of moves
  badges: string[];
  botLab: {
    head: string;
    body: string;
    arms: string;
    legs: string;
  };
  unlockedBotParts: string[];
  streak: number;
  lastLoginDate: string;
  stickers: { id: string; x: number; y: number; scale: number; rotation: number }[];
  unlockedStickers: string[];
  certificates: { classLevel: number; date: string; id: string }[];
  dailyChallenges: DailyChallenge[];
  lastDailyChallengeDate: string;
  inventory: {
    powerups: string[];
    themes: string[];
  };
  claimedStreakMilestones: number[];
  // Adaptive Learning Fields
  subjectLevels: Record<string, number>; // subject -> level 1-10
  performanceHistory: PerformanceRecord[];
  hustleScore: number;
  challenges: Challenge[];
  friends: string[];
  intelligenceProfile?: IntelligenceProfile;
}

export interface Challenge {
  id: string;
  from: string;
  to: string;
  subject: string;
  missionId: number;
  scoreToBeat: number;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  date: string;
  rewardClaimed: boolean;
  type: 'sent' | 'received';
}

const STORAGE_KEY = 'hustle_stem_profiles';
const ACTIVE_USER_KEY = 'hustle_stem_active_user';
const LEVEL_XP_THRESHOLD = 1000;

const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Ignore
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore
    }
  }
};

let activeUserKey: string | null = safeStorage.getItem(ACTIVE_USER_KEY);
let cachedProfile: StudentProfile | null = null;

const getProfiles = (): Record<string, StudentProfile> => {
  const data = safeStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const saveProfiles = (profiles: Record<string, StudentProfile>) => {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const hustleService = {
  getProfile: (): StudentProfile | null => {
    if (cachedProfile) return { ...cachedProfile };
    if (!activeUserKey) return null;
    const profiles = getProfiles();
    cachedProfile = profiles[activeUserKey] || null;
    return cachedProfile ? { ...cachedProfile } : null;
  },

  clearCache: () => {
    cachedProfile = null;
  },

  saveProfile: (profile: StudentProfile) => {
    if (!activeUserKey) return;
    const profiles = getProfiles();
    profiles[activeUserKey] = profile;
    saveProfiles(profiles);
    cachedProfile = { ...profile };
  },

  logout: () => {
    activeUserKey = null;
    cachedProfile = null;
    safeStorage.setItem(ACTIVE_USER_KEY, '');
  },

  login: (name: string, schoolId: string = 'default'): StudentProfile | null => {
    const profiles = getProfiles();
    const userKey = `${name}:${schoolId}`;

    if (!profiles[userKey]) {
      return null;
    }
    
    activeUserKey = userKey;
    safeStorage.setItem(ACTIVE_USER_KEY, userKey);
    cachedProfile = { ...profiles[userKey] };

    // Check streak and daily challenges on login
    hustleService.checkStreak();
    hustleService.checkDailyChallenges();

    return cachedProfile;
  },

  register: (name: string, role: UserRole, schoolId: string = 'default', classLevel: number = 1): StudentProfile => {
    const profiles = getProfiles();
    const userKey = `${name}:${schoolId}`;

    if (profiles[userKey]) {
      throw new Error('User already exists! Please login instead.');
    }

    const defaultProfile: StudentProfile = {
      name,
      role,
      schoolId,
      classLevel,
      totalXp: 0,
      points: 500,
      level: 1,
      completedLevels: [],
      unlockedLevels: [11, 12, 13],
      unlockedSkins: ['Default Bot'],
      activeSkin: 'Default Bot',
      mazeAttempts: {},
      levelMoves: {},
      badges: [],
      botLab: { head: 'Classic', body: 'Classic', arms: 'Classic', legs: 'Classic' },
      unlockedBotParts: ['Classic'],
      streak: 0,
      lastLoginDate: new Date().toISOString(),
      stickers: [],
      unlockedStickers: ['Star'],
      certificates: [],
      dailyChallenges: [],
      lastDailyChallengeDate: '',
      inventory: {
        powerups: [],
        themes: ['Default Dark']
      },
      claimedStreakMilestones: [],
      subjectLevels: { math: 1, science: 1, tech: 1, logic: 1 },
      performanceHistory: [],
      hustleScore: 0,
      challenges: [
        {
          id: 'mock-1',
          from: 'STEM_Master_99',
          to: name,
          subject: 'math',
          missionId: 1,
          scoreToBeat: 85,
          status: 'pending',
          date: new Date().toISOString(),
          rewardClaimed: false,
          type: 'received'
        }
      ],
      friends: ['STEM_Master_99', 'Logic_Wizard', 'Science_Star']
    };

    profiles[userKey] = defaultProfile;
    saveProfiles(profiles);
    
    activeUserKey = userKey;
    safeStorage.setItem(ACTIVE_USER_KEY, userKey);
    cachedProfile = { ...defaultProfile };

    return cachedProfile;
  },

  // ... existing methods ...

  checkStreak: () => {
    const profile = cachedProfile;
    if (!profile) return 0;

    const now = new Date();
    const lastLogin = new Date(profile.lastLoginDate);
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
    
    const diffTime = today.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      profile.streak += 1;
      profile.lastLoginDate = now.toISOString();
      // Milestone rewards
      const milestones = [3, 7, 15, 30];
      if (milestones.includes(profile.streak) && !profile.claimedStreakMilestones?.includes(profile.streak)) {
        profile.points += profile.streak * 100;
        if (!profile.claimedStreakMilestones) profile.claimedStreakMilestones = [];
        profile.claimedStreakMilestones.push(profile.streak);
      }
      hustleService.saveProfile(profile);
    } else if (diffDays > 1) {
      profile.streak = 1;
      profile.lastLoginDate = now.toISOString();
      hustleService.saveProfile(profile);
    } else if (diffDays === 0) {
      // Already logged in today, just update time if needed
      profile.lastLoginDate = now.toISOString();
      hustleService.saveProfile(profile);
    }
    
    return profile.streak;
  },

  checkDailyChallenges: () => {
    const profile = cachedProfile;
    if (!profile) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (profile.lastDailyChallengeDate !== todayStr) {
      profile.lastDailyChallengeDate = todayStr;
      profile.dailyChallenges = [
        {
          id: 'dc1',
          title: 'Complete 2 Missions',
          type: 'complete_mission',
          target: 2,
          current: 0,
          rewardPoints: 200,
          rewardXp: 150,
          completed: false,
          claimed: false
        },
        {
          id: 'dc2',
          title: 'Earn 500 Points',
          type: 'earn_points',
          target: 500,
          current: 0,
          rewardPoints: 300,
          rewardXp: 200,
          completed: false,
          claimed: false
        },
        {
          id: 'dc3',
          title: 'Customize Your Bot',
          type: 'custom_part',
          target: 1,
          current: 0,
          rewardPoints: 100,
          rewardXp: 100,
          completed: false,
          claimed: false
        }
      ];
      hustleService.saveProfile(profile);
    }
  },

  updateDailyChallengeProgress: (type: DailyChallenge['type'], amount: number = 1) => {
    const profile = cachedProfile;
    if (!profile || !profile.dailyChallenges) return;

    let changed = false;
    profile.dailyChallenges.forEach(dc => {
      if (dc.type === type && !dc.completed) {
        dc.current += amount;
        if (dc.current >= dc.target) {
          dc.current = dc.target;
          dc.completed = true;
        }
        changed = true;
      }
    });

    if (changed) {
      hustleService.saveProfile(profile);
    }
  },

  claimDailyChallengeReward: (challengeId: string) => {
    const profile = cachedProfile;
    if (!profile || !profile.dailyChallenges) return null;

    const dc = profile.dailyChallenges.find(d => d.id === challengeId);
    if (dc && dc.completed && !dc.claimed) {
      dc.claimed = true;
      hustleService.addPoints(dc.rewardPoints);
      hustleService.addXp(dc.rewardXp);
      hustleService.saveProfile(profile);
      return { points: dc.rewardPoints, xp: dc.rewardXp };
    }
    return null;
  },

  addPoints: (amount: number) => {
    const profile = cachedProfile;
    if (profile && profile.role === 'student') {
      profile.points += amount;
      hustleService.updateDailyChallengeProgress('earn_points', amount);
      hustleService.saveProfile(profile);
      return profile.points;
    }
    return profile?.points || 0;
  },

  addXp: (amount: number) => {
    const profile = cachedProfile;
    if (profile && profile.role === 'student') {
      profile.totalXp += amount;
      
      // Level up logic
      const newLevel = Math.floor(profile.totalXp / LEVEL_XP_THRESHOLD) + 1;
      const cappedLevel = Math.min(50, newLevel);
      
      if (cappedLevel > (profile.level || 1)) {
        profile.level = cappedLevel;
        // Level up reward
        profile.points += cappedLevel * 100;
      }
      
      hustleService.saveProfile(profile);
      return profile.totalXp;
    }
    return profile?.totalXp || 0;
  },

  completeLevel: (levelId: number, attempts: number, moves: any[] = []) => {
    const profile = cachedProfile;
    if (!profile) return null;

    let firstTime = false;
    if (!profile.completedLevels.includes(levelId)) {
      profile.completedLevels.push(levelId);
      firstTime = true;
      
      if (profile.role === 'student') {
        hustleService.addPoints(100);
        hustleService.addXp(200);
        hustleService.updateDailyChallengeProgress('complete_mission', 1);
      }

      // ... existing sticker logic ...
    }
    
    profile.mazeAttempts[levelId] = (profile.mazeAttempts[levelId] || 0) + attempts;
    if (!profile.levelMoves) profile.levelMoves = {};
    if (!profile.levelMoves[levelId]) profile.levelMoves[levelId] = [];
    profile.levelMoves[levelId].push(moves);
    
    hustleService.saveProfile(profile);

    // Return mystery box if first time
    if (firstTime) {
      return hustleService.generateMysteryBox();
    }
    return null;
  },

  generateMysteryBox: () => {
    const rewards = [
      { type: 'points', amount: 200, label: '200 Coins' },
      { type: 'points', amount: 500, label: '500 Coins' },
      { type: 'xp', amount: 300, label: '300 XP' },
      { type: 'xp', amount: 1000, label: '1000 XP' },
      { type: 'powerup', id: 'double_xp', label: 'Double XP (1h)' },
      { type: 'skin', id: 'Neon Bot', label: 'Neon Bot Skin' }
    ];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    return reward;
  },

  openMysteryBox: (reward: any) => {
    const profile = cachedProfile;
    if (!profile) return;

    if (reward.type === 'points') {
      hustleService.addPoints(reward.amount);
    } else if (reward.type === 'xp') {
      hustleService.addXp(reward.amount);
    } else if (reward.type === 'skin') {
      if (!profile.unlockedSkins.includes(reward.id)) {
        profile.unlockedSkins.push(reward.id);
      }
    } else if (reward.type === 'powerup') {
      if (!profile.inventory.powerups) profile.inventory.powerups = [];
      profile.inventory.powerups.push(reward.id);
    }
    
    hustleService.saveProfile(profile);
  },

  getLeaderboard: () => {
    const profiles = Object.values(getProfiles());
    return profiles
      .filter(p => p.role === 'student')
      .sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0))
      .slice(0, 10)
      .map((p, idx) => ({
        rank: idx + 1,
        name: p.name,
        xp: p.totalXp || 0,
        level: p.level || 1,
        isCurrentUser: p.name === cachedProfile?.name
      }));
  },

  getShopItems: () => {
    return [
      { id: 'theme_neon', name: 'Neon Theme', cost: 1000, type: 'theme', icon: 'Palette' },
      { id: 'theme_forest', name: 'Forest Theme', cost: 1500, type: 'theme', icon: 'Palette' },
      { id: 'pu_xp_boost', name: 'XP Booster', cost: 500, type: 'powerup', icon: 'Zap' },
      { id: 'pu_shield', name: 'Streak Shield', cost: 2000, type: 'powerup', icon: 'Shield' },
      { id: 'skin_gold', name: 'Gold Bot', cost: 5000, type: 'skin', icon: 'Bot' },
      { id: 'skin_ninja', name: 'Ninja Bot', cost: 3000, type: 'skin', icon: 'Bot' },
    ];
  },

  buyShopItem: (itemId: string, cost: number) => {
    const profile = cachedProfile;
    if (profile && profile.points >= cost) {
      profile.points -= cost;
      const item = hustleService.getShopItems().find(i => i.id === itemId);
      if (item) {
        if (item.type === 'theme') {
          if (!profile.inventory.themes) profile.inventory.themes = [];
          profile.inventory.themes.push(item.id);
        } else if (item.type === 'powerup') {
          if (!profile.inventory.powerups) profile.inventory.powerups = [];
          profile.inventory.powerups.push(item.id);
        } else if (item.type === 'skin') {
          if (!profile.unlockedSkins.includes(item.name)) {
            profile.unlockedSkins.push(item.name);
          }
        }
      }
      hustleService.saveProfile(profile);
      return true;
    }
    return false;
  },

  addBadge: (badge: string) => {
    const profile = hustleService.getProfile();
    if (profile && !profile.badges.includes(badge)) {
      profile.badges.push(badge);
      hustleService.saveProfile(profile);
      return true;
    }
    return false;
  },

  checkCertificates: () => {
    const profile = hustleService.getProfile();
    if (!profile) return [];
    // Simple logic: if completed all levels in a class, award certificate
    const classLevels = [1, 2, 3, 4, 5];
    const newCerts = [];
    for (const cl of classLevels) {
      const levelsInClass = [cl * 10 + 1, cl * 10 + 2, cl * 10 + 3];
      const allCompleted = levelsInClass.every(l => profile.completedLevels.includes(l));
      if (allCompleted && !profile.certificates.some(c => c.classLevel === cl)) {
        const cert = { classLevel: cl, date: new Date().toISOString(), id: `CERT-${cl}-${Date.now()}` };
        profile.certificates.push(cert);
        newCerts.push(cert);
      }
    }
    if (newCerts.length > 0) hustleService.saveProfile(profile);
    return newCerts;
  },

  unlockSkin: (skin: string, cost: number = 0) => {
    const profile = hustleService.getProfile();
    if (profile && profile.points >= cost && !profile.unlockedSkins.includes(skin)) {
      profile.points -= cost;
      profile.unlockedSkins.push(skin);
      hustleService.saveProfile(profile);
      return { success: true };
    }
    return { success: false };
  },

  unlockLevel: (levelId: number, cost: number = 0) => {
    const profile = hustleService.getProfile();
    if (profile && profile.points >= cost && !profile.unlockedLevels.includes(levelId)) {
      profile.points -= cost;
      profile.unlockedLevels.push(levelId);
      hustleService.saveProfile(profile);
      return { success: true };
    }
    return { success: false };
  },

  setActiveSkin: (skin: string) => {
    const profile = hustleService.getProfile();
    if (profile) {
      profile.activeSkin = skin;
      hustleService.saveProfile(profile);
    }
  },

  calculateHustleScore: () => {
    const profile = hustleService.getProfile();
    if (!profile) return 0;
    return (profile.totalXp * 0.5) + (profile.completedLevels.length * 100) + (profile.badges.length * 50);
  },

  getUserCount: () => {
    return Object.keys(getProfiles()).length;
  },

  getGlobalMetrics: () => {
    const profiles = Object.values(getProfiles());
    const totalXp = profiles.reduce((sum, p) => sum + (p.totalXp || 0), 0);
    const totalLevels = profiles.reduce((sum, p) => sum + (p.completedLevels?.length || 0), 0);
    const avgLevel = profiles.length ? Math.floor(profiles.reduce((sum, p) => sum + (p.level || 1), 0) / profiles.length) : 1;
    return { 
      totalXp, 
      totalLevels, 
      avgLevel, 
      activeUsers: profiles.length,
      totalStudents: profiles.length,
      activeSchools: 1,
      missionsLive: 15,
      avgEngagement: '85%'
    };
  },

  getAllUsers: () => {
    return Object.values(getProfiles());
  },

  getCurriculumStatus: () => {
    const profile = hustleService.getProfile();
    if (!profile) return { completed: 0, total: 15 };
    return { completed: profile.completedLevels.length, total: 15 };
  },

  updateUser: (name: string, schoolId: string, updates: Partial<StudentProfile>) => {
    const profiles = getProfiles();
    const oldKey = `${name}:${schoolId}`;
    
    if (profiles[oldKey]) {
      const updatedProfile = { ...profiles[oldKey], ...updates };
      const newKey = `${updatedProfile.name}:${updatedProfile.schoolId}`;
      
      if (oldKey !== newKey) {
        delete profiles[oldKey];
      }
      
      profiles[newKey] = updatedProfile;
      saveProfiles(profiles);
      
      if (activeUserKey === oldKey) {
        activeUserKey = newKey;
        safeStorage.setItem(ACTIVE_USER_KEY, newKey);
        cachedProfile = updatedProfile;
      }
      return true;
    }
    return false;
  },

  deleteUser: (name: string, schoolId: string) => {
    const profiles = getProfiles();
    const userKey = `${name}:${schoolId}`;
    if (profiles[userKey]) {
      delete profiles[userKey];
      saveProfiles(profiles);
      if (activeUserKey === userKey) {
        hustleService.logout();
      }
      return true;
    }
    return false;
  },

  getSystemHealth: () => {
    return { 
      status: 'healthy', 
      uptime: '99.9%', 
      latency: '24ms', 
      load: '12%',
      serverStatus: 'Online',
      databaseLoad: 'Low',
      securityStatus: 'Secure'
    };
  },

  resetAllData: () => {
    safeStorage.removeItem(STORAGE_KEY);
    safeStorage.removeItem(ACTIVE_USER_KEY);
    activeUserKey = null;
    cachedProfile = null;
    // Clear any other potential session data
    try {
      localStorage.clear();
    } catch (e) {
      // Ignore
    }
  },

  getSchoolUsers: (schoolId: string) => {
    return Object.values(getProfiles()).filter(p => p.schoolId === schoolId);
  },

  setBotPart: (type: 'head' | 'body' | 'arms' | 'legs', partId: string) => {
    const profile = hustleService.getProfile();
    if (profile) {
      profile.botLab[type] = partId;
      hustleService.updateDailyChallengeProgress('custom_part', 1);
      hustleService.saveProfile(profile);
      return profile;
    }
    return null;
  },

  unlockBotPart: (partId: string, cost: number = 0) => {
    const profile = hustleService.getProfile();
    if (profile && profile.points >= cost && !profile.unlockedBotParts.includes(partId)) {
      profile.points -= cost;
      profile.unlockedBotParts.push(partId);
      hustleService.saveProfile(profile);
      return { success: true };
    }
    return { success: false };
  },

  updateStickers: (stickers: any[]) => {
    const profile = hustleService.getProfile();
    if (profile) {
      profile.stickers = stickers;
      hustleService.saveProfile(profile);
    }
  },

  recordPerformance: (subject: string, accuracy: number, time: number) => {
    const profile = hustleService.getProfile();
    if (!profile) return null;

    if (!profile.subjectLevels) profile.subjectLevels = { math: 1, science: 1, tech: 1, logic: 1 };
    if (!profile.performanceHistory) profile.performanceHistory = [];

    const currentLevel = profile.subjectLevels[subject] || 1;
    let newLevel = currentLevel;
    let feedback = "You're improving, keep going!";

    // AI Adaptive Logic
    const isFast = time < 25; // More strict for AI tutor
    const isSlow = time > 60;

    if (accuracy >= 90 && isFast) {
      if (currentLevel < 10) {
        newLevel = currentLevel + 1;
        feedback = `Incredible! You've mastered Level ${currentLevel} of ${subject}. Moving you to Level ${newLevel}! 🚀`;
      } else {
        feedback = `You are a ${subject} Grandmaster! Your speed and accuracy are legendary! 🏆`;
      }
    } else if (accuracy < 60 || (accuracy < 80 && isSlow)) {
      // Detect pattern of struggle
      if (currentLevel > 1) {
        newLevel = currentLevel - 1;
        feedback = `Let's slow down and master the basics of ${subject} at Level ${newLevel}. You've got this! 💪`;
      } else {
        feedback = `Don't worry, ${subject} can be tricky! Try a different mission type to build your confidence. ✨`;
      }
    } else if (accuracy >= 80) {
      feedback = `Great job on ${subject}! Focus on your speed to unlock the next level! ⚡`;
    }

    profile.subjectLevels[subject] = newLevel;
    
    const record: PerformanceRecord = {
      subject,
      accuracy,
      time,
      date: new Date().toISOString(),
      level: newLevel
    };

    profile.performanceHistory.push(record);
    if (profile.performanceHistory.length > 100) profile.performanceHistory.shift();

    // Update Intelligence Profile
    hustleService.updateIntelligenceProfile(profile);

    hustleService.saveProfile(profile);
    return { feedback, newLevel, improvement: profile.intelligenceProfile?.improvementRate || 0 };
  },

  updateIntelligenceProfile: (profile: StudentProfile) => {
    const history = profile.performanceHistory;
    const subjects = ['math', 'science', 'tech', 'logic'];
    
    const mastery: Record<string, number> = {};
    const responseAvg: Record<string, number> = {};
    const mistakes: Record<string, string[]> = {};
    
    subjects.forEach(sub => {
      const subHistory = history.filter(h => h.subject === sub);
      if (subHistory.length > 0) {
        mastery[sub] = Math.round(subHistory.reduce((sum, h) => sum + h.accuracy, 0) / subHistory.length);
        responseAvg[sub] = Math.round(subHistory.reduce((sum, h) => sum + h.time, 0) / subHistory.length);
        
        // Pattern detection
        const recent = subHistory.slice(-5);
        const lowAccuracy = recent.filter(r => r.accuracy < 70).length;
        const slowResponse = recent.filter(r => r.time > 60).length;
        
        mistakes[sub] = [];
        if (lowAccuracy >= 3) mistakes[sub].push("Accuracy consistency");
        if (slowResponse >= 3) mistakes[sub].push("Response speed");
      } else {
        mastery[sub] = 0;
        responseAvg[sub] = 0;
        mistakes[sub] = [];
      }
    });

    // Improvement Rate (compare last 10 vs previous 10)
    const recentAvg = history.slice(-10).reduce((sum, h) => sum + h.accuracy, 0) / Math.max(1, Math.min(10, history.length));
    const previousAvg = history.slice(-20, -10).reduce((sum, h) => sum + h.accuracy, 0) / Math.max(1, Math.min(10, history.length - 10));
    const improvementRate = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0;

    // Weak vs Strong
    const sortedSubjects = [...subjects].sort((a, b) => (mastery[b] || 0) - (mastery[a] || 0));
    const strongTopics = sortedSubjects.filter(s => mastery[s] >= 80);
    const weakTopics = sortedSubjects.filter(s => mastery[s] < 60 && history.filter(h => h.subject === s).length > 0);

    // Consistency Score
    const activityFrequency = history.length / 30; // missions per day avg (approx)
    const learningConsistency = Math.min(100, Math.round((profile.streak * 5) + (activityFrequency * 20)));

    // Predictions
    const nextLevelEstimate: Record<string, number> = {};
    subjects.forEach(sub => {
      const subHistory = history.filter(h => h.subject === sub);
      if (subHistory.length >= 5) {
        const trend = subHistory.slice(-5).reduce((sum, h, i, arr) => i > 0 ? sum + (h.accuracy - arr[i-1].accuracy) : sum, 0);
        nextLevelEstimate[sub] = trend > 0 ? Math.max(1, Math.round((100 - mastery[sub]) / trend)) : 7;
      } else {
        nextLevelEstimate[sub] = 7; // Default 1 week
      }
    });

    profile.intelligenceProfile = {
      subjectMastery: mastery,
      responseTimeAvg: responseAvg,
      improvementRate,
      weakTopics,
      strongTopics,
      mistakePatterns: mistakes,
      learningConsistency,
      predictions: {
        nextLevelEstimate,
        masteryForecast: improvementRate > 0 ? "Positive growth trend detected." : "Steady progress. Try increasing mission frequency!"
      }
    };

    // AI-Based Hustle Score (0-100)
    const avgMastery = Object.values(mastery).reduce((sum, m) => sum + m, 0) / 4;
    const avgLevelPoints = (Object.values(profile.subjectLevels).reduce((sum, l) => sum + l, 0) / 4) * 5; // Max 50
    const consistencyPoints = learningConsistency * 0.3; // Max 30
    const improvementPoints = Math.max(0, improvementRate * 0.2); // Bonus for improvement
    
    profile.hustleScore = Math.min(100, Math.round((avgMastery * 0.2) + avgLevelPoints + consistencyPoints + improvementPoints));
  },

  getAIInsights: () => {
    const profile = hustleService.getProfile();
    if (!profile || !profile.intelligenceProfile) return null;
    
    const ip = profile.intelligenceProfile;
    const insights: string[] = [];
    
    if (ip.improvementRate > 10) insights.push(`You're improving fast! Your accuracy is up ${ip.improvementRate}% recently! 📈`);
    if (ip.weakTopics.length > 0) insights.push(`Let's practice ${ip.weakTopics[0]} a bit more to build your foundation. 🧱`);
    if (ip.strongTopics.length > 0) insights.push(`You're ready for advanced challenges in ${ip.strongTopics[0]}! 🌟`);
    
    const nextSub = Object.entries(ip.predictions.nextLevelEstimate).sort((a, b) => a[1] - b[1])[0];
    if (nextSub) {
      insights.push(`Prediction: You can reach Level ${profile.subjectLevels[nextSub[0]] + 1} in ${nextSub[0]} in about ${nextSub[1]} days! 🗓️`);
    }

    return insights;
  },

  getMotivationalMessage: () => {
    const messages = [
      "You're doing amazing! Keep it up! 🚀",
      "I'm so proud of your hard work today! ✨",
      "You're a STEM superstar! 🌟",
      "Every mistake is just a step towards mastery. You've got this! 💪",
      "Your brain is growing with every puzzle you solve! 🧠",
      "You're on a roll! What can't you do? 🌈",
      "STEM is more fun with a genius like you! 🤖",
      "Keep exploring, the universe is waiting for you! 🌌"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  getTodayImprovement: () => {
    const profile = hustleService.getProfile();
    if (!profile || profile.performanceHistory.length < 2) return 0;

    const today = new Date().toISOString().split('T')[0];
    const todayRecords = profile.performanceHistory.filter(r => r.date.startsWith(today));
    
    if (todayRecords.length < 2) return 0;

    const firstAccuracy = todayRecords[0].accuracy;
    const lastAccuracy = todayRecords[todayRecords.length - 1].accuracy;
    
    if (lastAccuracy > firstAccuracy) {
      return Math.round(((lastAccuracy - firstAccuracy) / (firstAccuracy || 1)) * 100);
    }
    return 0;
  },

  shareAchievement: (type: 'badge' | 'certificate', id: string) => {
    const profile = hustleService.getProfile();
    if (!profile) return null;

    const reward = { points: 50, xp: 100 };
    profile.points += reward.points;
    profile.totalXp += reward.xp;
    
    hustleService.saveProfile(profile);
    return reward;
  },

  createChallenge: (to: string, subject: string, missionId: number, score: number) => {
    const profile = hustleService.getProfile();
    if (!profile) return null;

    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      from: profile.name,
      to,
      subject,
      missionId,
      scoreToBeat: score,
      status: 'pending',
      date: new Date().toISOString(),
      rewardClaimed: false,
      type: 'sent'
    };

    profile.challenges.push(newChallenge);
    hustleService.saveProfile(profile);
    return newChallenge;
  },

  respondToChallenge: (challengeId: string, action: 'accepted' | 'declined') => {
    const profile = hustleService.getProfile();
    if (!profile) return null;

    const challenge = profile.challenges.find(c => c.id === challengeId);
    if (challenge) {
      challenge.status = action;
      hustleService.saveProfile(profile);
    }
    return challenge;
  },

  completeChallenge: (challengeId: string, score: number) => {
    const profile = hustleService.getProfile();
    if (!profile) return null;

    const challenge = profile.challenges.find(c => c.id === challengeId);
    if (challenge && challenge.status === 'accepted') {
      if (score >= challenge.scoreToBeat) {
        challenge.status = 'completed';
        const reward = { points: 200, xp: 500 };
        profile.points += reward.points;
        profile.totalXp += reward.xp;
        challenge.rewardClaimed = true;
        hustleService.saveProfile(profile);
        return { success: true, reward };
      }
    }
    return { success: false };
  }
};
