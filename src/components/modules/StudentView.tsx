'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Search, Plus, Edit2, Trash2, Eye, FileSpreadsheet, 
  FileText, ArrowLeft, Calendar, Phone, MapPin, 
  Mail, UserCheck, GraduationCap, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '@/context/types';

export const StudentView: React.FC = () => {
  const { 
    students, addStudent, updateStudent, deleteStudent, currentUser 
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // View state: 'list' | 'detail' | 'profile' | 'add' | 'edit'
  const [viewState, setViewState] = useState<'list' | 'detail' | 'profile'>('list');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State
  const [formFields, setFormFields] = useState<Omit<Student, 'id'>>({
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    fullName: '',
    rollNumber: '',
    classVal: 'Class 10',
    division: 'A',
    dob: '2011-01-01',
    gender: 'Male',
    bloodGroup: 'O+',
    mobile: '',
    parentPhone: '',
    address: '',
    email: '',
    username: '',
    password: '',
    admissionDate: '2026-06-01',
    status: 'Active'
  });

  const [editStudentId, setEditStudentId] = useState('');

  // 1. Search and Filtering
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.includes(searchQuery);
    const matchesClass = classFilter === 'All' || s.classVal === classFilter;
    return matchesSearch && matchesClass;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export handlers (Mock)
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const triggerExport = (type: 'Excel' | 'PDF') => {
    setIsExporting(type);
    setTimeout(() => {
      setIsExporting(null);
      alert(`Mock download: Student_Report_${Date.now()}.${type === 'Excel' ? 'xlsx' : 'pdf'} generated!`);
    }, 1500);
  };

  // Form Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.fullName.trim() || !formFields.username.trim()) {
      alert('Please fill out Name and Username fields');
      return;
    }
    // Auto username generation if empty
    addStudent(formFields);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.fullName.trim()) return;
    updateStudent({
      ...formFields,
      id: editStudentId
    } as Student);
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormFields({
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      fullName: '',
      rollNumber: '',
      classVal: 'Class 10',
      division: 'A',
      dob: '2011-01-01',
      gender: 'Male',
      bloodGroup: 'O+',
      mobile: '',
      parentPhone: '',
      address: '',
      email: '',
      username: '',
      password: '',
      admissionDate: '2026-06-01',
      status: 'Active'
    });
    setEditStudentId('');
  };

  const openEditModal = (student: Student) => {
    setFormFields({ ...student });
    setEditStudentId(student.id);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this student?')) {
      deleteStudent(id);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
    if (status === 'Suspended') return 'bg-red-500/10 text-red-600 dark:text-red-300';
    return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic View Swapper */}
      {viewState === 'list' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Students Directory</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Manage and inspect all student registers</p>
            </div>
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => triggerExport('Excel')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-600/20 transition-all"
                disabled={isExporting !== null}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isExporting === 'Excel' ? 'Exporting...' : 'Export Excel'}</span>
              </button>

              <button
                onClick={() => triggerExport('PDF')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-300 border border-red-500/20 text-xs font-semibold hover:bg-red-600/20 transition-all"
                disabled={isExporting !== null}
              >
                <FileText className="w-4 h-4" />
                <span>{isExporting === 'PDF' ? 'Exporting...' : 'Export PDF'}</span>
              </button>

              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-semibold hover:scale-[1.01] transition-all shadow-md shadow-brand-primary/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Student</span>
                </button>
              )}
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <GlassCard hoverEffect={false} className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search student by name, ID or roll number..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none focus:border-brand-primary/50 text-zinc-800 dark:text-zinc-200"
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
              </div>
              
              <div className="w-full md:w-48">
                <select
                  value={classFilter}
                  onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none focus:border-brand-primary/50 text-zinc-700 dark:text-zinc-300"
                >
                  <option value="All">All Classes</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Student Table */}
          <GlassCard hoverEffect={false} className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--card-border)] text-zinc-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ID / Photo</th>
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Class/Grade</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)] text-zinc-700 dark:text-zinc-300">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">No student profiles found matching filters.</td>
                    </tr>
                  ) : (
                    paginatedStudents.map(student => (
                      <tr key={student.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 flex items-center gap-3">
                          <img src={student.photo} alt={student.fullName} className="w-8 h-8 rounded-full object-cover border border-[var(--card-border)]" />
                          <span className="font-semibold font-mono text-[10px] text-zinc-400">{student.id}</span>
                        </td>
                        <td className="px-6 py-3 font-semibold text-zinc-800 dark:text-zinc-200">{student.fullName}</td>
                        <td className="px-6 py-3">
                          <span className="font-medium">{student.classVal} - {student.division}</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">Roll: {student.rollNumber}</span>
                        </td>
                        <td className="px-6 py-3">{student.mobile}</td>
                        <td className="px-6 py-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right space-x-1.5">
                          <button
                            onClick={() => { setSelectedStudent(student); setViewState('detail'); }}
                            className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-brand-primary/10 text-zinc-500 hover:text-brand-primary transition-all"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                            <>
                              <button
                                onClick={() => openEditModal(student)}
                                className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-brand-secondary/10 text-zinc-500 hover:text-brand-secondary transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(student.id)}
                                className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--card-border)] bg-black/5 dark:bg-white/5">
                <span className="text-xs text-zinc-500 font-medium">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f172a] border border-[var(--card-border)] text-xs text-zinc-600 disabled:opacity-50 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f172a] border border-[var(--card-border)] text-xs text-zinc-600 disabled:opacity-50 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Details Inspector Mode */}
      {viewState === 'detail' && selectedStudent && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewState('list')}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-zinc-600 dark:text-zinc-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Student Profile Inspector</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ID Badge Card layout (Student details) */}
            <GlassCard hoverEffect={false} className="col-span-1 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-brand-primary/5 to-transparent relative">
              <span className={`absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(selectedStudent.status)}`}>
                {selectedStudent.status}
              </span>
              
              <img
                src={selectedStudent.photo}
                alt={selectedStudent.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg"
              />
              
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-4">{selectedStudent.fullName}</h3>
              <p className="text-xs text-zinc-500 font-medium">Roll Number: {selectedStudent.rollNumber}</p>
              
              <div className="w-full mt-6 py-3 border-t border-b border-[var(--card-border)] grid grid-cols-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <div className="border-r border-[var(--card-border)]">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Class</p>
                  <p className="text-sm mt-0.5 text-zinc-800 dark:text-zinc-200">{selectedStudent.classVal}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Division</p>
                  <p className="text-sm mt-0.5 text-zinc-800 dark:text-zinc-200">{selectedStudent.division}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full mt-6 space-y-2">
                <button 
                  onClick={() => setViewState('profile')}
                  className="w-full py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20 transition-all"
                >
                  View Student Profile Page
                </button>
                <button
                  onClick={() => openEditModal(selectedStudent)}
                  className="w-full py-2.5 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                >
                  Edit Profile Fields
                </button>
              </div>
            </GlassCard>

            {/* Informational Profile details */}
            <GlassCard hoverEffect={false} className="lg:col-span-2 p-6 space-y-6">
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 pb-3 border-b border-[var(--card-border)]">Personal & Parental Data</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Email Address</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.email}</span>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Mobile Phone</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.mobile}</span>
                  </div>
                </div>

                {/* Parent Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Phone className="w-4.5 h-4.5 text-brand-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Parent/Emergency Phone</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.parentPhone}</span>
                  </div>
                </div>

                {/* DOB */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Date of Birth</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.dob}</span>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <span className="font-bold text-red-500 text-xs">O+</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Medical Blood Group</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.bloodGroup}</span>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <UserCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Gender Identity</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.gender}</span>
                  </div>
                </div>

                {/* Admission Date */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Admission Date</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.admissionDate}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-500 shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Residential Address</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedStudent.address}</span>
                  </div>
                </div>

              </div>
            </GlassCard>

          </div>
        </div>
      )}

      {/* Printable ID Profile Page */}
      {viewState === 'profile' && selectedStudent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewState('detail')}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-zinc-600 dark:text-zinc-400 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Student Profile Page</h2>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs font-semibold hover:bg-zinc-900 transition-all"
            >
              Print Profile Card
            </button>
          </div>

          <div className="max-w-xl mx-auto">
            {/* Premium Glass Student Card ID Badging */}
            <GlassCard hoverEffect={false} className="p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 border-2 border-brand-primary/20 relative overflow-hidden">
              
              {/* Background accent decals */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-start justify-between border-b border-[var(--card-border)] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide text-zinc-800 dark:text-zinc-100">EDU-SYS SMART CAMPUS</h3>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Official Student ID Badge</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">{selectedStudent.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                
                {/* Photo column */}
                <div className="flex flex-col items-center">
                  <img
                    src={selectedStudent.photo}
                    alt={selectedStudent.fullName}
                    className="w-28 h-28 object-cover rounded-xl border border-brand-primary/20 shadow-md"
                  />
                  <span className="mt-3 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Role</span>
                  <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded-full mt-1">STUDENT</span>
                </div>

                {/* Details column */}
                <div className="md:col-span-2 space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold block">Full Name</span>
                      <span className="text-zinc-800 dark:text-zinc-100">{selectedStudent.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold block">Roll Number</span>
                      <span className="text-zinc-800 dark:text-zinc-100">{selectedStudent.rollNumber}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold block">Class & Division</span>
                      <span className="text-zinc-800 dark:text-zinc-100">{selectedStudent.classVal} - {selectedStudent.division}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold block">Blood Group</span>
                      <span className="text-red-500">{selectedStudent.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold block">Emergency Contact</span>
                      <span className="text-zinc-800 dark:text-zinc-100">{selectedStudent.parentPhone}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold block">Admission Date</span>
                      <span className="text-zinc-800 dark:text-zinc-100">{selectedStudent.admissionDate}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-zinc-400 font-bold block uppercase">Campus Principal</span>
                      <span className="text-[10px] italic text-zinc-500">Dr. Albert G.</span>
                    </div>
                    {/* Simulated barcode for student scanning */}
                    <div className="flex flex-col items-end">
                      <div className="h-6 w-24 bg-zinc-800 flex items-center justify-center text-[7px] text-white tracking-widest rounded">
                        ||||| | | || |||
                      </div>
                      <span className="text-[8px] text-zinc-400 font-mono mt-0.5">{selectedStudent.id}</span>
                    </div>
                  </div>
                </div>

              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10">
              
              <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Register New Student Profile</h3>
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
                      placeholder="e.g. John Doe"
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
                      placeholder="e.g. john.doe"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Roll Number</label>
                    <input
                      type="text"
                      value={formFields.rollNumber}
                      onChange={(e) => setFormFields({ ...formFields, rollNumber: e.target.value })}
                      placeholder="e.g. 08"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Class */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Class *</label>
                    <select
                      value={formFields.classVal}
                      onChange={(e) => setFormFields({ ...formFields, classVal: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                    </select>
                  </div>

                  {/* Division */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Division *</label>
                    <select
                      value={formFields.division}
                      onChange={(e) => setFormFields({ ...formFields, division: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">DOB</label>
                    <input
                      type="date"
                      value={formFields.dob}
                      onChange={(e) => setFormFields({ ...formFields, dob: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Gender</label>
                    <select
                      value={formFields.gender}
                      onChange={(e) => setFormFields({ ...formFields, gender: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Blood Group</label>
                    <input
                      type="text"
                      value={formFields.bloodGroup}
                      onChange={(e) => setFormFields({ ...formFields, bloodGroup: e.target.value })}
                      placeholder="e.g. O+"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Mobile Phone</label>
                    <input
                      type="text"
                      value={formFields.mobile}
                      onChange={(e) => setFormFields({ ...formFields, mobile: e.target.value })}
                      placeholder="Enter 10-digit number"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Parent Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Parent/Emergency Contact</label>
                    <input
                      type="text"
                      value={formFields.parentPhone}
                      onChange={(e) => setFormFields({ ...formFields, parentPhone: e.target.value })}
                      placeholder="Enter parent mobile"
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
                      placeholder="student@gmail.com"
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
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-500">Residential Address</label>
                    <textarea
                      value={formFields.address}
                      onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                      rows={2}
                      placeholder="Enter details..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200 resize-none"
                    />
                  </div>

                </div>

                <div className="flex justify-end gap-2 border-t border-[var(--card-border)] pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold shadow hover:scale-[1.01] transition-all"
                  >
                    Register Student
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-2xl z-10">
              
              <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Modify Student Profile</h3>
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

                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Roll Number</label>
                    <input
                      type="text"
                      value={formFields.rollNumber}
                      onChange={(e) => setFormFields({ ...formFields, rollNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Class */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Class *</label>
                    <select
                      value={formFields.classVal}
                      onChange={(e) => setFormFields({ ...formFields, classVal: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                    </select>
                  </div>

                  {/* Division */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Division *</label>
                    <select
                      value={formFields.division}
                      onChange={(e) => setFormFields({ ...formFields, division: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">DOB</label>
                    <input
                      type="date"
                      value={formFields.dob}
                      onChange={(e) => setFormFields({ ...formFields, dob: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Gender</label>
                    <select
                      value={formFields.gender}
                      onChange={(e) => setFormFields({ ...formFields, gender: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-700 dark:text-zinc-300"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Blood Group</label>
                    <input
                      type="text"
                      value={formFields.bloodGroup}
                      onChange={(e) => setFormFields({ ...formFields, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Mobile Phone</label>
                    <input
                      type="text"
                      value={formFields.mobile}
                      onChange={(e) => setFormFields({ ...formFields, mobile: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] focus:outline-none text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  {/* Parent Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Parent Phone</label>
                    <input
                      type="text"
                      value={formFields.parentPhone}
                      onChange={(e) => setFormFields({ ...formFields, parentPhone: e.target.value })}
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
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
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
                    className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-xs text-zinc-600 dark:text-zinc-400 hover:bg-black/10 transition-all"
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
