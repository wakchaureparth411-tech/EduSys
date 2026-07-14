/**
 * authDB.ts
 * Client-side "database" using localStorage to store registered users.
 * Provides sign-up validation, login verification, and user persistence.
 */

import { UserRole } from '@/context/types';

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  username: string;
  passwordHash: string; // simple base64 encode for demo (not real crypto)
  role: UserRole;
  photo: string;
  createdAt: string;
}

const DB_KEY = 'edusys_registered_users';

/** Simple reversible obfuscation for demo purposes */
const encodePassword = (password: string): string => {
  return btoa(password);
};

const verifyPassword = (password: string, hash: string): boolean => {
  try {
    return atob(hash) === password;
  } catch {
    return false;
  }
};

/** Load all registered users from localStorage */
export const getAllUsers = (): RegisteredUser[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Save all users to localStorage */
const saveAllUsers = (users: RegisteredUser[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};

/** Register a new user. Returns error string or null on success. */
export const registerUser = (
  fullName: string,
  email: string,
  username: string,
  password: string,
  role: UserRole
): { success: boolean; error?: string; user?: RegisteredUser } => {
  const users = getAllUsers();

  // Validation
  if (!fullName.trim() || !email.trim() || !username.trim() || !password.trim()) {
    return { success: false, error: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // Check duplicates
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'This username is already taken. Please choose another.' };
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser: RegisteredUser = {
    id: `REG-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    username: username.trim().toLowerCase(),
    passwordHash: encodePassword(password),
    role,
    photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=4F46E5&color=fff&size=150`,
    createdAt: new Date().toISOString()
  };

  saveAllUsers([...users, newUser]);
  return { success: true, user: newUser };
};

/** Authenticate a user by username/email + password. */
export const loginUser = (
  usernameOrEmail: string,
  password: string
): { success: boolean; error?: string; user?: RegisteredUser } => {
  const users = getAllUsers();
  const lower = usernameOrEmail.trim().toLowerCase();

  const found = users.find(
    u => u.username === lower || u.email === lower
  );

  if (!found) {
    return { success: false, error: 'No account found with that username or email.' };
  }

  if (!verifyPassword(password, found.passwordHash)) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  return { success: true, user: found };
};

/** Get count of registered users */
export const getUserCount = (): number => getAllUsers().length;
