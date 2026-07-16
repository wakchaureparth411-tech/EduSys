// Firebase Configuration — EduSys Smart Campus
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDj29pm12DjhUBG3U80OgofxqHsaxA7Dpg",
  authDomain: "edusys-e78f9.firebaseapp.com",
  projectId: "edusys-e78f9",
  storageBucket: "edusys-e78f9.firebasestorage.app",
  messagingSenderId: "283020755745",
  appId: "1:283020755745:web:f4b2df9328e6f263083460",
  measurementId: "G-WGLHHN5EV8"
};

// Prevent duplicate initialization in Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
