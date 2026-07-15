'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Sun, Moon, UserCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useAppState } from '@/context/StateContext';
import { UserRole } from '@/context/types';
import { firebaseRegister, firebaseSignIn, getUserProfile } from '@/lib/firebaseAuth';

type AuthMode = 'signin' | 'signup';

export const AuthView: React.FC = () => {
  const { loginWithRegistered, loginWithEmail, settings, updateSettings } = useAppState();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In form
  const [signInForm, setSignInForm] = useState({ usernameOrEmail: '', password: '' });

  // Sign Up form
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Student' as UserRole
  });

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 500));

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    // Register via Firebase Auth + Firestore
    const result = await firebaseRegister({
      fullName: signUpForm.fullName,
      email: signUpForm.email,
      username: signUpForm.username,
      password: signUpForm.password,
      role: signUpForm.role
    });

    if (result.success) {
      setSuccess('Account created! You can now sign in. ✅');
      setSignUpForm({ fullName: '', email: '', username: '', password: '', confirmPassword: '', role: 'Student' });
      setTimeout(() => {
        setMode('signin');
        setSuccess('');
        setSignInForm({ usernameOrEmail: signUpForm.email, password: '' });
      }, 2000);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  const roles: UserRole[] = ['Student', 'Teacher', 'Super Admin', 'Security'];
  const roleIcons: Record<string, string> = {
    'Student': '🎓',
    'Teacher': '📚',
    'Super Admin': '🛡️',
    'Security': '🔒'
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
          
          {/* Tab Bar */}
          <div className="flex border-b border-zinc-100 dark:border-white/10">
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${
                mode === 'signin'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
            >
              Sign In
              {mode === 'signin' && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${
                mode === 'signup'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
            >
              Create Account
              {mode === 'signup' && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                />
              )}
            </button>
          </div>

          <div className="p-7 md:p-8">
            
            {/* Logo & Title */}
            <div className="flex flex-col items-center text-center mb-7">
              <motion.div
                key={mode}
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-4"
              >
                {mode === 'signin'
                  ? <UserCheck className="w-7 h-7 text-white" />
                  : <Sparkles className="w-7 h-7 text-white" />
                }
              </motion.div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {mode === 'signin' ? 'Welcome Back!' : 'Join EduSys'}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                {mode === 'signin'
                  ? 'Sign in to access your campus portal'
                  : 'Create your account and get started'
                }
              </p>
            </div>

            {/* Status Messages */}
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
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              
              {/* ── SIGN IN FORM ── */}
              {mode === 'signin' && (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
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
                    Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => { setMode('signup'); setError(''); }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Create one free
                    </button>
                  </p>
                </motion.form>
              )}

              {/* ── SIGN UP FORM ── */}
              {mode === 'signup' && (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSignUp}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={signUpForm.fullName}
                        onChange={e => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                        placeholder="e.g. Aman Verma"
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-zinc-800 dark:text-zinc-200 transition-all placeholder:text-zinc-400 placeholder:text-xs"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="email"
                        value={signUpForm.email}
                        onChange={e => setSignUpForm({ ...signUpForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-zinc-800 dark:text-zinc-200 transition-all placeholder:text-zinc-400 placeholder:text-xs"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">@</span>
                      <input
                        type="text"
                        value={signUpForm.username}
                        onChange={e => setSignUpForm({ ...signUpForm, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                        placeholder="choose.a.username"
                        required
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-zinc-800 dark:text-zinc-200 transition-all placeholder:text-zinc-400 placeholder:text-xs"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      {roles.map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSignUpForm({ ...signUpForm, role: r })}
                          className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                            signUpForm.role === r
                              ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                              : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-zinc-300'
                          }`}
                        >
                          <span>{roleIcons[r]}</span>
                          <span>{r === 'Super Admin' ? 'Admin' : r}</span>
                          {signUpForm.role === r && <CheckCircle2 className="w-3 h-3 ml-auto shrink-0 text-indigo-500" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Passwords Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signUpForm.password}
                          onChange={e => setSignUpForm({ ...signUpForm, password: e.target.value })}
                          placeholder="Min 6 chars"
                          required
                          minLength={6}
                          className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-zinc-800 dark:text-zinc-200 transition-all placeholder:text-zinc-400"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signUpForm.confirmPassword}
                          onChange={e => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                          placeholder="Repeat password"
                          required
                          className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-zinc-800 dark:text-zinc-200 transition-all placeholder:text-zinc-400"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Match Indicator */}
                  {signUpForm.confirmPassword && (
                    <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                      signUpForm.password === signUpForm.confirmPassword ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {signUpForm.password === signUpForm.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Create My Account <Sparkles className="w-4 h-4" /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setMode('signin'); setError(''); }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      Sign in here
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

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
