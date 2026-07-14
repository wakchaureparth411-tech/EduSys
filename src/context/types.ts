export type UserRole = 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'Security';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
  email: string;
  photo?: string;
}

export interface Student {
  id: string;
  photo: string;
  fullName: string;
  rollNumber: string;
  classVal: string;
  division: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  mobile: string;
  parentPhone: string;
  address: string;
  email: string;
  username: string;
  password?: string;
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface Teacher {
  id: string;
  photo: string;
  fullName: string;
  subject: string;
  qualification: string;
  experience: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  username: string;
  password?: string;
  salary: string;
  joiningDate: string;
  status: 'Active' | 'Leave' | 'Inactive';
}

export interface Guard {
  id: string;
  photo: string;
  fullName: string;
  phone: string;
  email: string;
  bloodGroup: string;
  education: string;
  work: string;
  address: string;
  dob: string;
  gender: string;
  emergencyContact: string;
  username: string;
  password?: string;
  role: 'Security';
  status: 'On Duty' | 'Off Duty' | 'On Leave';
}

export interface Admin {
  id: string;
  photo: string;
  fullName: string;
  phone: string;
  email: string;
  bloodGroup: string;
  education: string;
  work: string;
  address: string;
  dob: string;
  gender: string;
  emergencyContact: string;
  username: string;
  password?: string;
  role: 'Super Admin' | 'Admin';
  status: 'Active' | 'Inactive';
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  classVal: string;
  division: string;
  records: {
    [studentId: string]: AttendanceStatus;
  };
}

export interface GetPass {
  id: string;
  studentId: string;
  studentName: string;
  classVal: string;
  division: string;
  reason: string;
  date: string;
  time: string;
  destination: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvals: {
    teacher: 'Pending' | 'Approved' | 'Rejected';
    admin: 'Pending' | 'Approved' | 'Rejected';
    security: 'Pending' | 'Approved' | 'Rejected';
  };
  qrCode: string; // Code representation for scanning
  exitTime?: string;
  entryTime?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  timestamp: string;
  details?: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolLogo: string;
  address: string;
  email: string;
  phone: string;
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
}

export interface DesignConfig {
  accentColor: string; // #4F46E5
  secondaryColor: string; // #7C3AED
  radius: number; // e.g. 18
  blur: number; // e.g. 16
  glassOpacity: number; // e.g. 0.7 (corresponds to card opacity)
  gradientStrength: number; // 0-100
  fontFamily: string; // Poppins, Inter, Outfit, Roboto
}
