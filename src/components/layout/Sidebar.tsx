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

export const Sidebar: React.FC<SidebarProps> = ({ onToggleAssistant }) => {
  const { activeTab, setActiveTab, currentUser, logout, settings } = useAppState();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'Teacher', 'Student', 'Security'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['Super Admin', 'Admin', 'Teacher'] },
    { id: 'teachers', label: 'Teachers', icon: UserCheck, roles: ['Super Admin', 'Admin'] },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: ['Super Admin', 'Admin', 'Teacher', 'Student'] },
    { id: 'getpass', label: 'Get Pass', icon: FileCheck, roles: ['Super Admin', 'Admin', 'Teacher', 'Student', 'Security'] },
    { id: 'security', label: 'Security', icon: ShieldCheck, roles: ['Super Admin', 'Admin', 'Security'] },
    { id: 'information', label: 'Information', icon: Info, roles: ['Super Admin', 'Admin', 'Teacher', 'Student', 'Security'] },
    { id: 'superadmin', label: 'Super Admin', icon: ShieldAlert, roles: ['Super Admin'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['Super Admin', 'Admin', 'Teacher'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Super Admin', 'Admin'] },
  ];

  // Filter items based on current logged in user's role
  const userRole = currentUser?.role || 'Super Admin';
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const sidebarContent = (
    <div className="flex flex-col h-full text-foreground justify-between">
      <div>
        {/* Logo and Title */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--card-border)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              EduSys
            </h1>
            <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">
              Smart Campus
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-270px)]">
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-250 relative group ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-md shadow-brand-primary/15'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-primary'
                }`}
              >
                <IconComponent className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-brand-primary'}`} />
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
      </div>

      {/* Footer controls & Profile */}
      <div className="p-4 border-t border-[var(--card-border)] space-y-3">
        {/* AI Design Assistant Button */}
        <button
          onClick={() => {
            onToggleAssistant();
            setIsOpenMobile(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 hover:bg-violet-600/20 dark:hover:bg-violet-500/30 transition-all border border-violet-600/20 dark:border-violet-500/30 hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>AI Design Assistant</span>
        </button>

        {/* User Card */}
        {currentUser && (
          <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--card-border)]">
            <img
              src={currentUser.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt={currentUser.fullName}
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-primary/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-tight">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                {currentUser.role}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-zinc-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left side, fixed) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] backdrop-blur-xl z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Top Navbar with Hamburger */}
      <div className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-[var(--navbar-bg)] border-b border-[var(--card-border)] sticky top-0 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-wide bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">EduSys</span>
        </div>
        <button
          onClick={() => setIsOpenMobile(true)}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenMobile(false)}
              className="fixed inset-0 bg-black z-30 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] backdrop-blur-2xl z-40 lg:hidden flex flex-col"
            >
              <button
                onClick={() => setIsOpenMobile(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
