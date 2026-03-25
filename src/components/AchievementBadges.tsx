import React from 'react';
import { motion } from 'motion/react';
import { Award, Star, Zap, Shield, Rocket, Brain, Code, Microscope, FlaskConical, Binary, CircuitBoard, Globe, TreePine, Tag, RefreshCw, Layers, LayoutGrid, Type, ListOrdered, Filter } from 'lucide-react';
import { StudentProfile } from '../services/hustleService';

interface AchievementBadgesProps {
  profile: StudentProfile;
}

const BADGES = [
  { id: 'first_mission', title: 'First Mission', description: 'Completed your first STEM mission!', icon: Star, color: 'bg-yellow-400', border: 'border-yellow-200' },
  { id: 'math_whiz', title: 'Math Whiz', description: 'Completed 5 Math missions.', icon: Brain, color: 'bg-blue-400', border: 'border-blue-200' },
  { id: 'science_star', title: 'Science Star', description: 'Completed 5 Science missions.', icon: Microscope, color: 'bg-emerald-400', border: 'border-emerald-200' },
  { id: 'tech_titan', title: 'Tech Titan', description: 'Completed 5 Tech missions.', icon: Code, color: 'bg-purple-400', border: 'border-purple-200' },
  { id: 'logic_legend', title: 'Logic Legend', description: 'Completed 5 Logic missions.', icon: Zap, color: 'bg-orange-400', border: 'border-orange-200' },
  { id: 'streak_3', title: '3-Day Streak', description: 'Kept the hustle alive for 3 days!', icon: Shield, color: 'bg-red-400', border: 'border-red-200' },
  { id: 'streak_7', title: '7-Day Streak', description: 'A full week of STEM learning!', icon: Rocket, color: 'bg-sky-400', border: 'border-sky-200' },
  { id: 'point_master', title: 'Point Master', description: 'Earned over 5,000 points.', icon: Award, color: 'bg-indigo-400', border: 'border-indigo-200' },
];

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ profile }) => {
  return (
    <div id="achievements" className="bg-white rounded-[3rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-sky-500 rounded-full" />
              <span className="text-sky-500 font-black uppercase tracking-widest text-sm">Achievements</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Your STEM Journey</h2>
            <p className="text-slate-500 mt-4 text-lg max-w-md">Every mission completed brings you closer to becoming a STEM Master. Keep up the hustle!</p>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">{profile.badges.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earned</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-3xl font-black text-slate-300">{BADGES.length - profile.badges.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locked</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BADGES.map((badge, index) => {
            const isEarned = profile.badges.includes(badge.id);
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative flex flex-col items-center text-center p-8 rounded-[2.5rem] transition-all duration-500 ${
                  isEarned 
                    ? 'bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2' 
                    : 'bg-slate-50/50 border border-dashed border-slate-200 opacity-60 grayscale'
                }`}
              >
                {/* Medal Shape */}
                <div className="relative mb-8">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-8 ${
                    isEarned ? `${badge.color} ${badge.border} shadow-lg` : 'bg-slate-200 border-slate-300'
                  } transition-all duration-500 group-hover:scale-110`}>
                    <badge.icon className={`w-10 h-10 ${isEarned ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  
                  {isEarned && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-slate-50"
                    >
                      <Award className="w-5 h-5 text-sky-500" />
                    </motion.div>
                  )}
                </div>

                <h3 className={`text-xl font-black mb-2 ${isEarned ? 'text-slate-900' : 'text-slate-400'}`}>
                  {badge.title}
                </h3>
                <p className={`text-sm font-medium leading-relaxed ${isEarned ? 'text-slate-500' : 'text-slate-300'}`}>
                  {badge.description}
                </p>

                {!isEarned && (
                  <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-slate-200/50 rounded-full">
                    <Star className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locked</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 p-10 bg-sky-500 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shrink-0">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-black mb-2">Ready for the next level?</h4>
            <p className="text-sky-100 font-medium max-w-xl">Complete more missions to unlock exclusive badges and earn bonus points for the Bot Lab!</p>
          </div>
          
          <button className="bg-white text-sky-600 px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap">
            View Missions
          </button>
        </div>
      </div>
    </div>
  );
};
