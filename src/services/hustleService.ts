/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  classLevel: number;
  totalXp: number;
  points: number;
  completedLevels: number[];
  unlockedLevels: number[];
  unlockedSkins: string[];
  activeSkin: string;
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
}

const STORAGE_KEY = 'hustle_stem_profiles';
const ACTIVE_USER_KEY = 'hustle_stem_active_user';

let cachedProfile: StudentProfile | null = null;
let activeUserName: string | null = localStorage.getItem(ACTIVE_USER_KEY);

const getProfiles = (): Record<string, StudentProfile> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const saveProfiles = (profiles: Record<string, StudentProfile>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const hustleService = {
  login: (name: string): StudentProfile => {
    const profiles = getProfiles();
    if (!profiles[name]) {
      // Create new profile if it doesn't exist
      const defaultProfile: StudentProfile = {
        name,
        classLevel: 1,
        totalXp: 0,
        points: 500,
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
      };
      profiles[name] = defaultProfile;
      saveProfiles(profiles);
    }
    
    activeUserName = name;
    localStorage.setItem(ACTIVE_USER_KEY, name);
    cachedProfile = profiles[name];
    return cachedProfile;
  },

  logout: () => {
    activeUserName = null;
    cachedProfile = null;
    localStorage.removeItem(ACTIVE_USER_KEY);
  },

  getProfile: async (): Promise<StudentProfile | null> => {
    if (!activeUserName) return null;
    if (cachedProfile) return cachedProfile;

    const profiles = getProfiles();
    cachedProfile = profiles[activeUserName] || null;
    return cachedProfile;
  },

  saveProfile: async (profile: StudentProfile) => {
    if (!activeUserName) return;
    cachedProfile = profile;
    const profiles = getProfiles();
    profiles[activeUserName] = profile;
    saveProfiles(profiles);
  },

  getUserCount: () => {
    return Object.keys(getProfiles()).length;
  },

  updateStickers: (stickers: StudentProfile['stickers']) => {
    const profile = cachedProfile;
    if (profile) {
      profile.stickers = stickers;
      hustleService.saveProfile(profile);
    }
  },

  unlockSticker: (stickerId: string) => {
    const profile = cachedProfile;
    if (profile && !profile.unlockedStickers.includes(stickerId)) {
      profile.unlockedStickers.push(stickerId);
      hustleService.saveProfile(profile);
    }
  },

  checkStreak: () => {
    const profile = cachedProfile;
    if (!profile) return 0;

    const now = new Date();
    const lastLogin = new Date(profile.lastLoginDate);
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
    
    const diffTime = Math.abs(today.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      profile.streak += 1;
      profile.lastLoginDate = now.toISOString();
      profile.points += 50 * profile.streak;
      hustleService.saveProfile(profile);
    } else if (diffDays > 1) {
      profile.streak = 1;
      profile.lastLoginDate = now.toISOString();
      hustleService.saveProfile(profile);
    }
    
    return profile.streak;
  },

  addBadge: (badgeId: string) => {
    const profile = cachedProfile;
    if (profile && !profile.badges.includes(badgeId)) {
      profile.badges.push(badgeId);
      profile.points += 500;
      hustleService.saveProfile(profile);
      return true;
    }
    return false;
  },

  unlockBotPart: (partName: string, cost: number) => {
    const profile = cachedProfile;
    if (profile && profile.points >= cost && !profile.unlockedBotParts.includes(partName)) {
      profile.points -= cost;
      profile.unlockedBotParts.push(partName);
      hustleService.saveProfile(profile);
      return { success: true, profile };
    }
    return { success: false, profile: profile || {} as StudentProfile };
  },

  setBotPart: (type: 'head' | 'body' | 'arms' | 'legs', partName: string) => {
    const profile = cachedProfile;
    if (profile && profile.unlockedBotParts.includes(partName)) {
      profile.botLab[type] = partName;
      hustleService.saveProfile(profile);
    }
    return profile;
  },

  addPoints: (amount: number) => {
    const profile = cachedProfile;
    if (profile) {
      profile.points += amount;
      profile.totalXp += amount;
      hustleService.saveProfile(profile);
      return profile.points;
    }
    return 0;
  },

  spendPoints: (amount: number) => {
    const profile = cachedProfile;
    if (profile && profile.points >= amount) {
      profile.points -= amount;
      hustleService.saveProfile(profile);
      return true;
    }
    return false;
  },

  unlockLevel: (levelId: number, cost: number) => {
    const profile = cachedProfile;
    if (profile && !profile.unlockedLevels.includes(levelId) && profile.points >= cost) {
      profile.points -= cost;
      profile.unlockedLevels.push(levelId);
      hustleService.saveProfile(profile);
      return { success: true, profile };
    }
    return { success: false, profile: profile || {} as StudentProfile };
  },

  addXp: (amount: number) => {
    return hustleService.addPoints(amount);
  },

  completeLevel: (levelId: number, attempts: number, moves: any[] = []) => {
    const profile = cachedProfile;
    if (!profile) return;

    if (!profile.completedLevels.includes(levelId)) {
      profile.completedLevels.push(levelId);
      profile.points += 100;
      profile.totalXp += 100;

      const stickerMap: Record<number, string> = {
        11: 'Lion', 12: 'Beaker', 13: 'Puzzle',
        21: 'Pattern', 22: 'Leaf', 23: 'Brain',
        31: 'Human', 32: 'Tree', 33: 'Math',
        41: 'Circuit', 42: 'Binary', 43: 'Robot',
        51: 'Planet', 52: 'Rocket', 53: 'Galaxy'
      };
      const sticker = stickerMap[levelId];
      if (sticker && !profile.unlockedStickers.includes(sticker)) {
        profile.unlockedStickers.push(sticker);
      }
    }
    profile.mazeAttempts[levelId] = (profile.mazeAttempts[levelId] || 0) + attempts;
    
    if (!profile.levelMoves) profile.levelMoves = {};
    if (!profile.levelMoves[levelId]) profile.levelMoves[levelId] = [];
    profile.levelMoves[levelId].push(moves);
    
    hustleService.saveProfile(profile);
  },

  unlockSkin: (skinName: string, cost: number) => {
    const profile = cachedProfile;
    if (profile && profile.totalXp >= cost && !profile.unlockedSkins.includes(skinName)) {
      profile.totalXp -= cost;
      profile.unlockedSkins.push(skinName);
      hustleService.saveProfile(profile);
      return { success: true, profile };
    }
    return { success: false, profile: profile || {} as StudentProfile };
  },

  setActiveSkin: (skinName: string) => {
    const profile = cachedProfile;
    if (profile && profile.unlockedSkins.includes(skinName)) {
      profile.activeSkin = skinName;
      hustleService.saveProfile(profile);
    }
    return profile;
  },

  calculateHustleScore: () => {
    const profile = cachedProfile;
    if (!profile) return 0;
    const levels = Object.keys(profile.mazeAttempts).length;
    if (levels === 0) return 0;
    
    const totalAttempts = Object.values(profile.mazeAttempts).reduce((a, b) => a + b, 0);
    const averageAttempts = totalAttempts / levels;
    
    const score = Math.max(0, 110 - (averageAttempts * 10));
    return Math.round(score);
  }
};
