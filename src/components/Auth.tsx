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
      
      let profile;
      if (isLogin) {
        profile = hustleService.login(formattedName, schoolId || 'default');
        if (!profile) {
          setError('Hustler not found! Did you register yet?');
          setLoading(false);
          return;
        }
      } else {
        profile = hustleService.register(formattedName, role, schoolId || 'default', classLevel);
      }
      
      onLogin(profile);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again!');
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
          <h1 className="text-4xl font-sans font-bold tracking-tight text-primary mb-2">
            HUSTLE<span className="text-accent">STEM</span>
          </h1>
          <p className="text-text-muted font-medium">Join the community of young innovators!</p>
        </div>

        <motion.div
          layout
          className="glass-card p-8 md:p-10"
        >
          <div className="flex bg-slate-100 p-1 rounded-lg mb-8 border border-slate-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider transition-all ${
                isLogin ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider transition-all ${
                !isLogin ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hustler Name"
                  className="w-full bg-white border border-slate-300 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">School Name / ID</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  required
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  placeholder="e.g. XYZ School"
                  className="w-full bg-white border border-slate-300 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted"
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
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none text-text-main"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {role === 'student' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Class Level</label>
                      <select
                        value={classLevel}
                        onChange={(e) => setClassLevel(parseInt(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none text-text-main"
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
                className={`text-center text-xs font-semibold ${error.includes('successful') ? 'text-success' : 'text-danger'}`}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold uppercase tracking-wider shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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

        <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          Secure STEM Learning Environment
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const confirmed = window.localStorage.getItem('hustle_reset_confirm');
              if (confirmed === 'true') {
                window.localStorage.removeItem('hustle_reset_confirm');
                hustleService.resetAllData();
                window.location.reload();
              } else {
                window.localStorage.setItem('hustle_reset_confirm', 'true');
                setError('Click RESET again to confirm wiping ALL data.');
                setTimeout(() => {
                  window.localStorage.removeItem('hustle_reset_confirm');
                  setError('');
                }, 3000);
              }
            }}
            className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};
