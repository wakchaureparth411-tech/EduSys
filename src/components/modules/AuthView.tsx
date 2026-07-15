'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sun, Moon, UserCheck, ArrowRight, GraduationCap } from 'lucide-react';
import { useAppState } from '@/context/StateContext';
import { UserRole } from '@/context/types';
import { firebaseSignIn, getUserProfile } from '@/lib/firebaseAuth';

export const AuthView: React.FC = () => {
  const { loginWithRegistered, loginWithEmail, settings, updateSettings } = useAppState();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In form
  const [signInForm, setSignInForm] = useState({ usernameOrEmail: '', password: '' });

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ ...settings, theme: newTheme });
    const root = document.documentElement;
    if (newTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 400));

    // 1. Try Super Admin / seeded teacher via context
    const ctxResult = loginWithEmail(signInForm.usernameOrEmail, signInForm.password);
    if (ctxResult.success) {
      setIsLoading(false);
      return;
    }

    // 2. Try Firebase Auth (registered cloud users)
    const result = await firebaseSignIn(signInForm.usernameOrEmail, signInForm.password);
    if (result.success && result.user) {
      const profile = await getUserProfile(result.user.uid);
      if (profile) {
        loginWithRegistered({
          id: result.user.uid,
          username: profile.username as string || result.user.email || '',
          role: profile.role as UserRole || 'Student',
          fullName: profile.fullName as string || result.user.displayName || '',
          email: profile.email as string || result.user.email || '',
          photo: profile.photo as string || result.user.photoURL || ''
        });
      } else {
        loginWithRegistered({
          id: result.user.uid,
          username: result.user.email || '',
          role: 'Student',
          fullName: result.user.displayName || result.user.email || '',
          email: result.user.email || '',
          photo: ''
        });
      }
    } else {
      setError(result.error || ctxResult.error || 'Invalid credentials. Please try again.');
    }

    setIsLoading(false);
  };



  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#090d16] p-4 overflow-hidden">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -80, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -70, 0], y: [0, 60, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-purple-500/12 blur-3xl"
        />
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-2xl bg-violet-400/5 rotate-12 blur-2xl"
        />
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 left-1/5 w-36 h-36 rounded-2xl bg-blue-400/6 rotate-45 blur-2xl"
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/70 dark:bg-[#0f172a]/70 border border-white/40 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:scale-105 transition-all z-10 shadow-sm backdrop-blur-sm"
      >
        {settings.theme === 'light'
          ? <Moon className="w-4 h-4" />
          : <Sun className="w-4 h-4" />
        }
      </button>

      {/* School Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 flex items-center gap-2 z-10"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 hidden sm:block">{settings.schoolName}</span>
      </motion.div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] z-10"
      >
        <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden">
          
          {/* Header Bar */}
          <div className="flex items-center justify-center py-4 border-b border-zinc-100 dark:border-white/10">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Staff & Student Sign In</span>
          </div>

          <div className="p-7 md:p-8">
            
            {/* Logo & Title */}
            <div className="flex flex-col items-center text-center mb-7">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-4"
              >
                <UserCheck className="w-7 h-7 text-white" />
              </motion.div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back!
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                Sign in to access your campus portal
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-medium text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign In Form */}
            <div>
              <form
                  onSubmit={handleSignIn}
                  className="space-y-4"
                >
                  {/* Username / Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Username or Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={signInForm.usernameOrEmail}
                        onChange={e => setSignInForm({ ...signInForm, usernameOrEmail: e.target.value })}
                        placeholder="Enter your username or email"
                        required
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-zinc-800 dark:text-zinc-200 transition-all placeholder:text-zinc-400 placeholder:text-xs"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Password</label>
                      <a href="#" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signInForm.password}
                        onChange={e => setSignInForm({ ...signInForm, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-10 pr-12 py-3 text-sm rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-zinc-800 dark:text-zinc-200 transition-all placeholder:text-zinc-400 placeholder:text-xs"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Sign In <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                    Contact your Super Admin to get access.
                  </p>
                </form>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600 mt-5">
          © 2026 EduSys Campus Management · Secured Portal
        </p>
      </motion.div>
    </div>
  );
};
