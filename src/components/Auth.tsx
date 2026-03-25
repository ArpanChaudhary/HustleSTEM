import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ChevronRight, Sparkles, Users } from 'lucide-react';
import { hustleService, UserRole } from '../services/hustleService';
import { FloatingBackground } from './FloatingBackground';

import { validateName, formatInput } from '../lib/validation';

interface AuthProps {
  onLogin: (profile: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [classLevel, setClassLevel] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(hustleService.getUserCount());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formattedName = formatInput(name);
    const validation = validateName(formattedName);

    if (!validation.isValid) {
      setError(validation.error || 'Invalid name');
      return;
    }

    setLoading(true);

    try {
      // Simulate a small delay for kid-friendly feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const profile = hustleService.login(formattedName, role, schoolId || 'default');
      if (!isLogin) {
        profile.classLevel = classLevel;
        profile.role = role;
        profile.schoolId = schoolId || 'default';
        hustleService.saveProfile(profile);
      }
      onLogin(profile);
    } catch (err) {
      setError('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <FloatingBackground />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] rotate-12"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">
            HUSTLE<span className="text-primary">STEM</span>
          </h1>
          <p className="text-slate-400 font-bold">Join the community of young innovators!</p>
          
          <div className="mt-4 inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
              {userCount} Hustlers Registered
            </span>
          </div>
        </div>

        <motion.div
          layout
          className="glass rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                isLogin ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                !isLogin ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hustler Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-white placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">School Name / ID</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  placeholder="e.g. XYZ School"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-white placeholder:text-slate-600"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold appearance-none text-white"
                    >
                      <option value="student" className="bg-slate-900">Student</option>
                      <option value="teacher" className="bg-slate-900">Teacher</option>
                      <option value="admin" className="bg-slate-900">Admin</option>
                    </select>
                  </div>

                  {role === 'student' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Class Level</label>
                      <select
                        value={classLevel}
                        onChange={(e) => setClassLevel(parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold appearance-none text-white"
                      >
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <option key={lvl} value={lvl} className="bg-slate-900">Class {lvl}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center text-xs font-bold ${error.includes('successful') ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Login' : 'Create Account'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          Secure STEM Learning Environment
        </p>
      </div>
    </div>
  );
};
