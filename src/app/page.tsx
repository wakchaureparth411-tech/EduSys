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

  const renderView = () => {
    switch (activeTab) {
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

  // Not logged in → show auth screen
  if (!currentUser) {
    return <AuthView />;
  }

  return (
    // .app-shell  = display:flex; flex-direction:row; min-height:100vh
    <div className="app-shell">

      {/* Desktop sidebar — hidden on mobile via Tailwind hidden lg:flex */}
      <Sidebar onToggleAssistant={() => setIsAssistantOpen(true)} />

      {/* .app-content = display:flex; flex-direction:column; flex:1 */}
      <div className="app-content">

        {/* Mobile top bar — visible only on mobile (lg:hidden inside component) */}
        <MobileTopBar onToggleAssistant={() => setIsAssistantOpen(true)} />

        {/* Desktop top navbar — hidden on mobile (hidden lg:flex inside component) */}
        <Navbar />

        {/* .app-main = flex:1; overflow-y:auto */}
        <main className="app-main">
          <div className="p-4 md:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* AI Assistant slide-out panel */}
      <DesignAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
}
