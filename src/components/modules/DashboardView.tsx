'use client';

import React from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Users, UserCheck, Calendar, FileText, 
  Shield, UserPlus, UserPlus2, CalendarDays, 
  FileSpreadsheet, ShieldAlert, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { motion } from 'framer-motion';

export const DashboardView: React.FC = () => {
  const { 
    students, teachers, guards, admins, 
    getPassRequests, attendanceRecords, activityLogs, 
    setActiveTab, updateGetPassStatus, currentUser
  } = useAppState();

  // 1. Metric Calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalAdmins = admins.length;
  const guardsOnDuty = guards.filter(g => g.status === 'On Duty').length;
  const pendingPasses = getPassRequests.filter(p => p.status === 'Pending').length;

  // Calculate today's attendance stats
  const todayRecord = attendanceRecords.find(r => r.date === '2026-07-14');
  let attendancePct = '0.0%';
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;

  if (todayRecord) {
    const totalRecs = Object.keys(todayRecord.records).length;
    presentCount = Object.values(todayRecord.records).filter(v => v === 'Present').length;
    absentCount = Object.values(todayRecord.records).filter(v => v === 'Absent').length;
    lateCount = Object.values(todayRecord.records).filter(v => v === 'Late').length;
    leaveCount = Object.values(todayRecord.records).filter(v => v === 'Leave').length;
    
    if (totalRecs > 0) {
      attendancePct = `${Math.round(((presentCount + lateCount) / totalRecs) * 1000) / 10}%`;
    }
  }

  // 2. Attendance Charts Data
  const pieData = [
    { name: 'Present', value: presentCount, color: '#10B981' },
    { name: 'Absent', value: absentCount, color: '#EF4444' },
    { name: 'Late', value: lateCount, color: '#F59E0B' },
    { name: 'Leave', value: leaveCount, color: '#3B82F6' },
  ].filter(item => item.value > 0); // only show positive slices

  // Default fallback if no records marked yet
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'Present', value: 95, color: '#10B981' },
    { name: 'Absent', value: 3, color: '#EF4444' },
    { name: 'Late', value: 2, color: '#F59E0B' }
  ];

  // Past 5 days attendance trend
  const historicalTrendData = [...attendanceRecords]
    .slice(0, 5)
    .reverse()
    .map(record => {
      const recordsArr = Object.values(record.records);
      const total = recordsArr.length;
      const pres = recordsArr.filter(v => v === 'Present' || v === 'Late').length;
      const pct = total > 0 ? Math.round((pres / total) * 100) : 95;
      return {
        date: new Date(record.date).toLocaleDateString([], { day: '2-digit', month: 'short' }),
        Rate: pct
      };
    });

  // Fallback trend if empty
  const displayTrendData = historicalTrendData.length > 0 ? historicalTrendData : [
    { date: '10 Jul', Rate: 92 },
    { date: '11 Jul', Rate: 96 },
    { date: '12 Jul', Rate: 94 },
    { date: '13 Jul', Rate: 97 },
    { date: '14 Jul', Rate: 95 }
  ];

  // Quick Action Handler
  const handleQuickAction = (tab: string) => {
    setActiveTab(tab);
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'Approved') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
    if (status === 'Rejected') return 'bg-red-500/10 text-red-600 dark:text-red-300';
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Overview Dashboard</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time smart campus summary and parameters</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Campus Status</p>
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live & Secure
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <GlassCard hoverEffect className="p-4 flex flex-col justify-between h-28" glowColor="rgba(79, 70, 229, 0.15)">
          <div className="flex items-center justify-between text-zinc-400">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="text-[9px] flex items-center font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">
              <ArrowUpRight className="w-3 h-3" /> +2.4%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2">{totalStudents}</h3>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Students</p>
          </div>
        </GlassCard>

        {/* Total Teachers */}
        <GlassCard hoverEffect className="p-4 flex flex-col justify-between h-28" glowColor="rgba(124, 58, 237, 0.15)">
          <div className="flex items-center justify-between text-zinc-400">
            <UserCheck className="w-5 h-5 text-purple-500" />
            <span className="text-[9px] flex items-center font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">
              <ArrowUpRight className="w-3 h-3" /> +1.2%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2">{totalTeachers}</h3>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Teachers</p>
          </div>
        </GlassCard>

        {/* Attendance Today */}
        <GlassCard hoverEffect className="p-4 flex flex-col justify-between h-28" glowColor="rgba(16, 185, 129, 0.15)">
          <div className="flex items-center justify-between text-zinc-400">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <span className="text-[9px] flex items-center font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">
              <ArrowUpRight className="w-3 h-3" /> +0.5%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2">{attendancePct}</h3>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Attendance Today</p>
          </div>
        </GlassCard>

        {/* Get Pass Requests */}
        <GlassCard hoverEffect className="p-4 flex flex-col justify-between h-28" glowColor="rgba(245, 158, 11, 0.15)">
          <div className="flex items-center justify-between text-zinc-400">
            <FileText className="w-5 h-5 text-amber-500" />
            {pendingPasses > 0 ? (
              <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full animate-pulse">
                {pendingPasses} Pending
              </span>
            ) : (
              <span className="text-[9px] font-bold text-zinc-500 bg-zinc-500/10 px-1.5 py-0.5 rounded-full">
                0 Pending
              </span>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2">{getPassRequests.length}</h3>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Exit Pass Requests</p>
          </div>
        </GlassCard>

        {/* Guards On Duty */}
        <GlassCard hoverEffect className="p-4 flex flex-col justify-between h-28" glowColor="rgba(59, 130, 246, 0.15)">
          <div className="flex items-center justify-between text-zinc-400">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 rounded">
              Active
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2">{guardsOnDuty}</h3>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Security Guards</p>
          </div>
        </GlassCard>

        {/* Super Admins */}
        <GlassCard hoverEffect className="p-4 flex flex-col justify-between h-28" glowColor="rgba(244, 63, 94, 0.15)">
          <div className="flex items-center justify-between text-zinc-400">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-1.5 rounded">
              System
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight mt-2">{totalAdmins}</h3>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">Super Admins</p>
          </div>
        </GlassCard>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Breakdown Pie Chart */}
        <GlassCard hoverEffect className="col-span-1 flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Today's Attendance Overview</h4>
            <p className="text-[10px] text-zinc-500">Breakdown of student attendance records</p>
          </div>
          
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {displayPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#333',
                    border: 'none',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-zinc-800 dark:text-zinc-100">{attendancePct}</span>
              <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">Present</span>
            </div>
          </div>

          <div className="flex justify-around text-center text-xs mt-2 border-t border-[var(--card-border)] pt-3">
            <div>
              <span className="w-2.5 h-2.5 rounded-full inline-block bg-emerald-500 mr-1.5" />
              <span className="text-zinc-500 font-medium">Present: <strong className="text-zinc-800 dark:text-zinc-200">{presentCount}</strong></span>
            </div>
            <div>
              <span className="w-2.5 h-2.5 rounded-full inline-block bg-red-500 mr-1.5" />
              <span className="text-zinc-500 font-medium">Absent: <strong className="text-zinc-800 dark:text-zinc-200">{absentCount}</strong></span>
            </div>
            <div>
              <span className="w-2.5 h-2.5 rounded-full inline-block bg-blue-500 mr-1.5" />
              <span className="text-zinc-500 font-medium">Leave: <strong className="text-zinc-800 dark:text-zinc-200">{leaveCount}</strong></span>
            </div>
          </div>
        </GlassCard>

        {/* Monthly Attendance Graph */}
        <GlassCard hoverEffect className="lg:col-span-2 flex flex-col justify-between min-h-[300px]" glowColor="rgba(79, 70, 229, 0.05)">
          <div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Attendance Rate Trend</h4>
            <p className="text-[10px] text-zinc-500">Historical daily presence rate percentage (%)</p>
          </div>

          <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: '10px', fill: '#94a3b8' }} />
                <YAxis domain={[80, 100]} tickLine={false} axisLine={false} style={{ fontSize: '10px', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    background: 'rgba(255,255,255,0.95)',
                    color: '#1e293b',
                    border: 'none',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="Rate" stroke="rgb(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions Grid */}
      <GlassCard hoverEffect={false} className="p-5">
        <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-4">Quick Management Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <button
            onClick={() => handleQuickAction('students')}
            className="flex flex-col items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Add Student</span>
          </button>

          <button
            onClick={() => handleQuickAction('teachers')}
            className="flex flex-col items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl hover:bg-brand-secondary/5 hover:border-brand-secondary/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <UserPlus2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Add Teacher</span>
          </button>

          <button
            onClick={() => handleQuickAction('attendance')}
            className="flex flex-col items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Mark Attendance</span>
          </button>

          <button
            onClick={() => handleQuickAction('reports')}
            className="flex flex-col items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl hover:bg-blue-500/5 hover:border-blue-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Generate Report</span>
          </button>

          <button
            onClick={() => handleQuickAction('getpass')}
            className="flex flex-col items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl hover:bg-amber-500/5 hover:border-amber-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Create Get Pass</span>
          </button>

          <button
            onClick={() => handleQuickAction('security')}
            className="flex flex-col items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl hover:bg-rose-500/5 hover:border-rose-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Security Gate</span>
          </button>
        </div>
      </GlassCard>

      {/* Get Pass Tracker & Activity Log Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Get Pass Requests */}
        <GlassCard hoverEffect={false} className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Recent Get Pass Requests</h4>
              <p className="text-[10px] text-zinc-500">Student exit requests requiring approvals</p>
            </div>
            <button onClick={() => setActiveTab('getpass')} className="text-[10px] text-brand-primary font-semibold hover:underline">View All</button>
          </div>

          <div className="space-y-3.5 flex-1 max-h-72 overflow-y-auto pr-1">
            {getPassRequests.slice(0, 4).map(pass => (
              <div key={pass.id} className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                    {pass.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{pass.studentName}</span>
                      <span className="text-[9px] text-zinc-400 font-semibold">{pass.classVal}-{pass.division}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> {pass.time} | Destination: {pass.destination}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(pass.status)}`}>
                    {pass.status}
                  </span>
                  
                  {/* Inline Approval triggers for Teacher/Admin */}
                  {pass.status === 'Pending' && (currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' || currentUser?.role === 'Teacher') && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateGetPassStatus(pass.id, currentUser.role === 'Teacher' ? 'teacher' : 'admin', 'Approved')}
                        className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-1 rounded-lg shadow hover:bg-emerald-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateGetPassStatus(pass.id, currentUser.role === 'Teacher' ? 'teacher' : 'admin', 'Rejected')}
                        className="text-[9px] bg-red-500 text-white font-bold px-2 py-1 rounded-lg shadow hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Activity Logs */}
        <GlassCard hoverEffect={false} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Recent Campus Activities</h4>
              <p className="text-[10px] text-zinc-500">Live feed of security actions and edits</p>
            </div>
            {currentUser?.role === 'Super Admin' && (
              <button onClick={() => setActiveTab('superadmin')} className="text-[10px] text-brand-primary font-semibold hover:underline">View System Logs</button>
            )}
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {activityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex gap-3 text-xs leading-normal">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-primary border-2 border-white dark:border-[#090d16]" />
                  <div className="flex-1 w-0.5 bg-zinc-200 dark:bg-zinc-800 mt-1" />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{log.action}</span>
                    <span className="text-[9px] text-zinc-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
};
