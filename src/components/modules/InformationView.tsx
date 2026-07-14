'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  User, Mail, Phone, Shield, ShieldAlert, 
  MapPin, Calendar, Award, Briefcase, Eye, EyeOff, Edit2, ArrowLeft, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InformationView: React.FC = () => {
  const { 
    students, updateStudent, 
    teachers, updateTeacher, 
    guards, updateGuard, 
    admins, updateAdmin, currentUser 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'guard' | 'admin'>('student');
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for editing
  const [editForm, setEditForm] = useState<any>({});

  const handleInspect = (person: any) => {
    setSelectedPerson(person);
    setEditForm({ ...person });
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.fullName) return;

    if (activeTab === 'student') {
      updateStudent(editForm);
    } else if (activeTab === 'teacher') {
      updateTeacher(editForm);
    } else if (activeTab === 'guard') {
      updateGuard(editForm);
    } else if (activeTab === 'admin') {
      updateAdmin(editForm);
    }

    setSelectedPerson(editForm);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const getRoleBadge = (role: string) => {
    if (role === 'Super Admin') return 'bg-red-500/10 text-red-600 dark:text-red-300';
    if (role === 'Admin') return 'bg-rose-500/10 text-rose-600 dark:text-rose-300';
    if (role === 'Teacher') return 'bg-purple-500/10 text-purple-600 dark:text-purple-300';
    if (role === 'Security') return 'bg-blue-500/10 text-blue-600 dark:text-blue-300';
    return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300';
  };

  const getPeopleList = () => {
    if (activeTab === 'student') return students;
    if (activeTab === 'teacher') return teachers;
    if (activeTab === 'guard') return guards;
    return admins;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Information Directory</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Explore detailed profiles of all campus personnel</p>
        </div>

        {/* Directory selectors */}
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-[var(--card-border)] self-start sm:self-center">
          <button
            onClick={() => { setActiveTab('student'); setSelectedPerson(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'student' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => { setActiveTab('teacher'); setSelectedPerson(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'teacher' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            Teachers
          </button>
          <button
            onClick={() => { setActiveTab('guard'); setSelectedPerson(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'guard' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            Guards
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setSelectedPerson(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admin' ? 'bg-white dark:bg-[#0f172a] shadow-sm text-brand-primary' : 'text-zinc-500'
            }`}
          >
            Admins
          </button>
        </div>
      </div>

      {/* Directory Grid vs Inspect details */}
      {!selectedPerson ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getPeopleList().map((person: any) => (
            <GlassCard
              key={person.id}
              hoverEffect
              onClick={() => handleInspect(person)}
              className="p-5 flex items-center justify-between"
              glowColor="rgba(79, 70, 229, 0.05)"
            >
              <div className="flex items-center gap-3">
                <img src={person.photo} alt={person.fullName} className="w-12 h-12 rounded-full object-cover border border-[var(--card-border)]" />
                <div>
                  <h3 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{person.fullName}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{person.id}</p>
                  <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded mt-1.5 ${getRoleBadge(person.role || (activeTab === 'student' ? 'Student' : activeTab === 'teacher' ? 'Teacher' : 'Security'))}`}>
                    {person.role || (activeTab === 'student' ? 'Student' : activeTab === 'teacher' ? 'Teacher' : 'Security')}
                  </span>
                </div>
              </div>
              <button className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-zinc-500 hover:text-brand-primary">
                <Eye className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPerson(null)}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-zinc-600 dark:text-zinc-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Personnel Profile Inspector</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Summary Badge Card */}
            <GlassCard hoverEffect={false} className="col-span-1 p-6 flex flex-col items-center text-center bg-gradient-to-b from-brand-primary/5 to-transparent">
              <img src={selectedPerson.photo} alt={selectedPerson.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md" />
              <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100 mt-4">{selectedPerson.fullName}</h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{selectedPerson.id}</p>
              
              <div className="w-full mt-6 space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400 font-semibold border-t border-[var(--card-border)] pt-5">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadge(selectedPerson.role || (activeTab === 'student' ? 'Student' : activeTab === 'teacher' ? 'Teacher' : 'Security'))}`}>
                    {selectedPerson.role || (activeTab === 'student' ? 'Student' : activeTab === 'teacher' ? 'Teacher' : 'Security')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.status || 'Active'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blood Group:</span>
                  <span className="text-red-500 font-bold">{selectedPerson.bloodGroup || 'O+'}</span>
                </div>
              </div>

              {/* Edit toggle */}
              {!isEditing && (currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20 flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile Info
                </button>
              )}
            </GlassCard>

            {/* Informational Database Fields */}
            <GlassCard hoverEffect={false} className="lg:col-span-2 p-6">
              
              {!isEditing ? (
                <div className="space-y-6">
                  <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 pb-3 border-b border-[var(--card-border)]">Detailed Information parameters</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    
                    {/* Education */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500"><Award className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Education / Qualifications</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.education || selectedPerson.qualification || 'Higher Secondary Education'}</span>
                      </div>
                    </div>

                    {/* Work */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500"><Briefcase className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Assigned Work / Subjects</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.work || selectedPerson.subject || 'Student Academics'}</span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500"><Phone className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Contact Phone</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.phone || selectedPerson.mobile}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500"><Mail className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Email Address</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.email}</span>
                      </div>
                    </div>

                    {/* DOB */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500"><Calendar className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Date of Birth</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.dob}</span>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500"><Phone className="w-4.5 h-4.5 text-red-500" /></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Emergency Contact</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.emergencyContact || selectedPerson.parentPhone}</span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-3 md:col-span-2">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500 shrink-0"><MapPin className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Address</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{selectedPerson.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Auth details reveal (Security parameters) */}
                  <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--card-border)] space-y-3.5 text-xs">
                    <h5 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[10px] tracking-wider">Authentication Credentials</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-bold">Portal Username</span>
                        <span className="font-mono text-zinc-800 dark:text-zinc-200 font-bold">{selectedPerson.username}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-bold">Portal Password</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-zinc-800 dark:text-zinc-200 font-bold">
                            {showPassword ? (selectedPerson.password || '(not set)') : '••••••••'}
                          </span>
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 rounded bg-black/5 dark:bg-white/5 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // EDITING FORM LAYOUT
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[var(--card-border)]">
                    <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Modify Information Profile</h4>
                    <button type="button" onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-500">Full Name *</label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-500">Email Address</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-500">Phone</label>
                      <input
                        type="text"
                        value={editForm.phone || editForm.mobile}
                        onChange={(e) => setEditForm({ 
                          ...editForm, 
                          phone: e.target.value,
                          mobile: e.target.value 
                        })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                      />
                    </div>

                    {/* DOB */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-500">Date of Birth</label>
                      <input
                        type="date"
                        value={editForm.dob}
                        onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-500">Portal Password</label>
                      <input
                        type="text"
                        value={editForm.password || ''}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none font-mono"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-semibold text-zinc-500">Residential Address</label>
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-[var(--card-border)] pt-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg bg-black/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                    >
                      Save Info
                    </button>
                  </div>
                </form>
              )}

            </GlassCard>

          </div>
        </div>
      )}

    </div>
  );
};
