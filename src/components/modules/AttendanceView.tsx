'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Calendar, Check, X, Clock, HelpCircle, Save, 
  History, BarChart3, FileSpreadsheet, FileText, Printer 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { AttendanceStatus } from '@/context/types';

export const AttendanceView: React.FC = () => {
  const { 
    students, attendanceRecords, saveAttendance, currentUser 
  } = useAppState();

  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [selectedDate, setSelectedDate] = useState('2026-07-14');
  
  // Current editing records map: { [studentId]: status }
  const [markedRecords, setMarkedRecords] = useState<{ [studentId: string]: AttendanceStatus }>({});

  // 1. Fetch students belonging to the selected Class and Division
  const classStudents = students.filter(s => 
    s.classVal === selectedClass && s.division === selectedDivision
  );

  // Load existing records if any
  useEffect(() => {
    const existing = attendanceRecords.find(r => 
      r.date === selectedDate && 
      r.classVal === selectedClass && 
      r.division === selectedDivision
    );

    if (existing) {
      setMarkedRecords(existing.records);
    } else {
      // Default all to Present
      const defaults: { [studentId: string]: AttendanceStatus } = {};
      classStudents.forEach(s => {
        defaults[s.id] = 'Present';
      });
      setMarkedRecords(defaults);
    }
  }, [selectedClass, selectedDivision, selectedDate, students]);

  // Handle individual status change
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setMarkedRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Mass action: mark all present or absent
  const markAll = (status: AttendanceStatus) => {
    const updated = { ...markedRecords };
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setMarkedRecords(updated);
  };

  // Save to Global Context
  const handleSave = () => {
    saveAttendance(selectedDate, selectedClass, selectedDivision, markedRecords);
    alert('Attendance saved successfully!');
  };

  // Calculations
  const totalStudents = classStudents.length;
  const presentCount = Object.values(markedRecords).filter(v => v === 'Present').length;
  const absentCount = Object.values(markedRecords).filter(v => v === 'Absent').length;
  const lateCount = Object.values(markedRecords).filter(v => v === 'Late').length;
  const leaveCount = Object.values(markedRecords).filter(v => v === 'Leave').length;

  const presentPercentage = totalStudents > 0 
    ? `${Math.round(((presentCount + lateCount) / totalStudents) * 100)}%` 
    : '0%';

  // Attendance History Chart for the selected Class
  const classHistory = attendanceRecords
    .filter(r => r.classVal === selectedClass && r.division === selectedDivision)
    .slice(0, 6)
    .reverse()
    .map(record => {
      const vals = Object.values(record.records);
      const tot = vals.length;
      return {
        date: new Date(record.date).toLocaleDateString([], { day: '2-digit', month: 'short' }),
        Present: vals.filter(v => v === 'Present').length,
        Absent: vals.filter(v => v === 'Absent').length,
        Late: vals.filter(v => v === 'Late').length,
        Leave: vals.filter(v => v === 'Leave').length
      };
    });

  // Mock Exports
  const triggerExport = (type: 'Excel' | 'PDF') => {
    alert(`Mock download: Attendance_Sheet_${selectedClass}_${selectedDivision}_${selectedDate}.${type === 'Excel' ? 'xlsx' : 'pdf'} generated!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Attendance Manager</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Mark, edit and review classroom registries</p>
        </div>

        {/* Exports */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerExport('Excel')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-black/10 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => triggerExport('PDF')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-black/10 transition-colors"
          >
            <FileText className="w-4 h-4 text-red-500" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-600 hover:text-zinc-800 transition-colors"
            title="Print Attendance"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Class and Date Selectors */}
      <GlassCard hoverEffect={false} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Class / Grade</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          {/* Mass Actions */}
          <div className="flex flex-col justify-end gap-2">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider hidden md:block">&nbsp;</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => markAll('Present')}
                className="py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => markAll('Absent')}
                className="py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-all"
              >
                Mark All Absent
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Roster Grid and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Roster checklist */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)]">
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                Roster: {selectedClass} - {selectedDivision}
              </h4>
              <span className="text-[10px] text-zinc-500 font-semibold">{totalStudents} registered students</span>
            </div>

            <div className="divide-y divide-[var(--card-border)]">
              {classStudents.length === 0 ? (
                <div className="p-10 text-center text-xs text-zinc-500">No students registered in this class.</div>
              ) : (
                classStudents.map((student, idx) => {
                  const currentStatus = markedRecords[student.id] || 'Present';
                  return (
                    <div key={student.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-black/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center text-xs text-zinc-400 font-bold">{idx + 1}</span>
                        <img src={student.photo} alt={student.fullName} className="w-8 h-8 rounded-full object-cover border border-[var(--card-border)]" />
                        <div>
                          <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{student.fullName}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">Roll: {student.rollNumber} | ID: {student.id}</p>
                          
                          {/* Past Attendance History */}
                          {(() => {
                            const studentHistory = attendanceRecords
                              .filter(r => r.classVal === selectedClass && r.division === selectedDivision && r.date !== selectedDate)
                              .sort((a, b) => b.date.localeCompare(a.date));
                            
                            if (studentHistory.length === 0) return null;

                            return (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                <span className="text-[9px] text-zinc-400 font-medium">History:</span>
                                <div className="flex flex-wrap gap-1">
                                  {studentHistory.slice(0, 5).map(h => {
                                    const status = h.records[student.id];
                                    if (!status) return null;
                                    const colorMap = {
                                      Present: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                                      Absent: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
                                      Late: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                                      Leave: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                                    };
                                    const labelMap = { Present: 'P', Absent: 'A', Late: 'L', Leave: 'Lv' };
                                    const parts = h.date.split('-');
                                    const dateShort = parts.length === 3 ? `${parts[2]}/${parts[1]}` : h.date;

                                    return (
                                      <span 
                                        key={h.date} 
                                        className={`text-[8px] font-bold px-1 py-0.5 rounded border ${colorMap[status]}`}
                                        title={`${h.date}: ${status}`}
                                      >
                                        {dateShort}:{labelMap[status]}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Status selectors button-group */}
                      <div className="flex gap-1.5 self-start sm:self-center">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--card-border)] text-zinc-500 dark:text-zinc-400 hover:bg-black/10'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> Present
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            currentStatus === 'Absent'
                              ? 'bg-red-500 text-white border-red-500 shadow-sm'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--card-border)] text-zinc-500 dark:text-zinc-400 hover:bg-black/10'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" /> Absent
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            currentStatus === 'Late'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--card-border)] text-zinc-500 dark:text-zinc-400 hover:bg-black/10'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" /> Late
                        </button>

                        {/* Leave */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Leave')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            currentStatus === 'Leave'
                              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--card-border)] text-zinc-500 dark:text-zinc-400 hover:bg-black/10'
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Leave
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

            {/* Save bar */}
            {classStudents.length > 0 && (
              <div className="p-4 bg-black/5 dark:bg-white/5 border-t border-[var(--card-border)] flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                >
                  <Save className="w-4 h-4" /> Save Attendance
                </button>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Stats card and historical chart */}
        <div className="space-y-6">
          {/* Quick Metrics */}
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Session Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl">
                <span className="text-xl font-extrabold text-zinc-800 dark:text-zinc-100">{presentPercentage}</span>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5">Presence Rate</p>
              </div>
              <div className="p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl">
                <span className="text-xl font-extrabold text-zinc-800 dark:text-zinc-100">{totalStudents}</span>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5">Total Roster</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
                <span className="text-zinc-800 dark:text-zinc-200">{presentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Absent</span>
                <span className="text-zinc-800 dark:text-zinc-200">{absentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Late</span>
                <span className="text-zinc-800 dark:text-zinc-200">{lateCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> On Leave</span>
                <span className="text-zinc-800 dark:text-zinc-200">{leaveCount}</span>
              </div>
            </div>
          </GlassCard>

          {/* Historical Trend Chart */}
          <GlassCard hoverEffect={false} className="p-5 flex flex-col justify-between h-[280px]">
            <div>
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Historical Records</h4>
              <p className="text-[10px] text-zinc-500">Student count over past dates</p>
            </div>
            
            <div className="h-44 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classHistory.length > 0 ? classHistory : [
                  { date: '11 Jul', Present: 6, Absent: 1, Late: 0, Leave: 0 },
                  { date: '12 Jul', Present: 5, Absent: 1, Late: 1, Leave: 0 },
                  { date: '13 Jul', Present: 7, Absent: 0, Late: 0, Leave: 0 },
                  { date: '14 Jul', Present: presentCount, Absent: absentCount, Late: lateCount, Leave: leaveCount }
                ]} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" style={{ fontSize: '9px', fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis style={{ fontSize: '9px', fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '9px' }} />
                  <Bar dataKey="Present" stackId="a" fill="#10B981" />
                  <Bar dataKey="Absent" stackId="a" fill="#EF4444" />
                  <Bar dataKey="Late" stackId="a" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
