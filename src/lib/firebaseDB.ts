// Firestore Database Service — EduSys
import {
  collection, doc, getDocs, addDoc, updateDoc,
  deleteDoc, setDoc, onSnapshot, query, orderBy,
  serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Generic helpers ────────────────────────────────────────────────

export const fsGetAll = async (col: string) => {
  try {
    const snap = await getDocs(collection(db, col));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
};

export const fsAdd = async (col: string, data: Record<string, unknown>) => {
  try {
    const ref = await addDoc(collection(db, col), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { success: true, id: ref.id };
  } catch (e: unknown) {
    return { success: false, error: String(e) };
  }
};

export const fsSet = async (col: string, id: string, data: Record<string, unknown>) => {
  try {
    await setDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: String(e) };
  }
};

export const fsUpdate = async (col: string, id: string, data: Record<string, unknown>) => {
  try {
    await setDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: String(e) };
  }
};

export const fsDelete = async (col: string, id: string) => {
  try {
    await deleteDoc(doc(db, col, id));
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: String(e) };
  }
};

// ─── Real-time listener ──────────────────────────────────────────────

export const fsListen = (
  col: string,
  callback: (data: Record<string, unknown>[]) => void
) => {
  const q = query(collection(db, col));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => {
      const data = d.data();
      // Convert Firestore Timestamps to strings
      Object.keys(data).forEach(k => {
        if (data[k] instanceof Timestamp) {
          data[k] = (data[k] as Timestamp).toDate().toISOString();
        }
      });
      return { id: d.id, ...data };
    });
    callback(items);
  }, () => {
    // On error, return empty
    callback([]);
  });
};

// ─── School Settings ─────────────────────────────────────────────────

export const saveSchoolSettings = async (settings: Record<string, unknown>) => {
  await fsSet('settings', 'school', settings);
};

export const getSchoolSettings = async () => {
  const snap = await getDocs(collection(db, 'settings'));
  if (!snap.empty) {
    return snap.docs[0].data();
  }
  return null;
};
