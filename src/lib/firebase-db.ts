import {
  collection, doc, setDoc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, getDoc, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { internships as defaultInternships } from './data';
import type { Internship, Application, StudentProfile, IndustryProfile, Notification } from './types';

const COL = {
  internships: 'internships',
  applications: 'applications',
  meta: '_meta',
  users: 'users',
} as const;

// ─── One-time seed ────────────────────────────────────────────────────────────
let _seeded = false;
export async function seedInternshipsIfEmpty(): Promise<void> {
  if (_seeded) return;
  try {
    const metaRef = doc(db, COL.meta, 'seeded');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists()) { _seeded = true; return; }
    await Promise.all(
      defaultInternships.map(i =>
        setDoc(doc(db, COL.internships, i.id), {
          ...i, recruiterId: null, createdAt: serverTimestamp(),
        })
      )
    );
    await setDoc(metaRef, { seededAt: serverTimestamp() });
    _seeded = true;
  } catch (err) {
    console.error('Firestore seed error (non-fatal):', err);
  }
}

// ─── Internships ──────────────────────────────────────────────────────────────
export function subscribeToAllInternships(cb: (data: Internship[]) => void): () => void {
  return onSnapshot(
    collection(db, COL.internships),
    snap => cb(snap.docs.map(d => ({ ...d.data(), id: d.id } as Internship))),
    err => {
        console.error('internships listener:', err);
        cb([]);
    }
  );
}

export function subscribeToRecruiterInternships(uid: string, cb: (data: Internship[]) => void): () => void {
  const q = query(collection(db, COL.internships), where('recruiterId', '==', uid));
  return onSnapshot(q,
    snap => cb(snap.docs.map(d => ({ ...d.data(), id: d.id } as Internship))),
    err => {
        console.error('recruiter internships listener:', err);
        cb([]);
    }
  );
}

export function subscribeToCompanyInternships(companyName: string, cb: (data: Internship[]) => void): () => void {
  const q = query(collection(db, COL.internships), where('company', '==', companyName));
  return onSnapshot(q,
    snap => cb(snap.docs.map(d => ({ ...d.data(), id: d.id } as Internship))),
    err => {
        console.error('company internships listener:', err);
        cb([]);
    }
  );
}

export async function fsAddInternship(data: Omit<Internship, 'id'> & { recruiterId: string }): Promise<void> {
  await addDoc(collection(db, COL.internships), { ...data, createdAt: serverTimestamp() });
}

export async function fsUpdateInternship(id: string, data: Partial<Internship>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(doc(db, COL.internships, id), data as any);
}

export async function fsDeleteInternship(id: string): Promise<void> {
  await deleteDoc(doc(db, COL.internships, id));
}

// ─── Applications ─────────────────────────────────────────────────────────────
export function subscribeToStudentApplications(
  studentEmail: string,
  cb: (data: Application[]) => void
): () => void {
  const q = query(collection(db, COL.applications), where('studentEmail', '==', studentEmail));
  return onSnapshot(q,
    snap => cb(snap.docs
      .map(d => ({ ...d.data(), id: d.id } as Application))
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    ),
    err => {
        console.error('student apps listener:', err);
        cb([]);
    }
  );
}

export function subscribeToInternshipApplications(
  internshipId: string,
  cb: (data: Application[]) => void
): () => void {
  const q = query(collection(db, COL.applications), where('internshipId', '==', internshipId));
  return onSnapshot(q,
    snap => cb(snap.docs
      .map(d => ({ ...d.data(), id: d.id } as Application))
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    ),
    err => {
        console.error('internship apps listener:', err);
        cb([]);
    }
  );
}

// Firestore 'in' supports max 30 items — chunk for safety
export function subscribeToRecruiterApplications(
  internshipIds: string[],
  cb: (data: Application[]) => void
): () => void {
  if (internshipIds.length === 0) { cb([]); return () => {}; }
  const chunks: string[][] = [];
  for (let i = 0; i < internshipIds.length; i += 30) chunks.push(internshipIds.slice(i, i + 30));
  const store = new Map<number, Application[]>();
  const emit = () => {
    const all: Application[] = [];
    store.forEach(v => all.push(...v));
    cb(all.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()));
  };
  const unsubs = chunks.map((chunk, idx) => {
    const q = query(collection(db, COL.applications), where('internshipId', 'in', chunk));
    return onSnapshot(q, snap => {
      store.set(idx, snap.docs.map(d => ({ ...d.data(), id: d.id } as Application)));
      emit();
    }, err => {
        console.error('recruiter apps listener:', err);
        cb([]);
    });
  });
  return () => unsubs.forEach(u => u());
}

export function subscribeToCompanyApplications(
  companyName: string,
  cb: (data: Application[]) => void
): () => void {
  const q = query(
    collection(db, COL.applications),
    where('companyName', '==', companyName),
    orderBy('appliedDate', 'desc')
  );
  
  return onSnapshot(q, (snap) => {
    const apps = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Application));
    cb(apps);
  }, (err) => {
    console.error('Company applications listener error:', err);
    cb([]);
  });
}

export async function fsAddApplication(data: Omit<Application, 'id'>): Promise<void> {
  // Deduplication check
  const q = query(
    collection(db, COL.applications),
    where('internshipId', '==', data.internshipId),
    where('studentEmail', '==', data.studentEmail)
  );
  const snap = await getDocs(q);
  if (!snap.empty) return;
  await addDoc(collection(db, COL.applications), { ...data, createdAt: serverTimestamp() });
}

export async function fsUpdateApplicationStatus(id: string, status: Application['status']): Promise<void> {
  await updateDoc(doc(db, COL.applications, id), { status });
}

// ─── Users & Profiles ─────────────────────────────────────────────────────────

export interface UserDocument {
  userType?: 'student' | 'industry' | null;
  studentProfile?: StudentProfile | null;
  industryProfile?: IndustryProfile | null;
  savedInternships?: string[];
  updatedAt?: any;
}

export function subscribeToUserDocument(uid: string, cb: (data: UserDocument | null) => void): () => void {
  return onSnapshot(
    doc(db, COL.users, uid),
    (snap) => {
      if (snap.exists()) {
        cb(snap.data() as UserDocument);
      } else {
        cb(null);
      }
    },
    (err) => {
        console.error('user doc listener:', err);
        cb(null);
    }
  );
}

export async function fsUpdateUserDocument(uid: string, data: Partial<UserDocument>): Promise<void> {
  const userRef = doc(db, COL.users, uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, { ...data, updatedAt: serverTimestamp() });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(userRef, { ...data as any, updatedAt: serverTimestamp() });
  }
}

export async function fsGetUserDocument(uid: string): Promise<UserDocument | null> {
  const snap = await getDoc(doc(db, COL.users, uid));
  if (snap.exists()) return snap.data() as UserDocument;
  return null;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function subscribeToUserNotifications(uid: string, cb: (data: Notification[]) => void): () => void {
  const notificationsRef = collection(db, COL.users, uid, 'notifications');
  return onSnapshot(
    notificationsRef,
    (snap) => {
      const notifs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Notification));
      // Sort descending by date
      notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      cb(notifs);
    },
    (err) => {
        console.error('notifications listener:', err);
        cb([]);
    }
  );
}

export async function fsAddNotification(uid: string, data: Omit<Notification, 'id'>): Promise<void> {
  await addDoc(collection(db, COL.users, uid, 'notifications'), data);
}

export async function fsUpdateNotification(uid: string, notifId: string, data: Partial<Notification>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(doc(db, COL.users, uid, 'notifications', notifId), data as any);
}
