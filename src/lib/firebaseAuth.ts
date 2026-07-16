'use client';

// Firebase Auth Service — EduSys
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

// Register new user with Firebase Auth + Firestore profile
export const firebaseRegister = async (data: RegisterData) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    // Update display name
    await updateProfile(cred.user, { displayName: data.fullName });

    // Save user profile to Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      role: data.role,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=4F46E5&color=fff&size=150`,
      createdAt: serverTimestamp(),
      status: 'Active'
    });

    return { success: true, uid: cred.user.uid };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, error: 'This email is already registered. Please sign in.' };
    }
    if (error.code === 'auth/weak-password') {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    return { success: false, error: error.message || 'Registration failed. Please try again.' };
  }
};

// Sign in with Firebase Auth
export const firebaseSignIn = async (email: string, password: string) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: cred.user };
  } catch (err: unknown) {
    const error = err as { code?: string };
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      return { success: false, error: 'Invalid email or password.' };
    }
    if (error.code === 'auth/too-many-requests') {
      return { success: false, error: 'Too many attempts. Please try again later.' };
    }
    return { success: false, error: 'Sign in failed. Please try again.' };
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch {
    return null;
  }
};

// Sign out
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch {
    return { success: false };
  }
};

// Auth state listener
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
