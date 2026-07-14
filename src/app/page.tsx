'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { DesignAssistant } from '@/components/design-assistant/DesignAssistant';
import { motion, AnimatePresence } from 'framer-motion';

// Module Views
import { LoginView } from '@/components/modules/LoginView';
import { DashboardView } from '@/components/modules/DashboardView';
import { StudentView } from '@/components/modules/StudentView';
import { TeacherView } from '@/components/modules/TeacherView';
import { AttendanceView } from '@/components/modules/AttendanceView';
import { GetPassView } from '@/components/modules/GetPassView';
import { SecurityView } from '@/components/modules/SecurityView';
import { InformationView } from '@/components/modules/InformationView';
import { SuperAdminView } from '@/components/modules/SuperAdminView';
import { ReportsView } from '@/components/modules/ReportsView';
import { SettingsView } from '@/components/modules/SettingsView';

export default function Home() {
  const { currentUser, activeTab } = useAppState();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Render the appropriate panel based on sidebar selection
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView key="dashboard" />;
      case 'students':
        return <StudentView key="students" />;
      case 'teachers':
        return <TeacherView key="teachers" />;
      case 'attendance':
        return <AttendanceView key="attendance" />;
      case 'getpass':
        return <GetPassView key="getpass" />;
      case 'security':
        return <SecurityView key="security" />;
      case 'information':
        return <InformationView key="information" />;
      case 'superadmin':
        return <SuperAdminView key="superadmin" />;
      case 'reports':
        return <ReportsView key="reports" />;
      case 'settings':
        return <SettingsView key="settings" />;
      default:
        return <DashboardView key="dashboard" />;
    }
  };

  // If not logged in, force Login screen
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-[#090d16] overflow-x-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar onToggleAssistant={() => setIsAssistantOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Content View Area */}
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6 overflow-y-auto relative">
          
          {/* Backdrops elements */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand-primary/3 blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-brand-secondary/4 blur-3xl" />
          </div>

          {/* Animating container for smooth subpage transitions */}
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>

      {/* AI Design Assistant Console (Slide-out) */}
      <DesignAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

    </div>
  );
}
