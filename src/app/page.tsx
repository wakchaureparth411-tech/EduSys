'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { Sidebar, MobileTopBar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { DesignAssistant } from '@/components/design-assistant/DesignAssistant';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthView }        from '@/components/modules/AuthView';
import { DashboardView }   from '@/components/modules/DashboardView';
import { StudentView }     from '@/components/modules/StudentView';
import { TeacherView }     from '@/components/modules/TeacherView';
import { AttendanceView }  from '@/components/modules/AttendanceView';
import { GetPassView }     from '@/components/modules/GetPassView';
import { SecurityView }    from '@/components/modules/SecurityView';
import { InformationView } from '@/components/modules/InformationView';
import { SuperAdminView }  from '@/components/modules/SuperAdminView';
import { ReportsView }     from '@/components/modules/ReportsView';
import { SettingsView }    from '@/components/modules/SettingsView';

export default function Home() {
  const { currentUser, activeTab } = useAppState();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':   return <DashboardView   key="dashboard"   />;
      case 'students':    return <StudentView      key="students"    />;
      case 'teachers':    return <TeacherView      key="teachers"    />;
      case 'attendance':  return <AttendanceView   key="attendance"  />;
      case 'getpass':     return <GetPassView      key="getpass"     />;
      case 'security':    return <SecurityView     key="security"    />;
      case 'information': return <InformationView  key="information" />;
      case 'superadmin':  return <SuperAdminView   key="superadmin"  />;
      case 'reports':     return <ReportsView      key="reports"     />;
      case 'settings':    return <SettingsView     key="settings"    />;
      default:            return <DashboardView    key="dashboard"   />;
    }
  };

  if (!currentUser) return <AuthView />;

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--background, #f8fafc)',
      }}
    >
      {/* Desktop sidebar — CSS hides it on mobile */}
      <Sidebar onToggleAssistant={() => setIsAssistantOpen(true)} />

      {/* Right column — takes all remaining width */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        {/* Mobile top bar (only visible on mobile, flex-shrink:0) */}
        <MobileTopBar onToggleAssistant={() => setIsAssistantOpen(true)} />

        {/* Desktop top Navbar (hidden on mobile via CSS) */}
        <Navbar />

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div className="p-4 md:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <DesignAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
}
