'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '@/context/StateContext';
import { Search, Bell, MessageSquare, Sun, Moon, LogOut, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { 
    currentUser, logout, settings, updateSettings, 
    notifications, markNotificationsAsRead, clearNotifications,
    students, teachers, setActiveTab
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme management
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

  // Sync theme class on load
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Search logic
  const filteredStudents = searchQuery.trim() === '' ? [] : students.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.classVal.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  const filteredTeachers = searchQuery.trim() === '' ? [] : teachers.filter(t => 
    t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  const totalResults = filteredStudents.length + filteredTeachers.length;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="hidden lg:flex w-full h-16 sticky top-0 bg-[var(--navbar-bg)] border-b border-[var(--card-border)] backdrop-blur-xl z-10 px-4 md:px-6 items-center justify-between">
      
      {/* Global Search Bar */}
      <div ref={searchRef} className="relative w-64 md:w-80">
        <div className="relative">
          <input
            type="text"
            placeholder="Search students, teachers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none focus:border-brand-primary/50 text-zinc-800 dark:text-zinc-200 transition-colors"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearchDropdown && searchQuery.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 right-0 mt-2 p-2 bg-white dark:bg-[#0f172a] rounded-xl border border-[var(--card-border)] shadow-xl max-h-96 overflow-y-auto"
            >
              {totalResults === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">No results found for "{searchQuery}"</div>
              ) : (
                <div className="space-y-3 p-1">
                  {filteredStudents.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1 px-2">Students</h4>
                      {filteredStudents.map(student => (
                        <button
                          key={student.id}
                          onClick={() => {
                            setActiveTab('students');
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-xs transition-colors"
                        >
                          <img src={student.photo} alt={student.fullName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{student.fullName}</p>
                            <p className="text-[10px] text-zinc-500">{student.classVal}-{student.division} | {student.id}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredTeachers.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1 px-2">Teachers</h4>
                      {filteredTeachers.map(teacher => (
                        <button
                          key={teacher.id}
                          onClick={() => {
                            setActiveTab('teachers');
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-xs transition-colors"
                        >
                          <img src={teacher.photo} alt={teacher.fullName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{teacher.fullName}</p>
                            <p className="text-[10px] text-zinc-500">{teacher.subject} | {teacher.id}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 md:gap-4">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {settings.theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>

        {/* Notifications Center */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                markNotificationsAsRead();
              }
            }}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#090d16]" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#0f172a] rounded-xl border border-[var(--card-border)] shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
                  <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">System Notifications</h3>
                  <div className="flex gap-2">
                    <button onClick={markNotificationsAsRead} className="text-[10px] text-brand-primary font-semibold hover:underline">Mark read</button>
                    <span className="text-zinc-300 dark:text-zinc-600">|</span>
                    <button onClick={clearNotifications} className="text-[10px] text-red-500 font-semibold hover:underline">Clear all</button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[var(--card-border)]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-500">No new notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-4 flex gap-3 ${notif.read ? 'bg-transparent' : 'bg-brand-primary/5 dark:bg-brand-primary/10'}`}>
                        <div className="flex-1 text-xs">
                          <p className="font-medium text-zinc-800 dark:text-zinc-200">{notif.text}</p>
                          <span className="text-[10px] text-zinc-400 block mt-1">{notif.time}</span>
                        </div>
                        {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary self-center" />}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar Dropdown */}
        {currentUser && (
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <img
                src={currentUser.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#0f172a] rounded-xl border border-[var(--card-border)] shadow-xl overflow-hidden py-1"
                >
                  <div className="px-4 py-2.5 border-b border-[var(--card-border)]">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{currentUser.fullName}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('information');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors"
                  >
                    System Settings
                  </button>
                  <hr className="border-[var(--card-border)] my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-500/5 text-left transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};
