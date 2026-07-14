'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { GraduationCap, Mail, Lock, UserCheck, Shield, Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '@/context/types';

export const LoginView: React.FC = () => {
  const { login, settings, updateSettings } = useAppState();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<UserRole>('Super Admin');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    
    // Attempt Login
    const success = login(username, role);
    if (!success) {
      setError('Invalid username or role match');
    }
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ ...settings, theme: newTheme });
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Preset usernames for convenience of testing
  const handlePresetSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Super Admin') setUsername('admin');
    else if (selectedRole === 'Teacher') setUsername('rahul.math');
    else if (selectedRole === 'Student') setUsername('aman.verma');
    else if (selectedRole === 'Security') setUsername('suresh.security');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#090d16] p-4 overflow-hidden bg-grid-pattern">
      
      {/* Floating Animated Glass Nodes for premium UX */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -90, 0],
            y: [0, 80, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-brand-secondary/15 blur-3xl"
        />
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-xl bg-purple-500/5 rotate-12 blur-2xl"
        />
      </div>

      {/* Theme toggle helper at corner */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white/70 dark:bg-[#0f172a]/70 border border-[var(--card-border)] text-zinc-600 dark:text-zinc-300 hover:scale-105 transition-all z-10 shadow-sm"
      >
        {settings.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <GlassCard hoverEffect={false} className="p-8 md:p-10 shadow-2xl relative">
          
          {/* Logo & School Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ rotate: -15, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-xl shadow-brand-primary/20 mb-4"
            >
              <GraduationCap className="w-8 h-8" />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              {settings.schoolName}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 font-medium">Smart Campus Portal Management</p>
          </div>

          {/* Quick Role Preset Picker (Excellent UX!) */}
          <div className="mb-6 space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Select Testing Role</span>
            <div className="grid grid-cols-4 gap-1">
              {(['Super Admin', 'Teacher', 'Student', 'Security'] as UserRole[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handlePresetSelect(r)}
                  className={`py-1.5 px-1 rounded-lg text-[9px] font-bold text-center border transition-all ${
                    role === r
                      ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30'
                      : 'bg-black/5 dark:bg-white/5 border-[var(--card-border)] hover:bg-black/10 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {r === 'Super Admin' ? 'Admin' : r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Username / Email</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none focus:border-brand-primary/50 text-zinc-800 dark:text-zinc-200"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Password</label>
                <a href="#forgot" className="text-[10px] text-brand-primary font-semibold hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none focus:border-brand-primary/50 text-zinc-800 dark:text-zinc-200"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-brand-primary bg-black/5 border-[var(--card-border)] rounded focus:ring-brand-primary/30 accent-brand-primary"
              />
              <label htmlFor="remember" className="ml-2 text-[11px] text-zinc-500 select-none">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all hover:scale-[1.01]"
            >
              Sign In to Account
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-6 space-y-4">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[var(--card-border)]"></div>
              <span className="flex-shrink mx-4 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-[var(--card-border)]"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => login(`${role.toLowerCase().replace(' ', '-')}.demo`, role)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => login(`${role.toLowerCase().replace(' ', '-')}.demo`, role)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--card-border)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M0 0h11v11H0z" />
                  <path fill="#81bc06" d="M12 0h11v11H12z" />
                  <path fill="#05a6f0" d="M0 12h11v11H0z" />
                  <path fill="#ffba08" d="M12 12h11v11H12z" />
                </svg>
                <span>Microsoft</span>
              </button>
            </div>
          </div>
          
        </GlassCard>
      </motion.div>
    </div>
  );
};
