// db.ts — Firebase Firestore Session Manager for CONTROLSAI
// Replaces local IndexedDB with secure cloud storage.

import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, writeBatch, where, limit } from 'firebase/firestore';
import { dbFirestore } from './firebase';
import type { Session } from './types';

export async function checkUserAccess(uid: string, email: string): Promise<{ approved: boolean }> {
  try {
    const docRef = doc(dbFirestore, `users/${uid}`);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.status === 'approved' || data.status === 'accepted') return { approved: true };
      
      // If not approved, check if their email was approved in the access_requests waitlist
      const q = query(collection(dbFirestore, 'access_requests'), where('email', '==', email), limit(1));
      const reqSnap = await getDocs(q);
      
      if (!reqSnap.empty) {
        const reqData = reqSnap.docs[0].data();
        if (reqData.status === 'approved' || reqData.status === 'accepted') {
          // Auto-promote them to approved in the users collection
          await setDoc(docRef, { ...data, status: 'approved', approvedAt: Date.now() }, { merge: true });
          return { approved: true };
        }
      }
      
      return { approved: false };
    } else {
      // New user logging in, check if they were pre-approved in the waitlist
      const q = query(collection(dbFirestore, 'access_requests'), where('email', '==', email), limit(1));
      const reqSnap = await getDocs(q);
      let initialStatus = 'pending';

      if (!reqSnap.empty) {
        const reqData = reqSnap.docs[0].data();
        if (reqData.status === 'approved' || reqData.status === 'accepted') {
          initialStatus = 'approved';
        }
      }

      await setDoc(docRef, {
        email,
        status: initialStatus,
        createdAt: Date.now()
      });
      return { approved: initialStatus === 'approved' };
    }
  } catch (error) {
    console.error("Access check failed", error);
    return { approved: false };
  }
}

export async function fetchUserSessions(userId: string): Promise<Session[]> {
  try {
    const q = query(
      collection(dbFirestore, `users/${userId}/sessions`),
      orderBy('updatedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Session);
  } catch (err) {
    console.error("Firestore Error (fetchUserSessions):", err);
    return [];
  }
}

export async function syncUserSession(userId: string, session: Session): Promise<void> {
  if (!userId) return;
  try {
    const sessionRef = doc(dbFirestore, `users/${userId}/sessions/${session.id}`);
    await setDoc(sessionRef, {
      ...session,
      updatedAt: Date.now()
    });
  } catch (err) {
    console.error("Firestore Error (syncUserSession):", err);
  }
}

export async function removeUserSession(userId: string, sessionId: string): Promise<void> {
  if (!userId) return;
  try {
    const sessionRef = doc(dbFirestore, `users/${userId}/sessions/${sessionId}`);
    await deleteDoc(sessionRef);
  } catch (err) {
    console.error("Firestore Error (removeUserSession):", err);
  }
}

export async function clearAllUserSessions(userId: string, sessions: Session[]): Promise<void> {
  if (!userId) return;
  try {
    const batch = writeBatch(dbFirestore);
    sessions.forEach(s => {
      const ref = doc(dbFirestore, `users/${userId}/sessions/${s.id}`);
      batch.delete(ref);
    });
    await batch.commit();
  } catch (err) {
    console.error("Firestore Error (clearAllUserSessions):", err);
  }
}
