'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, Teacher, Guard, Admin, GetPass, AttendanceRecord, 
  ActivityLog, SchoolSettings, DesignConfig, User, UserRole, AttendanceStatus
} from './types';
import { fsListen, fsSet, fsUpdate, fsDelete, fsAdd, fsGetAll } from '@/lib/firebaseDB';

interface StateContextType {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  students: Student[];
  teachers: Teacher[];
  guards: Guard[];
  admins: Admin[];
  getPassRequests: GetPass[];
  attendanceRecords: AttendanceRecord[];
  activityLogs: ActivityLog[];
  settings: SchoolSettings;
  designConfig: DesignConfig;
  notifications: { id: string; text: string; time: string; read: boolean }[];
  
  // Actions
  login: (username: string, role: UserRole) => boolean;
  loginWithEmail: (email: string, password: string) => { success: boolean; error?: string };
  loginWithRegistered: (user: import('./types').User & { role: UserRole }) => void;
  logout: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  addGuard: (guard: Omit<Guard, 'id'>) => void;
  updateGuard: (guard: Guard) => void;
  deleteGuard: (id: string) => void;
  addAdmin: (admin: Omit<Admin, 'id'>) => void;
  updateAdmin: (admin: Admin) => void;
  deleteAdmin: (id: string) => void;
  createGetPass: (pass: Omit<GetPass, 'id' | 'status' | 'approvals' | 'qrCode'>) => void;
  updateGetPassStatus: (id: string, reviewerRole: 'teacher' | 'admin' | 'security', status: 'Approved' | 'Rejected') => void;
  scanGetPassQR: (qrCode: string, scanType: 'exit' | 'entry') => { success: boolean; message: string };
  saveAttendance: (date: string, classVal: string, division: string, records: { [studentId: string]: AttendanceStatus }) => void;
  updateSettings: (settings: SchoolSettings) => void;
  updateDesignConfig: (config: Partial<DesignConfig>) => void;
  logActivity: (action: string, details?: string) => void;
  clearNotifications: () => void;
  addNotification: (text: string) => void;
  markNotificationsAsRead: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

// Helper to convert hex to RGB space separated
const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result 
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '79 70 229';
};

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edusys_current_user');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTab = localStorage.getItem('edusys_active_tab');
        const savedUser = localStorage.getItem('edusys_current_user');
        return savedUser ? (savedTab || 'dashboard') : 'login';
      } catch {
        return 'login';
      }
    }
    return 'login';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('edusys_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('edusys_current_user');
        localStorage.removeItem('edusys_active_tab');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      localStorage.setItem('edusys_active_tab', activeTab);
    }
  }, [activeTab, currentUser]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'New Get Pass request from Aman Verma (Class 10-A)', time: '5m ago', read: false },
    { id: '2', text: 'Teacher Mrs. Priya Patel requested Leave today', time: '1h ago', read: false },
    { id: '3', text: 'System backup completed successfully', time: '2h ago', read: true }
  ]);

  // Seed Students
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'ST1001',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      fullName: 'Aman Verma',
      rollNumber: '01',
      classVal: 'Class 10',
      division: 'A',
      dob: '2011-04-12',
      gender: 'Male',
      bloodGroup: 'O+',
      mobile: '9876543210',
      parentPhone: '9876543211',
      address: '123, Green Street, City',
      email: 'aman.verma@gmail.com',
      username: 'aman.verma',
      admissionDate: '2021-06-15',
      status: 'Active'
    },
    {
      id: 'ST1002',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      fullName: 'Priya Sharma',
      rollNumber: '02',
      classVal: 'Class 10',
      division: 'A',
      dob: '2011-08-22',
      gender: 'Female',
      bloodGroup: 'A+',
      mobile: '9876543212',
      parentPhone: '9876543213',
      address: '45, Royal Enclave, City',
      email: 'priya.sharma@gmail.com',
      username: 'priya.sharma',
      admissionDate: '2021-06-18',
      status: 'Active'
    },
    {
      id: 'ST1003',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      fullName: 'Rohan Mehta',
      rollNumber: '03',
      classVal: 'Class 10',
      division: 'B',
      dob: '2011-02-10',
      gender: 'Male',
      bloodGroup: 'B+',
      mobile: '9876543214',
      parentPhone: '9876543215',
      address: '88, Heights Residency, City',
      email: 'rohan.mehta@gmail.com',
      username: 'rohan.mehta',
      admissionDate: '2021-07-02',
      status: 'Active'
    },
    {
      id: 'ST1004',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      fullName: 'Ananya Singh',
      rollNumber: '04',
      classVal: 'Class 9',
      division: 'A',
      dob: '2012-05-19',
      gender: 'Female',
      bloodGroup: 'AB+',
      mobile: '9876543216',
      parentPhone: '9876543217',
      address: '12, Garden View Apartments, City',
      email: 'ananya.singh@gmail.com',
      username: 'ananya.singh',
      admissionDate: '2022-06-11',
      status: 'Active'
    },
    {
      id: 'ST1005',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      fullName: 'Kabir Joshi',
      rollNumber: '05',
      classVal: 'Class 11',
      division: 'C',
      dob: '2010-11-05',
      gender: 'Male',
      bloodGroup: 'O-',
      mobile: '9876543218',
      parentPhone: '9876543219',
      address: '99, Lakeview Road, City',
      email: 'kabir.joshi@gmail.com',
      username: 'kabir.joshi',
      admissionDate: '2020-06-20',
      status: 'Active'
    },
    {
      id: 'ST1006',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      fullName: 'Riya Patel',
      rollNumber: '06',
      classVal: 'Class 10',
      division: 'B',
      dob: '2011-09-30',
      gender: 'Female',
      bloodGroup: 'A-',
      mobile: '9876543220',
      parentPhone: '9876543221',
      address: '54, Park Avenue, City',
      email: 'riya.patel@gmail.com',
      username: 'riya.patel',
      admissionDate: '2021-06-25',
      status: 'Active'
    },
    {
      id: 'ST1007',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      fullName: 'Arjun Singh',
      rollNumber: '07',
      classVal: 'Class 11',
      division: 'A',
      dob: '2010-01-14',
      gender: 'Male',
      bloodGroup: 'B-',
      mobile: '9876543222',
      parentPhone: '9876543223',
      address: '15, Valley View, City',
      email: 'arjun.singh@gmail.com',
      username: 'arjun.singh',
      admissionDate: '2020-07-01',
      status: 'Active'
    }
  ]);

  // Seed Teachers
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 'TC8001',
      photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
      fullName: 'Rahul Sharma',
      subject: 'Mathematics',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      experience: '8 Years',
      bloodGroup: 'O+',
      phone: '9876543301',
      email: 'rahul.sharma@edusys.com',
      address: 'Flat 402, Sunshine Apts, City',
      username: 'rahul.math',
      salary: '₹65,000',
      joiningDate: '2018-06-01',
      status: 'Active'
    },
    {
      id: 'TC8002',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      fullName: 'Priya Patel',
      subject: 'Science',
      qualification: 'M.Sc. Physics, M.Ed.',
      experience: '10 Years',
      bloodGroup: 'A+',
      phone: '9876543302',
      email: 'priya.science@edusys.com',
      address: '56, Shanti Kunj, City',
      username: 'priya.science',
      salary: '₹72,000',
      joiningDate: '2016-07-15',
      status: 'Active'
    },
    {
      id: 'TC8003',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      fullName: 'Amit Verma',
      subject: 'English',
      qualification: 'M.A. English Literature, B.Ed.',
      experience: '5 Years',
      bloodGroup: 'B+',
      phone: '9876543303',
      email: 'amit.english@edusys.com',
      address: '22, Hillcrest Road, City',
      username: 'amit.english',
      salary: '₹55,000',
      joiningDate: '2021-04-10',
      status: 'Active'
    },
    {
      id: 'TC8004',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      fullName: 'Neha Singh',
      subject: 'Social Studies',
      qualification: 'M.A. History, B.Ed.',
      experience: '6 Years',
      bloodGroup: 'AB+',
      phone: '9876543304',
      email: 'neha.sst@edusys.com',
      address: 'Apartment 7B, Sky Tower, City',
      username: 'neha.sst',
      salary: '₹58,000',
      joiningDate: '2020-09-01',
      status: 'Active'
    },
    {
      id: 'TC8005',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      fullName: 'Rohit Kumar',
      subject: 'Physical Education',
      qualification: 'B.P.Ed.',
      experience: '4 Years',
      bloodGroup: 'O-',
      phone: '9876543305',
      email: 'rohit.pe@edusys.com',
      address: '10, Sports Complex Lane, City',
      username: 'rohit.pe',
      password: '',
      salary: '₹50,000',
      joiningDate: '2022-03-15',
      status: 'Active'
    },
    {
      id: 'TC8006',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      fullName: 'Shreyas Bhor',
      subject: 'Mathematics',
      qualification: 'B.Sc. Mathematics, B.Ed.',
      experience: '3 Years',
      bloodGroup: 'B+',
      phone: '9876543306',
      email: 'bhorshreyas83@gmail.com',
      address: 'Campus Staff Quarters, Block B',
      username: 'shreyas.bhor',
      password: atob('MDIwMg=='),
      salary: '₹52,000',
      joiningDate: '2024-06-01',
      status: 'Active'
    }
  ]);

  // Seed Guards
  const [guards, setGuards] = useState<Guard[]>([
    {
      id: 'GD9001',
      photo: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=150',
      fullName: 'Suresh Yadav',
      phone: '9876543401',
      email: 'suresh.guard@edusys.com',
      bloodGroup: 'O+',
      education: 'Higher Secondary',
      work: 'Gate Keeper & Patrol',
      address: '12, Sector 4, City Outskirts',
      dob: '1985-05-12',
      gender: 'Male',
      emergencyContact: '9876543402',
      username: 'suresh.security',
      role: 'Security',
      status: 'On Duty'
    },
    {
      id: 'GD9002',
      photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      fullName: 'Mohan Singh',
      phone: '9876543403',
      email: 'mohan.guard@edusys.com',
      bloodGroup: 'B+',
      education: 'Secondary School Certificate',
      work: 'Night Shift Guard',
      address: '88, Village Rampur, Near City',
      dob: '1988-08-20',
      gender: 'Male',
      emergencyContact: '9876543404',
      username: 'mohan.security',
      role: 'Security',
      status: 'On Leave'
    },
    {
      id: 'GD9003',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      fullName: 'Rajesh Kumar',
      phone: '9876543405',
      email: 'rajesh.guard@edusys.com',
      bloodGroup: 'A+',
      education: 'High School',
      work: 'Transport Gate Watcher',
      address: '44, Railway Colony, City',
      dob: '1990-10-15',
      gender: 'Male',
      emergencyContact: '9876543406',
      username: 'rajesh.security',
      role: 'Security',
      status: 'On Duty'
    }
  ]);

  // Super Admin credentials — stored obfuscated (base64)
  const SUPER_ADMIN_EMAIL = 'wakchaureparth411@gmail.com';
  // Decoded at runtime only — not stored as plain text in source
  const SUPER_ADMIN_PASSWORD = atob('MTUvMDkvMjAwNw==');

  // Seed Admins
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 'AD0001',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      fullName: 'Parth Wakchaure',
      phone: '9876543001',
      email: 'wakchaureparth411@gmail.com',
      bloodGroup: 'AB+',
      education: 'Master of Business Administration (MBA)',
      work: 'Overall Campus Director',
      address: 'Principal Bungalow, Campus Main Road',
      dob: '2007-09-15',
      gender: 'Male',
      emergencyContact: '9876543002',
      username: 'admin',
      role: 'Super Admin',
      status: 'Active'
    },
    {
      id: 'AD0002',
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
      fullName: 'Admin One',
      phone: '9876543003',
      email: 'admin1@edusys.com',
      bloodGroup: 'O-',
      education: 'Master of Computer Applications',
      work: 'Admissions and System Executive',
      address: '33, Admin block staff apartments',
      dob: '1984-09-05',
      gender: 'Female',
      emergencyContact: '9876543004',
      username: 'admin1',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 'AD0003',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      fullName: 'Mayur Gambhire',
      phone: '9000000000',
      email: 'Mayur2505@gmail.com',
      bloodGroup: 'B+',
      education: 'MBA – Human Resource Management',
      work: 'Manager – Student & Teacher Affairs',
      address: 'Pune, Maharashtra',
      dob: '1995-05-25',
      gender: 'Male',
      emergencyContact: '9000000001',
      username: 'mayur.gambhire',
      role: 'Manager',
      status: 'Active'
    }
  ]);

  // Seed Get Passes
  const [getPassRequests, setGetPassRequests] = useState<GetPass[]>([
    {
      id: 'GP801',
      studentId: 'ST1001',
      studentName: 'Aman Verma',
      classVal: 'Class 10',
      division: 'A',
      reason: 'Going Home - High Fever',
      date: '2026-07-14',
      time: '10:30 AM',
      destination: 'Home (Parent Pick-up)',
      status: 'Pending',
      approvals: {
        teacher: 'Approved',
        admin: 'Pending',
        security: 'Pending'
      },
      qrCode: 'GP801-AMAN-VERMA',
    },
    {
      id: 'GP802',
      studentId: 'ST1004',
      studentName: 'Ananya Singh',
      classVal: 'Class 9',
      division: 'A',
      reason: 'Medical Checkup Appointment',
      date: '2026-07-14',
      time: '10:15 AM',
      destination: 'Dental Clinic, City',
      status: 'Approved',
      approvals: {
        teacher: 'Approved',
        admin: 'Approved',
        security: 'Approved'
      },
      qrCode: 'GP802-ANANYA-SINGH',
      exitTime: '10:20 AM',
    },
    {
      id: 'GP803',
      studentId: 'ST1005',
      studentName: 'Kabir Joshi',
      classVal: 'Class 11',
      division: 'C',
      reason: 'Family Function Travel',
      date: '2026-07-14',
      time: '09:50 AM',
      destination: 'Out of Station (Dehradun)',
      status: 'Pending',
      approvals: {
        teacher: 'Pending',
        admin: 'Pending',
        security: 'Pending'
      },
      qrCode: 'GP803-KABIR-JOSHI'
    },
    {
      id: 'GP804',
      studentId: 'ST1002',
      studentName: 'Priya Sharma',
      classVal: 'Class 10',
      division: 'A',
      reason: 'Going Home - Urgent Family Emergency',
      date: '2026-07-14',
      time: '09:30 AM',
      destination: 'Home',
      status: 'Pending',
      approvals: {
        teacher: 'Approved',
        admin: 'Pending',
        security: 'Pending'
      },
      qrCode: 'GP804-PRIYA-SHARMA'
    }
  ]);

  // Seed Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      date: '2026-07-14',
      classVal: 'Class 10',
      division: 'A',
      records: {
        'ST1001': 'Present',
        'ST1002': 'Present',
        'ST1003': 'Absent', // Rohan Mehta
        'ST1004': 'Present',
        'ST1005': 'Present',
        'ST1006': 'Present',
        'ST1007': 'Present'
      }
    },
    {
      date: '2026-07-13',
      classVal: 'Class 10',
      division: 'A',
      records: {
        'ST1001': 'Present',
        'ST1002': 'Present',
        'ST1003': 'Present',
        'ST1004': 'Present',
        'ST1005': 'Present',
        'ST1006': 'Late',
        'ST1007': 'Present'
      }
    },
    {
      date: '2026-07-12',
      classVal: 'Class 10',
      division: 'A',
      records: {
        'ST1001': 'Present',
        'ST1002': 'Present',
        'ST1003': 'Present',
        'ST1004': 'Leave',
        'ST1005': 'Present',
        'ST1006': 'Present',
        'ST1007': 'Present'
      }
    },
    // Historical statistics (Class 10-A)
    {
      date: '2026-07-11',
      classVal: 'Class 10',
      division: 'A',
      records: {
        'ST1001': 'Present', 'ST1002': 'Present', 'ST1003': 'Present',
        'ST1004': 'Present', 'ST1005': 'Present', 'ST1006': 'Present', 'ST1007': 'Present'
      }
    },
    {
      date: '2026-07-10',
      classVal: 'Class 10',
      division: 'A',
      records: {
        'ST1001': 'Present', 'ST1002': 'Absent', 'ST1003': 'Present',
        'ST1004': 'Present', 'ST1005': 'Present', 'ST1006': 'Late', 'ST1007': 'Present'
      }
    }
  ]);

  // Seed Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'LOG001',
      userId: 'AD0001',
      userName: 'Super Admin',
      role: 'Super Admin',
      action: 'System Login',
      timestamp: '2026-07-14T09:00:00Z',
      details: 'Super Admin logged in from Admin Console'
    },
    {
      id: 'LOG002',
      userId: 'GD9001',
      userName: 'Suresh Yadav',
      role: 'Security',
      action: 'Security Gate Entry Scan',
      timestamp: '2026-07-14T09:10:00Z',
      details: 'Scanned Student Card: Aman Verma entered main campus.'
    },
    {
      id: 'LOG003',
      userId: 'TC8001',
      userName: 'Rahul Sharma',
      role: 'Teacher',
      action: 'Submit Attendance',
      timestamp: '2026-07-14T09:45:00Z',
      details: 'Submitted attendance for Class 10-A. Present: 6, Absent: 1'
    },
    {
      id: 'LOG004',
      userId: 'GD9001',
      userName: 'Suresh Yadav',
      role: 'Security',
      action: 'Security Gate Exit Approved',
      timestamp: '2026-07-14T10:20:00Z',
      details: 'Approved Gate Exit for Ananya Singh (Class 9-A) on Get Pass GP802'
    }
  ]);

  // School Settings
  const [settings, setSettings] = useState<SchoolSettings>({
    schoolName: 'EduSys Smart Campus',
    schoolLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
    address: '45, Knowledge Boulevard, Tech City - 400012',
    email: 'contact@edusyscampus.edu',
    phone: '+91 22 2345 6789',
    theme: 'light',
    language: 'English',
    notificationsEnabled: true
  });

  // Dynamic style config - AI Design Assistant properties
  const [designConfig, setDesignConfig] = useState<DesignConfig>({
    accentColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    radius: 18,
    blur: 16,
    glassOpacity: 0.7,
    gradientStrength: 45,
    fontFamily: 'Poppins'
  });

  // Side Effect to apply Design Config to CSS values dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToRgb(designConfig.accentColor));
    root.style.setProperty('--secondary', hexToRgb(designConfig.secondaryColor));
    root.style.setProperty('--radius-card', `${designConfig.radius}px`);
    root.style.setProperty('--glass-blur', `${designConfig.blur}px`);
    root.style.setProperty('--card-bg', `rgba(255, 255, 255, ${designConfig.glassOpacity})`);
    
    // Apply for dark mode as well (with opacity tweak)
    if (root.classList.contains('dark')) {
      root.style.setProperty('--card-bg', `rgba(15, 23, 42, ${designConfig.glassOpacity - 0.1})`);
    }

    // Set font-family on body
    root.style.setProperty('--font-poppins', designConfig.fontFamily);
  }, [designConfig]);

  // ─── Firestore real-time sync & auto-seeding ────────────────────────
  useEffect(() => {
    const seedIfNeeded = async () => {
      try {
        // Seed Students
        const studentSnap = await fsGetAll('students');
        if (studentSnap.length === 0) {
          for (const s of students) {
            await fsSet('students', s.id, s as unknown as Record<string, unknown>);
          }
        }
        // Seed Teachers
        const teacherSnap = await fsGetAll('teachers');
        if (teacherSnap.length === 0) {
          for (const t of teachers) {
            await fsSet('teachers', t.id, t as unknown as Record<string, unknown>);
          }
        }
        // Seed Guards
        const guardSnap = await fsGetAll('guards');
        if (guardSnap.length === 0) {
          for (const g of guards) {
            await fsSet('guards', g.id, g as unknown as Record<string, unknown>);
          }
        }
      } catch (e) {
        console.error("Firestore seeding error:", e);
      }
    };
    seedIfNeeded();

    // Listen to students collection
    const unsubStudents = fsListen('students', (data) => {
      if (data.length > 0) setStudents(data as unknown as Student[]);
    });
    // Listen to teachers collection
    const unsubTeachers = fsListen('teachers', (data) => {
      if (data.length > 0) setTeachers(data as unknown as Teacher[]);
    });
    // Listen to guards collection
    const unsubGuards = fsListen('guards', (data) => {
      if (data.length > 0) setGuards(data as unknown as Guard[]);
    });
    // Listen to getpass collection
    const unsubGetPass = fsListen('getpass', (data) => {
      if (data.length > 0) setGetPassRequests(data as unknown as GetPass[]);
    });
    return () => {
      unsubStudents();
      unsubTeachers();
      unsubGuards();
      unsubGetPass();
    };
  }, []);

  // Actions

  /** Login by email + password — Super Admin or any seeded user */
  const loginWithEmail = (email: string, password: string): { success: boolean; error?: string } => {
    const emailLower = email.trim().toLowerCase();

    // Super Admin hardcoded check
    if (emailLower === SUPER_ADMIN_EMAIL.toLowerCase() && password === SUPER_ADMIN_PASSWORD) {
      const superAdmin = admins.find(a => a.role === 'Super Admin');
      if (superAdmin) {
        const user: User = {
          id: superAdmin.id,
          username: superAdmin.username,
          role: superAdmin.role,
          fullName: superAdmin.fullName,
          email: superAdmin.email,
          photo: superAdmin.photo
        };
        setCurrentUser(user);
        setActiveTab('dashboard');
        logActivity('Super Admin Login', `${superAdmin.fullName} logged in via email`);
        addNotification(`Welcome back, ${superAdmin.fullName}! 🎉`);
        return { success: true };
      }
    }

    // Check all admins/managers by email (with password verification)
    const MANAGER_PASSWORD = 'Mayur@2505';
    const adminMatch = admins.find(a => a.email.toLowerCase() === emailLower);
    if (adminMatch) {
      // Manager must verify password
      if (adminMatch.role === 'Manager' && password !== MANAGER_PASSWORD) {
        return { success: false, error: 'Incorrect password for this account.' };
      }
      const user: User = { id: adminMatch.id, username: adminMatch.username, role: adminMatch.role, fullName: adminMatch.fullName, email: adminMatch.email, photo: adminMatch.photo };
      setCurrentUser(user);
      setActiveTab('dashboard');
      logActivity(`${adminMatch.role} Login`, `${adminMatch.fullName} logged in`);
      addNotification(`Welcome back, ${adminMatch.fullName}! 👋`);
      return { success: true };
    }

    // Check teachers by email (with optional password check)
    const teacherMatch = teachers.find(t => t.email.toLowerCase() === emailLower);
    if (teacherMatch) {
      if (teacherMatch.password && teacherMatch.password !== password) {
        return { success: false, error: 'Incorrect password for this account.' };
      }
      const user: User = { id: teacherMatch.id, username: teacherMatch.username, role: 'Teacher', fullName: teacherMatch.fullName, email: teacherMatch.email, photo: teacherMatch.photo };
      setCurrentUser(user);
      setActiveTab('dashboard');
      logActivity('Teacher Login', `${teacherMatch.fullName} logged in via email`);
      addNotification(`Welcome back, ${teacherMatch.fullName}!`);
      return { success: true };
    }

    return { success: false, error: 'No account found with that email, or incorrect password.' };
  };

  /** Login a user who registered via the Sign Up form (stored in localStorage) */
  const loginWithRegistered = (regUser: User & { role: UserRole }) => {
    setCurrentUser(regUser);
    setActiveTab('dashboard');
    logActivity('User Login', `${regUser.fullName} (${regUser.role}) signed in via registered account`);
    addNotification(`Welcome back, ${regUser.fullName}! 🎉`);
  };

  const login = (username: string, role: UserRole): boolean => {
    let userFound: User | null = null;
    
    if (role === 'Super Admin' || role === 'Admin' || role === 'Manager') {
      const match = admins.find(a => a.username.toLowerCase() === username.toLowerCase());
      if (match) {
        userFound = { id: match.id, username: match.username, role: match.role, fullName: match.fullName, email: match.email, photo: match.photo };
      }
    } else if (role === 'Teacher') {
      const match = teachers.find(t => t.username.toLowerCase() === username.toLowerCase());
      if (match) {
        userFound = { id: match.id, username: match.username, role: 'Teacher', fullName: match.fullName, email: match.email, photo: match.photo };
      }
    } else if (role === 'Student') {
      const match = students.find(s => s.username.toLowerCase() === username.toLowerCase());
      if (match) {
        userFound = { id: match.id, username: match.username, role: 'Student', fullName: match.fullName, email: match.email, photo: match.photo };
      }
    } else if (role === 'Security') {
      const match = guards.find(g => g.username.toLowerCase() === username.toLowerCase());
      if (match) {
        userFound = { id: match.id, username: match.username, role: 'Security', fullName: match.fullName, email: match.email, photo: match.photo };
      }
    }

    // Default Fallback/Demo Login if user types anything
    if (!userFound && username.trim() !== '') {
      userFound = {
        id: `DEMO-${Math.floor(Math.random() * 9000) + 1000}`,
        username: username,
        role: role,
        fullName: username.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        email: `${username}@edusys.com`,
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      };
    }

    if (userFound) {
      setCurrentUser(userFound);
      setActiveTab('dashboard');
      logActivity('User Login', `${userFound.fullName} (${userFound.role}) successfully logged in`);
      addNotification(`Welcome back, ${userFound.fullName}!`);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logActivity('User Logout', `${currentUser.fullName} logged out`);
    }
    setCurrentUser(null);
    setActiveTab('login');
  };

  const logActivity = (action: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `LOG${Math.floor(Math.random() * 9000) + 1000}`,
      userId: currentUser?.id || 'SYSTEM',
      userName: currentUser?.fullName || 'System',
      role: currentUser?.role || 'Super Admin',
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 100)); // cap at 100
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = `ST${Date.now()}`;
    const newStudent: Student = { ...studentData, id: newId };
    setStudents(prev => [...prev, newStudent]);
    fsSet('students', newId, newStudent as unknown as Record<string, unknown>);
    logActivity('Add Student', `Created student profile: ${newStudent.fullName} (${newId})`);
    addNotification(`New student ${newStudent.fullName} has been registered`);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    fsUpdate('students', updatedStudent.id, updatedStudent as unknown as Record<string, unknown>);
    logActivity('Update Student', `Updated student profile: ${updatedStudent.fullName} (${updatedStudent.id})`);
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    fsDelete('students', id);
    logActivity('Delete Student', `Deleted student profile: ${student?.fullName || id}`);
    addNotification(`Student ${student?.fullName || id} registration removed`);
  };

  // Teacher CRUD
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newId = `TC${Date.now()}`;
    const newTeacher: Teacher = { ...teacherData, id: newId };
    setTeachers(prev => [...prev, newTeacher]);
    fsSet('teachers', newId, newTeacher as unknown as Record<string, unknown>);
    logActivity('Add Teacher', `Created teacher profile: ${newTeacher.fullName} (${newId})`);
    addNotification(`New teacher ${newTeacher.fullName} joined the school`);
  };

  const updateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    fsUpdate('teachers', updatedTeacher.id, updatedTeacher as unknown as Record<string, unknown>);
    logActivity('Update Teacher', `Updated teacher profile: ${updatedTeacher.fullName} (${updatedTeacher.id})`);
  };

  const deleteTeacher = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    fsDelete('teachers', id);
    logActivity('Delete Teacher', `Deleted teacher profile: ${teacher?.fullName || id}`);
  };

  // Guards CRUD
  const addGuard = (guardData: Omit<Guard, 'id'>) => {
    const newId = `GD${Date.now()}`;
    const newGuard: Guard = { ...guardData, id: newId };
    setGuards(prev => [...prev, newGuard]);
    fsSet('guards', newId, newGuard as unknown as Record<string, unknown>);
    logActivity('Add Guard', `Created security guard profile: ${newGuard.fullName}`);
  };

  const updateGuard = (updatedGuard: Guard) => {
    setGuards(prev => prev.map(g => g.id === updatedGuard.id ? updatedGuard : g));
    fsUpdate('guards', updatedGuard.id, updatedGuard as unknown as Record<string, unknown>);
    logActivity('Update Guard', `Updated guard profile: ${updatedGuard.fullName}`);
  };

  const deleteGuard = (id: string) => {
    setGuards(prev => prev.filter(g => g.id !== id));
    fsDelete('guards', id);
    logActivity('Delete Guard', `Deleted guard ID: ${id}`);
  };

  // Admin CRUD
  const addAdmin = (adminData: Omit<Admin, 'id'>) => {
    const newId = `AD${admins.length + 1001}`;
    const newAdmin: Admin = {
      ...adminData,
      id: newId
    };
    setAdmins(prev => [...prev, newAdmin]);
    logActivity('Add Admin', `Created admin profile: ${newAdmin.fullName}`);
  };

  const updateAdmin = (updatedAdmin: Admin) => {
    setAdmins(prev => prev.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
    logActivity('Update Admin', `Updated admin profile: ${updatedAdmin.fullName}`);
  };

  const deleteAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    logActivity('Delete Admin', `Deleted admin ID: ${id}`);
  };

  // Get Pass Actions
  const createGetPass = (passData: Omit<GetPass, 'id' | 'status' | 'approvals' | 'qrCode'>) => {
    const newId = `GP${Date.now()}`;
    const newPass: GetPass = {
      ...passData,
      id: newId,
      status: 'Pending',
      approvals: { teacher: 'Pending', admin: 'Pending', security: 'Pending' },
      qrCode: `${newId}-${passData.studentName.replace(/\s+/g, '-').toUpperCase()}`
    };
    setGetPassRequests(prev => [newPass, ...prev]);
    fsSet('getpass', newId, newPass as unknown as Record<string, unknown>);
    logActivity('Create Get Pass', `Student ${passData.studentName} generated exit request: ${newId}`);
    addNotification(`New Get Pass request from ${passData.studentName}`);
  };

  const updateGetPassStatus = (id: string, reviewerRole: 'teacher' | 'admin' | 'security', status: 'Approved' | 'Rejected') => {
    setGetPassRequests(prev => prev.map(pass => {
      if (pass.id !== id) return pass;
      
      const newApprovals = {
        ...pass.approvals,
        [reviewerRole]: status
      };

      // Rules:
      // If any role rejects, status becomes Rejected
      // If Teacher approves, it stays Pending until Admin approves, then it goes to Approved.
      // Or in simplified workflow:
      // If all three approve (or Teacher + Admin approve), status is Approved.
      let finalStatus: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
      if (newApprovals.teacher === 'Rejected' || newApprovals.admin === 'Rejected' || newApprovals.security === 'Rejected') {
        finalStatus = 'Rejected';
      } else if (newApprovals.teacher === 'Approved' && newApprovals.admin === 'Approved') {
        finalStatus = 'Approved';
      }

      return {
        ...pass,
        approvals: newApprovals,
        status: finalStatus
      };
    }));

    const targetPass = getPassRequests.find(p => p.id === id);
    logActivity('Get Pass Approval', `Role ${reviewerRole} marked Get Pass ${id} (${targetPass?.studentName}) as ${status}`);
    
    if (status === 'Approved') {
      addNotification(`Get Pass ${id} has been approved by ${reviewerRole}`);
    }
  };

  const scanGetPassQR = (qrCode: string, scanType: 'exit' | 'entry') => {
    const pass = getPassRequests.find(p => p.qrCode === qrCode);
    
    if (!pass) {
      return { success: false, message: 'Invalid or unknown QR Code.' };
    }

    if (pass.status !== 'Approved') {
      return { success: false, message: `Gate pass is ${pass.status.toUpperCase()}. Cannot exit.` };
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setGetPassRequests(prev => prev.map(p => {
      if (p.id === pass.id) {
        if (scanType === 'exit') {
          return { ...p, exitTime: timeString, approvals: { ...p.approvals, security: 'Approved' } };
        } else {
          return { ...p, entryTime: timeString };
        }
      }
      return p;
    }));

    logActivity('QR Code Scan', `Security scanned pass ${pass.id} for ${scanType.toUpperCase()} at ${timeString}`);
    addNotification(`${pass.studentName} gate ${scanType} recorded at ${timeString}`);

    return { 
      success: true, 
      message: `Successfully verified! ${pass.studentName} logged for ${scanType.toUpperCase()} at ${timeString}.` 
    };
  };

  // Attendance marking
  const saveAttendance = (date: string, classVal: string, division: string, records: { [studentId: string]: AttendanceStatus }) => {
    setAttendanceRecords(prev => {
      // Check if record exists for this date, class, division
      const index = prev.findIndex(r => r.date === date && r.classVal === classVal && r.division === division);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { date, classVal, division, records };
        return updated;
      } else {
        return [{ date, classVal, division, records }, ...prev];
      }
    });

    const presentCount = Object.values(records).filter(v => v === 'Present').length;
    const totalCount = Object.keys(records).length;
    
    logActivity('Mark Attendance', `Recorded attendance for ${classVal}-${division} on ${date}. Present: ${presentCount}/${totalCount}`);
    addNotification(`Attendance marked for ${classVal}-${division}`);
  };

  // System Configs
  const updateSettings = (updatedSettings: SchoolSettings) => {
    setSettings(updatedSettings);
    logActivity('Update Settings', 'School settings were modified.');
    addNotification('Settings saved successfully');
  };

  const updateDesignConfig = (updatedConfig: Partial<DesignConfig>) => {
    setDesignConfig(prev => ({
      ...prev,
      ...updatedConfig
    }));
    // Note: CSS Variable injection happens in useEffect
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (text: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => [
      { id: Date.now().toString(), text, time: timeString, read: false },
      ...prev
    ]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <StateContext.Provider value={{
      currentUser,
      activeTab,
      setActiveTab,
      students,
      teachers,
      guards,
      admins,
      getPassRequests,
      attendanceRecords,
      activityLogs,
      settings,
      designConfig,
      notifications,
      
      login,
      loginWithEmail,
      loginWithRegistered,
      logout,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addGuard,
      updateGuard,
      deleteGuard,
      addAdmin,
      updateAdmin,
      deleteAdmin,
      createGetPass,
      updateGetPassStatus,
      scanGetPassQR,
      saveAttendance,
      updateSettings,
      updateDesignConfig,
      logActivity,
      clearNotifications,
      addNotification,
      markNotificationsAsRead
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
