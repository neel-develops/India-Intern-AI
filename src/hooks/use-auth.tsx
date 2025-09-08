
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { useStudentProfile } from './use-student-profile.tsx';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock a user object since we are bypassing actual Firebase Auth
const createMockUser = (email: string): User => ({
  uid: email, // Use email as UID for simplicity
  email: email,
  displayName: 'Prototype User',
  photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'password',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadProfileForUser, clearProfile } = useStudentProfile();
  
  const handleLogin = useCallback(async (newUser: User) => {
    setUser(newUser);
    await loadProfileForUser(newUser.uid);
    setLoading(false);
  },[loadProfileForUser]);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    // Any email/password is valid in prototype mode
    const mockUser = createMockUser(email);
    await handleLogin(mockUser);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
     // Any email/password is valid in prototype mode
    const mockUser = createMockUser(email);
    await handleLogin(mockUser);
  };

  const signOut = async () => {
    setLoading(true);
    setUser(null);
    clearProfile();
    setLoading(false);
  };

  useEffect(() => {
    // On initial load, if there's no user, we should stop loading.
    // This handles the case where the app is loaded for the first time without any user session.
    if (!user) {
        setLoading(false);
    }
  }, [user]);

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
