
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStudentProfile } from './use-student-profile';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadProfileForUser, clearProfile } = useStudentProfile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadProfileForUser(user.uid);
      } else {
        setUser(null);
        clearProfile();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadProfileForUser, clearProfile]);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
        return await signInWithEmailAndPassword(auth, email, pass);
    } finally {
        setLoading(false);
    }
  }

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
        return await createUserWithEmailAndPassword(auth, email, pass);
    } finally {
        setLoading(false);
    }
  }


  const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
