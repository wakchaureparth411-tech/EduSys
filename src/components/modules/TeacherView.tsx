'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Search, Plus, Edit2, Trash2, Eye, Mail, 
  Phone, MapPin, Calendar, BookOpen, Award, 
  DollarSign, ArrowLeft, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Teacher } from '@/context/types';

export const TeacherView: React.FC = () => {
  const { 
    teachers, addTeacher, updateTeacher, deleteTeacher, currentUser 
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  
  // Views: 'list' | 'detail'
  const [viewState, setViewState] = useState<'list' | 'detail'>('list');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State
  const [formFields, setFormFields] = useState<Omit<Teacher, 'id'>>({
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
    fullName: '',
    subject: 'Mathematics',
    qualification: '',
    experience: '',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    username: '',
    password: '',
    salary: '₹60,000',
    joiningDate: '2026-06-01',
    status: 'Active'
  });

  const [editTeacherId, setEditTeacherId] = useState('');

  // Search & Filter
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || t.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  // Submit handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.fullName.trim() || !formFields.username.trim()) {
      alert('Please fill out Name and Username');
      return;
    }
    addTeacher(formFields);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.fullName.trim()) return;
    updateTeacher({
      ...formFields,
      id: editTeacherId
    } as Teacher);
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormFields({
      photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
      fullName: '',
      subject: 'Mathematics',
      qualification: '',
      experience: '',
      bloodGroup: 'O+',
      phone: '',
      email: '',
      address: '',
      username: '',
      password: '',
      salary: '₹60,000',
      joiningDate: '2026-06-01',
      status: 'Active'
    });
    setEditTeacherId('');
  };

  const openEditModal = (teacher: Teacher) => {
    setFormFields({ ...teacher });
    setEditTeacherId(teacher.id);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this teacher?')) {
      deleteTeacher(id);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
    if (status === 'Leave') return 'bg-amber-500/10 text-amber-600 dark:text-amber-300';
    return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300';
  };

  // Extract unique subjects for filtering list
  const subjectsList = ['All', ...Array.from(new Set(teachers.map(t => t.subject)))];

  return (
    <div className="space-y-6">
      
      {viewState === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Teachers Directory</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Manage academic instructors and faculties</p>
            </div>
            
            {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' || currentUser?.role === 'Manager') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-semibold hover:scale-[1.01] transition-all shadow-md shadow-brand-primary/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
            )}
          </div>

          {/* Search & Filters */}
          <GlassCard hoverEffect={false} className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search teacher by name, ID or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none focus:border-brand-primary/50 text-zinc-800 dark:text-zinc-200"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
              </div>
              
              <div className="w-full md:w-48">
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none focus:border-brand-primary/50 text-zinc-700 dark:text-zinc-300"
                >
                  {subjectsList.map(subj => (
                    <option key={subj} value={subj}>{subj === 'All' ? 'All Subjects' : subj}</option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Grid Layout of Teachers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <GlassCard key={teacher.id} hoverEffect className="p-5 flex flex-col justify-between relative" glowColor="rgba(124, 58, 237, 0.08)">
                <span className={`absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(teacher.status)}`}>
                  {teacher.status}
                </span>

                <div className="flex items-center gap-4">
                  <img
                    src={teacher.photo}
                    alt={teacher.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-[var(--card-border)]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{teacher.fullName}</h3>
                    <span className="text-[10px] bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                      {teacher.subject}
                    </span>
                    <p className="text-[9px] font-mono text-zinc-400 mt-1">ID: {teacher.id}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--card-border)] grid grid-cols-2 gap-2 text-[10px] text-zinc-500 font-semibold">
                  <div>
                    <span className="text-zinc-400 uppercase font-bold text-[8px] block">Experience</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{teacher.experience}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase font-bold text-[8px] block">Blood Group</span>
                    <span className="text-red-500">{teacher.bloodGroup}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => { setSelectedTeacher(teacher); setViewState('detail'); }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-black/10 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect
                  </button>

                  {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' || currentUser?.role === 'Manager') && (
                    <>
                      <button
                        onClick={() => openEditModal(teacher)}
                        className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-600 hover:text-brand-secondary hover:bg-brand-secondary/10 transition-colors border border-[var(--card-border)]"
                        title="Edit Info"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-[var(--card-border)]"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </GlassCard>
            ))}

            {filteredTeachers.length === 0 && (
              <div className="col-span-full py-16 text-center text-zinc-500 text-xs font-semibold">No teachers found in directory.</div>
            )}
          </div>
        </div>
      )}

      {/* Details View */}
      {viewState === 'detail' && selectedTeacher && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewState('list')}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-zinc-600 dark:text-zinc-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Teacher Profile details</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Summary badge */}
            <GlassCard hoverEffect={false} className="col-span-1 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-brand-secondary/5 to-transparent relative">
              <span className={`absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(selectedTeacher.status)}`}>
                {selectedTeacher.status}
              </span>
              
              <img
                src={selectedTeacher.photo}
                alt={selectedTeacher.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg"
              />
              
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-4">{selectedTeacher.fullName}</h3>
              <span className="text-xs bg-brand-secondary/15 text-brand-secondary px-3 py-1 rounded-full font-bold inline-block mt-2">
                {selectedTeacher.subject}
              </span>
              <p className="text-[10px] font-mono text-zinc-400 mt-2">ID: {selectedTeacher.id}</p>

              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' || currentUser?.role === 'Manager') && (
                <button
                  onClick={() => openEditModal(selectedTeacher)}
                  className="w-full mt-6 py-2.5 bg-brand-secondary text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-secondary/10 hover:shadow-brand-secondary/20 transition-all"
                >
                  Edit Profile Fields
                </button>
              )}
            </GlassCard>

            {/* Complete credentials details */}
            <GlassCard hoverEffect={false} className="lg:col-span-2 p-6 space-y-6">
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 pb-3 border-b border-[var(--card-border)]">Employment & Personal Profile</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                {/* Qualification */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Qualifications</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{selectedTeacher.qualification}</span>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Work Experience</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{selectedTeacher.experience}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Phone Number</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{selectedTeacher.phone}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Email Address</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{selectedTeacher.email}</span>
                  </div>
                </div>

                {/* Joining Date */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Joining Date</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{selectedTeacher.joiningDate}</span>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <DollarSign className="w-4.5 h-4.5 text-brand-secondary" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Salary package (Monthly)</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-bold">{selectedTeacher.salary}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500 shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Residential Address</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{selectedTeacher.address}</span>
                  </div>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10">
              <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Register New Teacher</h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Full Name *</label>
                    <input
                      type="text"
                      value={formFields.fullName}
                      onChange={(e) => setFormFields({ ...formFields, fullName: e.target.value })}
                      required
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Username *</label>
                    <input
                      type="text"
                      value={formFields.username}
                      onChange={(e) => setFormFields({ ...formFields, username: e.target.value })}
                      required
                      placeholder="e.g. sarah.science"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Subject *</label>
                    <select
                      value={formFields.subject}
                      onChange={(e) => setFormFields({ ...formFields, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="Physical Education">Physical Education</option>
                    </select>
                  </div>

                  {/* Qualification */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Qualifications</label>
                    <input
                      type="text"
                      value={formFields.qualification}
                      onChange={(e) => setFormFields({ ...formFields, qualification: e.target.value })}
                      placeholder="e.g. M.Sc. Physics, B.Ed."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Work Experience</label>
                    <input
                      type="text"
                      value={formFields.experience}
                      onChange={(e) => setFormFields({ ...formFields, experience: e.target.value })}
                      placeholder="e.g. 5 Years"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Monthly Salary package</label>
                    <input
                      type="text"
                      value={formFields.salary}
                      onChange={(e) => setFormFields({ ...formFields, salary: e.target.value })}
                      placeholder="e.g. ₹60,000"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Phone Phone</label>
                    <input
                      type="text"
                      value={formFields.phone}
                      onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                      placeholder="Enter 10-digit number"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Email Address</label>
                    <input
                      type="email"
                      value={formFields.email}
                      onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                      placeholder="teacher@edusys.com"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Joining Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Joining Date</label>
                    <input
                      type="date"
                      value={formFields.joiningDate}
                      onChange={(e) => setFormFields({ ...formFields, joiningDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Status</label>
                    <select
                      value={formFields.status}
                      onChange={(e) => setFormFields({ ...formFields, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Active">Active</option>
                      <option value="Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-500">Residential Address</label>
                    <textarea
                      value={formFields.address}
                      onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-[var(--card-border)] pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="px-4 py-2 rounded-lg bg-black/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                  >
                    Register Teacher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10">
              <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Modify Teacher Record</h3>
                <button onClick={() => setShowEditModal(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Full Name *</label>
                    <input
                      type="text"
                      value={formFields.fullName}
                      onChange={(e) => setFormFields({ ...formFields, fullName: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Subject *</label>
                    <select
                      value={formFields.subject}
                      onChange={(e) => setFormFields({ ...formFields, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="Physical Education">Physical Education</option>
                    </select>
                  </div>

                  {/* Qualification */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Qualifications</label>
                    <input
                      type="text"
                      value={formFields.qualification}
                      onChange={(e) => setFormFields({ ...formFields, qualification: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Experience</label>
                    <input
                      type="text"
                      value={formFields.experience}
                      onChange={(e) => setFormFields({ ...formFields, experience: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Monthly Salary</label>
                    <input
                      type="text"
                      value={formFields.salary}
                      onChange={(e) => setFormFields({ ...formFields, salary: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Phone</label>
                    <input
                      type="text"
                      value={formFields.phone}
                      onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Email Address</label>
                    <input
                      type="email"
                      value={formFields.email}
                      onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Status</label>
                    <select
                      value={formFields.status}
                      onChange={(e) => setFormFields({ ...formFields, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Active">Active</option>
                      <option value="Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-500">Residential Address</label>
                    <textarea
                      value={formFields.address}
                      onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-[var(--card-border)] pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); resetForm(); }}
                    className="px-4 py-2 rounded-lg bg-black/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                  >
                    Save Changes
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
