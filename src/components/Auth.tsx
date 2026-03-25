import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ChevronRight, Sparkles, Users } from 'lucide-react';
import { hustleService, UserRole } from '../services/hustleService';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#f0f9ff_0%,_#f8fafc_100%)]">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white shadow-2xl shadow-primary/20 rotate-12"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2">
            HUSTLE<span className="text-primary">STEM</span>
          </h1>
          <p className="text-slate-500 font-bold">Join the community of young innovators!</p>
          
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
              {userCount} Hustlers Registered
            </span>
          </div>
        </div>

        <motion.div
          layout
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 md:p-10"
        >
          <div className="flex bg-slate-50 p-1 rounded-2xl mb-8 border border-slate-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                isLogin ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                !isLogin ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hustler Name"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">School Name / ID</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  required
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  placeholder="e.g. XYZ School"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold appearance-none"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {role === 'student' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Class Level</label>
                      <select
                        value={classLevel}
                        onChange={(e) => setClassLevel(parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold appearance-none"
                      >
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <option key={lvl} value={lvl}>Class {lvl}</option>
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
                className={`text-center text-xs font-bold ${error.includes('successful') ? 'text-emerald-500' : 'text-red-500'}`}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Login' : 'Create Account'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Secure STEM Learning Environment
        </p>
      </div>
    </div>
  );
};
