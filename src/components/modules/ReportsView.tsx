'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  FileSpreadsheet, FileText, Printer, BarChart3, 
  Calendar, Users, UserCheck, Shield, FileCheck 
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { 
    students, teachers, getPassRequests, attendanceRecords, activityLogs 
  } = useAppState();

  const [reportType, setReportType] = useState('attendance');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-14');

  const [reportData, setReportData] = useState<any[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate Report logic based on type and filters
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setHasGenerated(false);

    setTimeout(() => {
      let data: any[] = [];

      if (reportType === 'attendance') {
        // Collect class attendance logs within range
        data = attendanceRecords.filter(r => 
          r.classVal === selectedClass && 
          r.date >= fromDate && 
          r.date <= toDate
        ).map(record => {
          const vals = Object.values(record.records);
          const total = vals.length;
          const present = vals.filter(v => v === 'Present' || v === 'Late').length;
          const pct = total > 0 ? `${Math.round((present / total) * 100)}%` : '95%';
          return {
            date: record.date,
            class: `${record.classVal}-${record.division}`,
            totalStudents: total,
            presentCount: present,
            rate: pct
          };
        });
      } else if (reportType === 'student') {
        // Filter student roster
        data = students.filter(s => selectedClass === 'All' || s.classVal === selectedClass).map(s => ({
          id: s.id,
          name: s.fullName,
          class: `${s.classVal}-${s.division}`,
          phone: s.mobile,
          parent: s.parentPhone,
          status: s.status
        }));
      } else if (reportType === 'teacher') {
        // Teacher directory report
        data = teachers.map(t => ({
          id: t.id,
          name: t.fullName,
          subject: t.subject,
          phone: t.phone,
          salary: t.salary,
          status: t.status
        }));
      } else if (reportType === 'security') {
        // Security gate scanner logs
        data = getPassRequests.filter(p => p.exitTime && p.date >= fromDate && p.date <= toDate).map(p => ({
          id: p.id,
          student: p.studentName,
          class: `${p.classVal}-${p.division}`,
          destination: p.destination,
          date: p.date,
          exit: p.exitTime,
          entry: p.entryTime || 'Still Out'
        }));
      } else if (reportType === 'getpass') {
        // Approved/Rejected Get Passes
        data = getPassRequests.filter(p => p.date >= fromDate && p.date <= toDate).map(p => ({
          id: p.id,
          student: p.studentName,
          class: `${p.classVal}-${p.division}`,
          reason: p.reason,
          date: p.date,
          status: p.status
        }));
      }

      setReportData(data);
      setIsGenerating(false);
      setHasGenerated(true);
    }, 800);
  };

  const triggerExport = (type: 'Excel' | 'PDF') => {
    alert(`Mock export: Generated ${reportType}_report_${Date.now()}.${type === 'Excel' ? 'xlsx' : 'pdf'}`);
  };

  const getReportTitle = () => {
    const map: { [key: string]: string } = {
      attendance: 'Classroom Attendance Report',
      student: 'Student Registration Report',
      teacher: 'Faculty & Teacher Roster Report',
      security: 'Security Gate Checkout Logs',
      getpass: 'Get Pass Authorization Logs'
    };
    return map[reportType] || 'System Report';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Reports Engine</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Generate printable PDF audits, Excel rosters and gate logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Configuration Panel */}
        <GlassCard hoverEffect={false} className="col-span-1 p-5 h-fit">
          <form onSubmit={handleGenerate} className="space-y-5">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Configure Parameters</h3>

            {/* Report Type */}
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => { setReportType(e.target.value); setHasGenerated(false); }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="attendance">Attendance Report</option>
                <option value="student">Student Registry Report</option>
                <option value="teacher">Teacher Registry Report</option>
                <option value="security">Security Gate Activity</option>
                <option value="getpass">Get Pass Clearance Logs</option>
              </select>
            </div>

            {/* Filter by class (for student/attendance reports) */}
            {(reportType === 'attendance' || reportType === 'student') && (
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Class / Grade</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  {reportType === 'student' && <option value="All">All Classes</option>}
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                </select>
              </div>
            )}

            {/* Date Range (except for teacher directory) */}
            {reportType !== 'teacher' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-xl text-xs shadow hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {isGenerating ? 'Querying Data...' : 'Generate Report'}
            </button>
          </form>
        </GlassCard>

        {/* Results / Preview Panel */}
        <div className="lg:col-span-2 space-y-4">
          
          {hasGenerated && (
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{getReportTitle()}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerExport('Excel')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 border border-[var(--card-border)] text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Excel
                </button>
                <button
                  onClick={() => triggerExport('PDF')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 border border-[var(--card-border)] text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
                >
                  <FileText className="w-3.5 h-3.5 text-red-500" /> PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 border border-[var(--card-border)] text-zinc-500 hover:text-zinc-800"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <GlassCard hoverEffect={false} className="p-0 overflow-hidden min-h-[300px] flex flex-col justify-between">
            
            <div className="overflow-x-auto flex-1">
              {!hasGenerated ? (
                <div className="flex flex-col items-center justify-center text-center p-12 h-64 text-zinc-400">
                  <BarChart3 className="w-10 h-10 mb-3 text-zinc-300" />
                  <p className="text-xs font-semibold">Ready to Query</p>
                  <p className="text-[10px] text-zinc-500 mt-1 max-w-64">Select parameters on the left and click "Generate Report" to preview records</p>
                </div>
              ) : reportData.length === 0 ? (
                <div className="text-center p-12 text-zinc-500 text-xs font-semibold">No records found matching specified filters.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  
                  {/* ATTENDANCE REPORT PREVIEW */}
                  {reportType === 'attendance' && (
                    <>
                      <thead className="bg-black/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Class Roster</th>
                          <th className="px-6 py-3">Roster Total</th>
                          <th className="px-6 py-3">Present Count</th>
                          <th className="px-6 py-3">Rate Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                        {reportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-black/5 transition-colors">
                            <td className="px-6 py-2.5 font-semibold">{row.date}</td>
                            <td className="px-6 py-2.5">{row.class}</td>
                            <td className="px-6 py-2.5">{row.totalStudents}</td>
                            <td className="px-6 py-2.5 text-emerald-600">{row.presentCount}</td>
                            <td className="px-6 py-2.5 font-bold">{row.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* STUDENT REPORT PREVIEW */}
                  {reportType === 'student' && (
                    <>
                      <thead className="bg-black/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Student ID</th>
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">Class</th>
                          <th className="px-6 py-3">Phone</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                        {reportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-black/5 transition-colors">
                            <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400">{row.id}</td>
                            <td className="px-6 py-2.5 font-bold">{row.name}</td>
                            <td className="px-6 py-2.5">{row.class}</td>
                            <td className="px-6 py-2.5">{row.phone}</td>
                            <td className="px-6 py-2.5 font-bold">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* TEACHER REPORT PREVIEW */}
                  {reportType === 'teacher' && (
                    <>
                      <thead className="bg-black/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Teacher ID</th>
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">Subject</th>
                          <th className="px-6 py-3">Salary Package</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                        {reportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-black/5 transition-colors">
                            <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400">{row.id}</td>
                            <td className="px-6 py-2.5 font-bold">{row.name}</td>
                            <td className="px-6 py-2.5">{row.subject}</td>
                            <td className="px-6 py-2.5 font-bold text-zinc-700 dark:text-zinc-300">{row.salary}</td>
                            <td className="px-6 py-2.5 font-semibold text-emerald-600">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* SECURITY REPORT PREVIEW */}
                  {reportType === 'security' && (
                    <>
                      <thead className="bg-black/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Pass ID</th>
                          <th className="px-6 py-3">Student</th>
                          <th className="px-6 py-3">Destination</th>
                          <th className="px-6 py-3">Exit Time</th>
                          <th className="px-6 py-3">Return Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                        {reportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-black/5 transition-colors">
                            <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400">{row.id}</td>
                            <td className="px-6 py-2.5 font-bold">{row.student}</td>
                            <td className="px-6 py-2.5">{row.destination}</td>
                            <td className="px-6 py-2.5 font-bold text-amber-600">{row.exit}</td>
                            <td className="px-6 py-2.5 font-bold text-emerald-600">{row.entry}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* GET PASS REPORT PREVIEW */}
                  {reportType === 'getpass' && (
                    <>
                      <thead className="bg-black/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Pass ID</th>
                          <th className="px-6 py-3">Student</th>
                          <th className="px-6 py-3">Class</th>
                          <th className="px-6 py-3">Reason</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                        {reportData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-black/5 transition-colors">
                            <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400">{row.id}</td>
                            <td className="px-6 py-2.5 font-bold">{row.student}</td>
                            <td className="px-6 py-2.5">{row.class}</td>
                            <td className="px-6 py-2.5">{row.reason}</td>
                            <td className="px-6 py-2.5 font-bold text-indigo-600">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                </table>
              )}
            </div>

            {hasGenerated && (
              <div className="bg-black/5 dark:bg-white/5 border-t border-[var(--card-border)] px-6 py-3 text-[10px] text-zinc-500 font-medium flex justify-between">
                <span>Queried: {reportData.length} records found</span>
                <span>Config: System Roster v1.0</span>
              </div>
            )}
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
