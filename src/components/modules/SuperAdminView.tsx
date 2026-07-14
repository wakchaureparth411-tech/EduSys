'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  ShieldAlert, Database, FileSpreadsheet, Trash2, 
  Plus, Check, RefreshCw, Eye, Sparkles, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/context/types';

export const SuperAdminView: React.FC = () => {
  const { 
    activityLogs, admins, addAdmin, deleteAdmin,
    teachers, guards, students, logActivity, addNotification 
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'backups' | 'logs'>('users');
  
  // Backups simulated states
  const [backupProgress, setBackupProgress] = useState<number | null>(null);
  const [restoreProgress, setRestoreProgress] = useState<number | null>(null);
  const [backupsList, setBackupsList] = useState([
    { id: 'BK-1', name: 'Auto_Daily_Backup_13Jul.json', date: '2026-07-13 11:50 PM', size: '1.2 MB' },
    { id: 'BK-2', name: 'Pre_Admission_Seed_Roster.json', date: '2026-07-10 10:00 AM', size: '940 KB' }
  ]);

  // Form State for creating admins/users
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: 'Admin' as UserRole,
    password: 'password123'
  });

  // Simulated Database Actions
  const triggerBackup = () => {
    setBackupProgress(0);
    logActivity('System Backup Started', 'Super Admin triggered manual database backup.');
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBackupProgress(null);
            const newBackup = {
              id: `BK-${backupsList.length + 1}`,
              name: `Manual_Backup_${Date.now()}.json`,
              date: new Date().toLocaleString(),
              size: '1.4 MB'
            };
            setBackupsList(prevList => [newBackup, ...prevList]);
            logActivity('System Backup Completed', `Database checkpoint generated: ${newBackup.name}`);
            addNotification('System database backup completed successfully.');
            alert('Database Backup created and saved locally!');
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const triggerRestore = (backupName: string) => {
    if (!confirm(`Are you sure you want to restore the system state to "${backupName}"? This will overwrite unsaved logs.`)) {
      return;
    }
    
    setRestoreProgress(0);
    logActivity('System Restore Started', `Restoring checkpoint: ${backupName}`);
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setRestoreProgress(null);
            logActivity('System Restore Completed', `Database restored successfully to checkpoint: ${backupName}`);
            addNotification(`System state restored to: ${backupName}`);
            alert('System state successfully restored!');
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  // Submit User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName.trim() || !userForm.username.trim()) {
      alert('Please fill out Name and Username');
      return;
    }

    addAdmin({
      fullName: userForm.fullName,
      username: userForm.username,
      email: userForm.email,
      phone: userForm.phone,
      password: userForm.password,
      role: 'Admin',
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
      bloodGroup: 'O+',
      education: 'Master of Administration',
      work: 'Admissions Office Manager',
      address: 'Staff Quarter C-4',
      dob: '1988-12-12',
      gender: 'Male',
      emergencyContact: '9876543009',
      status: 'Active'
    });

    logActivity('Create Admin User', `Super Admin registered new system executive: ${userForm.fullName}`);
    setShowAddUserModal(false);
    setUserForm({ fullName: '', username: '', email: '', phone: '', role: 'Admin', password: 'password123' });
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (id === 'AD0001') {
      alert('Cannot delete the primary Super Admin account.');
      return;
    }
    if (confirm(`Are you sure you want to remove admin account: ${name}?`)) {
      deleteAdmin(id);
      logActivity('Delete Admin User', `Super Admin removed system executive: ${name}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Super Admin Console</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Manage users, system configurations, audits and checkpoints</p>
        </div>

        {/* Toggles */}
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-[var(--card-border)] self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'users' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            System Admins
          </button>
          <button
            onClick={() => setActiveSubTab('backups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'backups' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            Checkpoints / Backups
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'logs' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            System Audit logs
          </button>
        </div>
      </div>

      {/* 1. USERS LIST VIEW */}
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Executive Admins</h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:scale-[1.01] transition-all"
            >
              <Plus className="w-4 h-4" /> Add Admin
            </button>
          </div>

          <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Admin ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-black/5 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-[10px] text-zinc-400">{admin.id}</td>
                    <td className="px-6 py-3.5 font-bold text-zinc-800 dark:text-zinc-200">{admin.fullName}</td>
                    <td className="px-6 py-3.5 font-mono">{admin.username}</td>
                    <td className="px-6 py-3.5">{admin.email}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${admin.role === 'Super Admin' ? 'bg-red-500/10 text-red-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {admin.id !== 'AD0001' ? (
                        <button
                          onClick={() => handleDeleteUser(admin.id, admin.fullName)}
                          className="p-1.5 rounded-lg bg-black/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-bold italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* 2. BACKUPS VIEW */}
      {activeSubTab === 'backups' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Create Trigger panel */}
            <GlassCard hoverEffect={false} className="col-span-1 p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Database Checkpoint</h4>
                <p className="text-[11px] text-zinc-500 leading-normal mt-1">
                  Export complete campus tables, including student registries, teacher salaries, security clearances, and system settings.
                </p>
              </div>

              {backupProgress !== null ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                    <span>Exporting database...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-primary h-full transition-all duration-150" style={{ width: `${backupProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={triggerBackup}
                  className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-primary/10 hover:bg-brand-primary/95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Database className="w-4 h-4" /> Create Backup Now
                </button>
              )}
            </GlassCard>

            {/* Backups List */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Available Checkpoints</h4>
              
              {restoreProgress !== null && (
                <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-violet-600 dark:text-violet-300">
                    <span>Restoring system state...</span>
                    <span>{restoreProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-violet-600 h-full transition-all duration-100" style={{ width: `${restoreProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {backupsList.map(bk => (
                  <div key={bk.id} className="p-4 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl flex items-center justify-between hover:bg-black/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-zinc-500/10 text-zinc-500 flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{bk.name}</p>
                        <span className="text-[10px] text-zinc-500 mt-0.5 block">{bk.date} | Size: {bk.size}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => triggerRestore(bk.name)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f172a] border border-[var(--card-border)] text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-black/5 transition-colors"
                      disabled={restoreProgress !== null}
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. LOGS AUDIT VIEW */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6">
          <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Audit Logs (Past 100 entries)</h3>

          <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider sticky top-0 backdrop-blur z-10">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Logged User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Action Type</th>
                    <th className="px-6 py-3">Description Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                  {activityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-black/5 transition-colors">
                      <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-2.5 font-bold text-zinc-800 dark:text-zinc-200">{log.userName}</td>
                      <td className="px-6 py-2.5">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          log.role === 'Super Admin' ? 'bg-red-500/10 text-red-500' :
                          log.role === 'Teacher' ? 'bg-purple-500/10 text-purple-500' :
                          log.role === 'Security' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {log.role}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 font-semibold text-zinc-800 dark:text-zinc-100">{log.action}</td>
                      <td className="px-6 py-2.5 text-zinc-500">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowAddUserModal(false)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-3">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Register Admin Account</h3>
                <button onClick={() => setShowAddUserModal(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                    placeholder="e.g. Richard Hendricks"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Username *</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder="e.g. richard.admin"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Email Address</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="richard@edusys.com"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Temporary Password</label>
                  <input
                    type="text"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-[var(--card-border)] pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 rounded-lg bg-black/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
