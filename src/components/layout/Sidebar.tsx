'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { 
  LayoutDashboard, Users, UserCheck, CalendarCheck, 
  FileCheck, ShieldCheck, Info, ShieldAlert, 
  BarChart3, Settings, LogOut, GraduationCap, 
  Sparkles, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onToggleAssistant: () => void;
}

// ─── Shared menu items definition ──────────────────────────────────────────
const ALL_MENU_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard, roles: ['Super Admin','Admin','Manager','Teacher','Student','Security'] },
  { id: 'students',    label: 'Students',    icon: Users,           roles: ['Super Admin','Admin','Manager','Teacher'] },
  { id: 'teachers',    label: 'Teachers',    icon: UserCheck,       roles: ['Super Admin','Admin','Manager'] },
  { id: 'attendance',  label: 'Attendance',  icon: CalendarCheck,   roles: ['Super Admin','Admin','Manager','Teacher','Student'] },
  { id: 'getpass',     label: 'Get Pass',    icon: FileCheck,       roles: ['Super Admin','Admin','Manager','Teacher','Student','Security'] },
  { id: 'security',    label: 'Security',    icon: ShieldCheck,     roles: ['Super Admin','Admin','Security'] },
  { id: 'information', label: 'Information', icon: Info,            roles: ['Super Admin','Admin','Manager','Teacher','Student','Security'] },
  { id: 'superadmin',  label: 'Super Admin', icon: ShieldAlert,     roles: ['Super Admin'] },
  { id: 'reports',     label: 'Reports',     icon: BarChart3,       roles: ['Super Admin','Admin','Manager','Teacher'] },
  { id: 'settings',    label: 'Settings',    icon: Settings,        roles: ['Super Admin','Admin'] },
];

// ─── MobileTopBar — exported separately so page.tsx can place it in flex column ──
export const MobileTopBar: React.FC<SidebarProps> = ({ onToggleAssistant }) => {
  const { currentUser, activeTab, setActiveTab, logout } = useAppState();
  const [isOpen, setIsOpen] = useState(false);

  const userRole = currentUser?.role || 'Super Admin';
  const filtered = ALL_MENU_ITEMS.filter(i => i.roles.includes(userRole));

  const sidebarNav = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--card-border)] flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-lg">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">EduSys</h2>
          <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">Smart Campus</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto mt-4 px-4 space-y-1.5">
        {filtered.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group ${
                isActive
                  ? 'text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--card-border)] space-y-3 flex-shrink-0">
        <button
          onClick={() => { onToggleAssistant(); setIsOpen(false); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600/10 text-violet-600 dark:text-violet-300 border border-violet-600/20 hover:bg-violet-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          AI Design Assistant
        </button>
        {currentUser && (
          <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--card-border)]">
            <img
              src={currentUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=4F46E5&color=fff`}
              alt={currentUser.fullName}
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-primary/20 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{currentUser.fullName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{currentUser.role}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-zinc-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top header bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--navbar-bg)] border-b border-[var(--card-border)] backdrop-blur-xl flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">EduSys</span>
        </div>
        <div className="flex items-center gap-2">
          {currentUser && (
            <img
              src={currentUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=4F46E5&color=fff`}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-primary/30"
            />
          )}
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] backdrop-blur-2xl z-40 flex flex-col"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 z-50"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarNav}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Desktop Sidebar ────────────────────────────────────────────────────────
export const Sidebar: React.FC<SidebarProps> = ({ onToggleAssistant }) => {
  const { activeTab, setActiveTab, currentUser, logout } = useAppState();

  const userRole = currentUser?.role || 'Super Admin';
  const filtered = ALL_MENU_ITEMS.filter(i => i.roles.includes(userRole));

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen flex-shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] backdrop-blur-xl z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--card-border)] flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-lg">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">EduSys</h2>
          <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">Smart Campus</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto mt-4 px-4 space-y-1.5">
        {filtered.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group ${
                isActive
                  ? 'text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-md shadow-brand-primary/15'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-primary'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-brand-primary'}`} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeSideIndicator"
                  className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--card-border)] space-y-3 flex-shrink-0">
        <button
          onClick={onToggleAssistant}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-600/20 hover:bg-violet-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          AI Design Assistant
        </button>
        {currentUser && (
          <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--card-border)]">
            <img
              src={currentUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=4F46E5&color=fff`}
              alt={currentUser.fullName}
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-primary/20 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{currentUser.fullName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{currentUser.role}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-zinc-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
