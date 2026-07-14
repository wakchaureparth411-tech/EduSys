'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  FileText, Plus, CheckCircle, XCircle, Clock, 
  MapPin, User, Calendar, Shield, Printer, ScanLine, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GetPass } from '@/context/types';

export const GetPassView: React.FC = () => {
  const { 
    getPassRequests, createGetPass, updateGetPassStatus, 
    currentUser, scanGetPassQR, students 
  } = useAppState();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPrintPass, setShowPrintPass] = useState<GetPass | null>(null);

  // Form State
  const [formFields, setFormFields] = useState({
    studentId: currentUser?.role === 'Student' ? currentUser.id : 'ST1001',
    reason: '',
    date: '2026-07-14',
    time: '12:00 PM',
    destination: ''
  });

  // Fetch student name helper
  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.fullName || 'Aman Verma';
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.reason.trim() || !formFields.destination.trim()) {
      alert('Please fill out Reason and Destination');
      return;
    }

    const sName = getStudentName(formFields.studentId);
    const studentObj = students.find(s => s.id === formFields.studentId);

    createGetPass({
      studentId: formFields.studentId,
      studentName: sName,
      classVal: studentObj?.classVal || 'Class 10',
      division: studentObj?.division || 'A',
      reason: formFields.reason,
      date: formFields.date,
      time: formFields.time,
      destination: formFields.destination
    });

    setShowRequestModal(false);
    // Reset fields
    setFormFields(prev => ({
      ...prev,
      reason: '',
      destination: ''
    }));
  };

  // Simulated Scanning
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const handleSimulateScan = (qrCode: string, scanType: 'exit' | 'entry') => {
    const result = scanGetPassQR(qrCode, scanType);
    setScanResult(result);
    setTimeout(() => setScanResult(null), 3000);
  };

  const getBadgeClass = (status: string) => {
    if (status === 'Approved') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20';
    if (status === 'Rejected') return 'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20';
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20';
  };

  // Filter pass requests based on role
  const visiblePasses = getPassRequests.filter(pass => {
    if (currentUser?.role === 'Student') {
      return pass.studentId === currentUser.id;
    }
    return true; // Teachers, Admins, Security see all
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Exit Pass Management</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Track, request and authorize campus checkout passes</p>
        </div>

        {/* Generate Request button (visible for Students or Admins) */}
        {(currentUser?.role === 'Student' || currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-semibold hover:scale-[1.01] transition-all shadow-md shadow-brand-primary/10"
          >
            <Plus className="w-4 h-4" />
            <span>Request Get Pass</span>
          </button>
        )}
      </div>

      {/* Live Scan Notification */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-xl border text-xs font-semibold ${
            scanResult.success 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
              : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}
        >
          {scanResult.message}
        </motion.div>
      )}

      {/* Main List */}
      <div className="grid grid-cols-1 gap-4">
        {visiblePasses.length === 0 ? (
          <GlassCard hoverEffect={false} className="p-10 text-center text-xs text-zinc-500">
            No gate passes recorded.
          </GlassCard>
        ) : (
          visiblePasses.map(pass => (
            <GlassCard key={pass.id} hoverEffect={false} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--card-border)]">
              
              {/* Left Column: Details */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {pass.id}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">{pass.studentName}</span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{pass.classVal}-{pass.division}</span>
                  </div>
                  
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Reason: <strong className="text-zinc-800 dark:text-zinc-200">{pass.reason}</strong></p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-zinc-500 pt-1 font-semibold">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {pass.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pass.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {pass.destination}</span>
                  </div>

                  {(pass.exitTime || pass.entryTime) && (
                    <div className="text-[10px] text-brand-secondary pt-1 font-bold flex items-center gap-2">
                      <ScanLine className="w-3.5 h-3.5 animate-pulse" />
                      <span>Security scan: {pass.exitTime ? `Exited at ${pass.exitTime}` : ''} {pass.entryTime ? `| Returned at ${pass.entryTime}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Approvals Grid */}
              <div className="flex flex-wrap md:flex-nowrap items-center gap-6">
                
                {/* Visual Approver Bubbles */}
                <div className="flex gap-3 text-center border-r border-[var(--card-border)] pr-6">
                  {/* Teacher Approval */}
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Teacher</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClass(pass.approvals.teacher)}`}>
                      {pass.approvals.teacher === 'Approved' ? 'Approved' : pass.approvals.teacher === 'Rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>

                  {/* Admin Approval */}
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Admin</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClass(pass.approvals.admin)}`}>
                      {pass.approvals.admin === 'Approved' ? 'Approved' : pass.approvals.admin === 'Rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>

                  {/* Security Clearance */}
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Security</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClass(pass.approvals.security)}`}>
                      {pass.approvals.security === 'Approved' ? 'Passed' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Final status badge & actions */}
                <div className="flex flex-col gap-2 min-w-32 items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Pass Status:</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClass(pass.status)}`}>
                      {pass.status}
                    </span>
                  </div>

                  {/* Review Actions */}
                  {pass.status === 'Pending' && (
                    <div className="flex gap-1.5 mt-1">
                      {/* Teacher Actions */}
                      {currentUser?.role === 'Teacher' && pass.approvals.teacher === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateGetPassStatus(pass.id, 'teacher', 'Approved')}
                            className="text-[9px] font-bold px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateGetPassStatus(pass.id, 'teacher', 'Rejected')}
                            className="text-[9px] font-bold px-2.5 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Admin Actions */}
                      {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && pass.approvals.admin === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateGetPassStatus(pass.id, 'admin', 'Approved')}
                            className="text-[9px] font-bold px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateGetPassStatus(pass.id, 'admin', 'Rejected')}
                            className="text-[9px] font-bold px-2.5 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Print and scan triggers */}
                  <div className="flex gap-2 items-center mt-1">
                    {pass.status === 'Approved' && (
                      <button
                        onClick={() => setShowPrintPass(pass)}
                        className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 font-bold hover:underline"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Pass
                      </button>
                    )}

                    {/* Simulation buttons for sandbox scanning */}
                    {pass.status === 'Approved' && (currentUser?.role === 'Security' || currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                      <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
                        {!pass.exitTime && (
                          <button
                            onClick={() => handleSimulateScan(pass.qrCode, 'exit')}
                            className="text-[8px] font-bold px-1.5 py-0.5 bg-brand-primary text-white rounded hover:bg-brand-primary/95 transition-colors"
                          >
                            Scan Exit
                          </button>
                        )}
                        {pass.exitTime && !pass.entryTime && (
                          <button
                            onClick={() => handleSimulateScan(pass.qrCode, 'entry')}
                            className="text-[8px] font-bold px-1.5 py-0.5 bg-brand-secondary text-white rounded hover:bg-brand-secondary/95 transition-colors"
                          >
                            Scan Entry
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </GlassCard>
          ))
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowRequestModal(false)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10">
              
              <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Request Campus Exit Pass</h3>
                <button onClick={() => setShowRequestModal(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                
                {/* Student Select dropdown if not logged in as student */}
                {currentUser?.role !== 'Student' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">For Student</label>
                    <select
                      value={formFields.studentId}
                      onChange={(e) => setFormFields({ ...formFields, studentId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.fullName} ({s.classVal}-{s.division})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Reason */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Reason for Exit *</label>
                  <textarea
                    value={formFields.reason}
                    onChange={(e) => setFormFields({ ...formFields, reason: e.target.value })}
                    required
                    rows={3}
                    placeholder="e.g. High fever, orthodontist appointment, urgent family emergency..."
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200 resize-none"
                  />
                </div>

                {/* Destination */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Destination *</label>
                  <input
                    type="text"
                    value={formFields.destination}
                    onChange={(e) => setFormFields({ ...formFields, destination: e.target.value })}
                    required
                    placeholder="e.g. Home, Hospital, Dental Clinic"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Exit Date</label>
                    <input
                      type="date"
                      value={formFields.date}
                      onChange={(e) => setFormFields({ ...formFields, date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Exit Time</label>
                    <input
                      type="text"
                      value={formFields.time}
                      onChange={(e) => setFormFields({ ...formFields, time: e.target.value })}
                      placeholder="e.g. 10:30 AM"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-[var(--card-border)] pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                  >
                    Submit Request
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Pass Dialog */}
      <AnimatePresence>
        {showPrintPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowPrintPass(null)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10 p-6 space-y-6">
              
              <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Printable Campus Gate Pass</h4>
                <button onClick={() => setShowPrintPass(null)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
              </div>

              {/* Printable Ticket style */}
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-4 rounded-xl space-y-4">
                <div className="text-center">
                  <h3 className="font-extrabold text-sm tracking-wide text-zinc-800 dark:text-zinc-100">EDU-SYS SMART CAMPUS</h3>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">APPROVED EXIT PERMIT</span>
                </div>

                <div className="text-xs space-y-2 border-t border-b border-zinc-200 dark:border-zinc-800 py-3 font-semibold text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between"><span>Pass ID:</span><span className="text-zinc-800 dark:text-zinc-200 font-mono">{showPrintPass.id}</span></div>
                  <div className="flex justify-between"><span>Student:</span><span className="text-zinc-800 dark:text-zinc-200">{showPrintPass.studentName}</span></div>
                  <div className="flex justify-between"><span>Grade:</span><span className="text-zinc-800 dark:text-zinc-200">{showPrintPass.classVal} - {showPrintPass.division}</span></div>
                  <div className="flex justify-between"><span>Reason:</span><span className="text-zinc-800 dark:text-zinc-200 truncate max-w-44">{showPrintPass.reason}</span></div>
                  <div className="flex justify-between"><span>Destination:</span><span className="text-zinc-800 dark:text-zinc-200">{showPrintPass.destination}</span></div>
                  <div className="flex justify-between"><span>Valid on:</span><span className="text-zinc-800 dark:text-zinc-200">{showPrintPass.date} ({showPrintPass.time})</span></div>
                </div>

                {/* SVG mock QR Code */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-zinc-200 flex items-center justify-center relative group">
                    {/* Mock SVG QR Code */}
                    <svg className="w-28 h-28 text-zinc-950" viewBox="0 0 100 100">
                      {/* Quiet Zone */}
                      <rect width="100" height="100" fill="white" />
                      {/* Top-Left Finder Pattern */}
                      <rect x="5" y="5" width="25" height="25" fill="black" />
                      <rect x="9" y="9" width="17" height="17" fill="white" />
                      <rect x="13" y="13" width="9" height="9" fill="black" />
                      {/* Top-Right Finder Pattern */}
                      <rect x="70" y="5" width="25" height="25" fill="black" />
                      <rect x="74" y="9" width="17" height="17" fill="white" />
                      <rect x="78" y="13" width="9" height="9" fill="black" />
                      {/* Bottom-Left Finder Pattern */}
                      <rect x="5" y="70" width="25" height="25" fill="black" />
                      <rect x="9" y="74" width="17" height="17" fill="white" />
                      <rect x="13" y="78" width="9" height="9" fill="black" />
                      {/* Random QR pixels */}
                      <rect x="35" y="10" width="5" height="10" fill="black" />
                      <rect x="45" y="5" width="10" height="5" fill="black" />
                      <rect x="40" y="20" width="5" height="15" fill="black" />
                      <rect x="60" y="15" width="5" height="5" fill="black" />
                      <rect x="50" y="25" width="15" height="5" fill="black" />
                      <rect x="10" y="35" width="10" height="5" fill="black" />
                      <rect x="25" y="45" width="5" height="10" fill="black" />
                      <rect x="5" y="55" width="15" height="5" fill="black" />
                      <rect x="35" y="35" width="10" height="10" fill="black" />
                      <rect x="50" y="40" width="5" height="15" fill="black" />
                      <rect x="60" y="45" width="20" height="5" fill="black" />
                      <rect x="40" y="55" width="15" height="10" fill="black" />
                      <rect x="70" y="35" width="5" height="15" fill="black" />
                      <rect x="80" y="40" width="15" height="5" fill="black" />
                      <rect x="75" y="50" width="5" height="10" fill="black" />
                      <rect x="90" y="55" width="5" height="10" fill="black" />
                      <rect x="35" y="70" width="10" height="5" fill="black" />
                      <rect x="40" y="80" width="5" height="15" fill="black" />
                      <rect x="50" y="75" width="15" height="5" fill="black" />
                      <rect x="60" y="85" width="5" height="5" fill="black" />
                      <rect x="55" y="90" width="10" height="5" fill="black" />
                      <rect x="75" y="75" width="15" height="15" fill="black" opacity="0.8" />
                    </svg>
                  </div>
                  <span className="text-[9px] text-zinc-400 font-mono mt-1 font-bold">{showPrintPass.qrCode}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl shadow hover:bg-brand-primary/95 transition-all"
                >
                  Print Ticket
                </button>
                <button
                  onClick={() => setShowPrintPass(null)}
                  className="flex-1 py-2 bg-black/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-black/10 transition-all"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
