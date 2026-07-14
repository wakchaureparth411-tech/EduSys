'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Shield, UserCheck, Eye, Phone, MapPin, 
  Clock, Plus, ScanLine, ArrowRightLeft, UserPlus, Info, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisitorRecord {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  whomToMeet: string;
  entryTime: string;
  exitTime?: string;
}

export const SecurityView: React.FC = () => {
  const { 
    guards, updateGuard, getPassRequests, scanGetPassQR, teachers, currentUser 
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<'status' | 'logs' | 'scanner'>('status');
  const [logTypeTab, setLogTypeTab] = useState<'students' | 'teachers' | 'visitors'>('students');
  const [selectedPassForScan, setSelectedPassForScan] = useState('');
  
  // Visitor Logs state
  const [visitors, setVisitors] = useState<VisitorRecord[]>([
    { id: 'V101', name: 'Rakesh Sharma', phone: '9892123456', purpose: 'Parent Meeting', whomToMeet: 'Mrs. Priya Patel', entryTime: '09:15 AM', exitTime: '10:05 AM' },
    { id: 'V102', name: 'Alok Gupta', phone: '9820304050', purpose: 'Maintenance Delivery', whomToMeet: 'Admin Office', entryTime: '10:30 AM' }
  ]);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    phone: '',
    purpose: 'Parent Meeting',
    whomToMeet: ''
  });

  // Calculate duty counts
  const onDutyCount = guards.filter(g => g.status === 'On Duty').length;
  const offDutyCount = guards.filter(g => g.status === 'Off Duty').length;
  const onLeaveCount = guards.filter(g => g.status === 'On Leave').length;

  // Toggle guard duty status (editable shift)
  const toggleGuardStatus = (guardId: string, currentStatus: any) => {
    const nextStatusMap: { [key: string]: any } = {
      'On Duty': 'Off Duty',
      'Off Duty': 'On Leave',
      'On Leave': 'On Duty'
    };
    const guard = guards.find(g => g.id === guardId);
    if (guard) {
      updateGuard({
        ...guard,
        status: nextStatusMap[currentStatus]
      });
    }
  };

  // Student exits: passes with an exitTime
  const studentExitPasses = getPassRequests.filter(p => p.exitTime);

  // Mock Teacher exit logs
  const teacherExitLogs = [
    { id: 'TC8002', name: 'Mrs. Priya Patel', subject: 'Science', exitTime: '11:15 AM', entryTime: '01:00 PM', gate: 'Main Gate' },
    { id: 'TC8005', name: 'Mr. Rohit Kumar', subject: 'PE', exitTime: '02:30 PM', gate: 'Sports Complex Gate' }
  ];

  // Scan handler
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const handleQRScan = (type: 'exit' | 'entry') => {
    if (!selectedPassForScan) {
      alert('Please select a QR code or pass to scan');
      return;
    }
    const result = scanGetPassQR(selectedPassForScan, type);
    setScanResult(result);
    setTimeout(() => setScanResult(null), 3000);
  };

  // Approved passes available for scanning
  const scanReadyPasses = getPassRequests.filter(p => p.status === 'Approved');

  // Submit visitor
  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorForm.name.trim() || !visitorForm.whomToMeet.trim()) {
      alert('Please fill out Visitor Name and Meeting Contact');
      return;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newVisitor: VisitorRecord = {
      id: `V${visitors.length + 101}`,
      name: visitorForm.name,
      phone: visitorForm.phone,
      purpose: visitorForm.purpose,
      whomToMeet: visitorForm.whomToMeet,
      entryTime: timeString
    };

    setVisitors(prev => [newVisitor, ...prev]);
    setShowVisitorModal(false);
    setVisitorForm({ name: '', phone: '', purpose: 'Parent Meeting', whomToMeet: '' });
  };

  const handleVisitorExit = (id: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, exitTime: timeString } : v));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Security & Gate Operations</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Control gate permissions, shifts, and campus exits</p>
        </div>

        {/* Sub-tabs toggler */}
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-[var(--card-border)] self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'status' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            Guards Status
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'logs' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            Gate Logs
          </button>
          <button
            onClick={() => setActiveSubTab('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'scanner' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            QR Scanner Terminal
          </button>
        </div>
      </div>

      {/* 1. GUARDS STATUS VIEW */}
      {activeSubTab === 'status' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-center rounded-xl">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{onDutyCount}</span>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">Guards On Duty</p>
            </div>
            <div className="p-4 bg-zinc-500/10 border border-zinc-500/20 text-center rounded-xl">
              <span className="text-2xl font-extrabold text-zinc-600 dark:text-zinc-400">{offDutyCount}</span>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">Guards Off Duty</p>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-center rounded-xl">
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{onLeaveCount}</span>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">On Leave</p>
            </div>
          </div>

          {/* Guards roster */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guards.map(g => (
              <GlassCard key={g.id} hoverEffect className="p-5 flex flex-col justify-between" glowColor="rgba(59, 130, 246, 0.08)">
                <div className="flex gap-4">
                  <img src={g.photo} alt={g.fullName} className="w-16 h-16 rounded-xl object-cover border border-[var(--card-border)]" />
                  <div>
                    <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{g.fullName}</h3>
                    <p className="text-[9px] font-mono text-zinc-400 mt-0.5">Security Roster: {g.id}</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 ${
                      g.status === 'On Duty' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' :
                      g.status === 'Off Duty' ? 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-300'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-[10px] text-zinc-500 border-t border-[var(--card-border)] pt-4 font-semibold">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Assigned: {g.work}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Contact: {g.phone}</div>
                </div>

                {/* Change shift toggle */}
                {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                  <button
                    onClick={() => toggleGuardStatus(g.id, g.status)}
                    className="w-full mt-4 py-2 bg-black/5 hover:bg-black/10 border border-[var(--card-border)] rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    Cycle Duty Status
                  </button>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* 2. GATE LOGS VIEW */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6">
          {/* Logs Swapper */}
          <div className="flex items-center justify-between">
            <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-[var(--card-border)]">
              <button
                onClick={() => setLogTypeTab('students')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  logTypeTab === 'students' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
                }`}
              >
                Student Exits
              </button>
              <button
                onClick={() => setLogTypeTab('teachers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  logTypeTab === 'teachers' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
                }`}
              >
                Teacher Shift Logs
              </button>
              <button
                onClick={() => setLogTypeTab('visitors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  logTypeTab === 'visitors' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
                }`}
              >
                Visitor Logs
              </button>
            </div>

            {logTypeTab === 'visitors' && (
              <button
                onClick={() => setShowVisitorModal(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:scale-[1.01] transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Visitor</span>
              </button>
            )}
          </div>

          <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              
              {/* STUDENT EXITS TABLE */}
              {logTypeTab === 'students' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Pass ID</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Destination</th>
                      <th className="px-6 py-4">Exit Recorded</th>
                      <th className="px-6 py-4">Return Recorded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                    {studentExitPasses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No student checkouts scanned today.</td>
                      </tr>
                    ) : (
                      studentExitPasses.map(pass => (
                        <tr key={pass.id} className="hover:bg-black/5 transition-colors">
                          <td className="px-6 py-3 font-mono font-bold text-zinc-500">{pass.id}</td>
                          <td className="px-6 py-3 font-bold text-zinc-800 dark:text-zinc-200">{pass.studentName}</td>
                          <td className="px-6 py-3">{pass.destination}</td>
                          <td className="px-6 py-3 font-semibold text-amber-600 dark:text-amber-300">{pass.exitTime}</td>
                          <td className="px-6 py-3 font-semibold text-emerald-600 dark:text-emerald-300">
                            {pass.entryTime ? pass.entryTime : <span className="text-zinc-400 font-normal">Still Out</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* TEACHER EXITS TABLE */}
              {logTypeTab === 'teachers' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Teacher ID</th>
                      <th className="px-6 py-4">Full Name</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Exit Recorded</th>
                      <th className="px-6 py-4">Return Recorded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                    {teacherExitLogs.map(log => (
                      <tr key={log.id} className="hover:bg-black/5 transition-colors">
                        <td className="px-6 py-3 font-mono font-bold text-zinc-500">{log.id}</td>
                        <td className="px-6 py-3 font-bold text-zinc-800 dark:text-zinc-200">{log.name}</td>
                        <td className="px-6 py-3">{log.subject}</td>
                        <td className="px-6 py-3 font-semibold text-amber-600">{log.exitTime}</td>
                        <td className="px-6 py-3 font-semibold text-emerald-600">
                          {log.entryTime ? log.entryTime : <span className="text-zinc-400 font-normal">Still Out</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* VISITOR LOGS TABLE */}
              {logTypeTab === 'visitors' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Ticket</th>
                      <th className="px-6 py-4">Visitor Name</th>
                      <th className="px-6 py-4">Purpose</th>
                      <th className="px-6 py-4">Whom to Meet</th>
                      <th className="px-6 py-4">Entry Scan</th>
                      <th className="px-6 py-4 text-right">Exit Scan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                    {visitors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No visitors registered.</td>
                      </tr>
                    ) : (
                      visitors.map(v => (
                        <tr key={v.id} className="hover:bg-black/5 transition-colors">
                          <td className="px-6 py-3 font-mono font-bold text-zinc-500">{v.id}</td>
                          <td className="px-6 py-3 font-bold text-zinc-800 dark:text-zinc-200">{v.name}</td>
                          <td className="px-6 py-3">{v.purpose}</td>
                          <td className="px-6 py-3">{v.whomToMeet}</td>
                          <td className="px-6 py-3 font-semibold text-emerald-600">{v.entryTime}</td>
                          <td className="px-6 py-3 text-right">
                            {v.exitTime ? (
                              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{v.exitTime}</span>
                            ) : (
                              <button
                                onClick={() => handleVisitorExit(v.id)}
                                className="text-[10px] font-bold px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                              >
                                Log Checkout
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

            </div>
          </GlassCard>
        </div>
      )}

      {/* 3. SIMULATED QR SCANNER TERMINAL */}
      {activeSubTab === 'scanner' && (
        <div className="space-y-6">
          <div className="max-w-md mx-auto">
            <GlassCard hoverEffect={false} className="p-6 space-y-6 border border-brand-primary/20">
              
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto">
                  <ScanLine className="w-7 h-7 animate-pulse" />
                </div>
                <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100 mt-3">QR Gate Scanner Simulator</h3>
                <p className="text-[11px] text-zinc-500 leading-normal mt-1">
                  Simulate scanning approved exit passes to log student checkouts and checkins
                </p>
              </div>

              {/* Status Banner */}
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 text-xs font-semibold rounded-xl text-center border ${
                    scanResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}
                >
                  {scanResult.message}
                </motion.div>
              )}

              {/* Pass Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Select Approved Pass QR</label>
                <select
                  value={selectedPassForScan}
                  onChange={(e) => setSelectedPassForScan(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="">-- Choose Approved Pass --</option>
                  {scanReadyPasses.map(p => (
                    <option key={p.id} value={p.qrCode}>
                      {p.id} - {p.studentName} ({p.exitTime ? 'Check-in return' : 'Check-out exit'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action grid */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => handleQRScan('exit')}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold shadow hover:bg-brand-primary/95 transition-all"
                >
                  Log Gate Exit
                </button>
                <button
                  onClick={() => handleQRScan('entry')}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-secondary text-white text-xs font-bold shadow hover:bg-brand-secondary/95 transition-all"
                >
                  Log Gate Return
                </button>
              </div>

              <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--card-border)] text-[10px] text-zinc-500 flex gap-2">
                <Info className="w-4 h-4 shrink-0 text-brand-primary" />
                <span className="leading-normal">
                  In production, this module coordinates with physical RFID barrier checkpoints, scanning camera mounts, or portable handheld devices.
                </span>
              </div>

            </GlassCard>
          </div>
        </div>
      )}

      {/* Visitor Modal */}
      <AnimatePresence>
        {showVisitorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowVisitorModal(false)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10 p-5 space-y-4">
              
              <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-3">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Register Campus Visitor</h3>
                <button onClick={() => setShowVisitorModal(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddVisitor} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Visitor Name *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.name}
                    onChange={(e) => setVisitorForm({ ...visitorForm, name: e.target.value })}
                    placeholder="e.g. David Miller"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Phone Phone</label>
                  <input
                    type="text"
                    value={visitorForm.phone}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    placeholder="Enter 10-digit number"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Purpose</label>
                  <select
                    value={visitorForm.purpose}
                    onChange={(e) => setVisitorForm({ ...visitorForm, purpose: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                  >
                    <option value="Parent Meeting">Parent Meeting</option>
                    <option value="Maintenance / Service">Maintenance / Service</option>
                    <option value="Vendor / Delivery">Vendor / Delivery</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Whom to Meet *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.whomToMeet}
                    onChange={(e) => setVisitorForm({ ...visitorForm, whomToMeet: e.target.value })}
                    placeholder="e.g. Mrs. Priya Patel"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-[var(--card-border)] pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowVisitorModal(false)}
                    className="px-4 py-2 rounded-lg bg-black/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                  >
                    Log Arrival
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
