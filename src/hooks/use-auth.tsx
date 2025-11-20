
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';


// --- Helper Functions ---
const AUTH_STORAGE_KEY = 'firebase-auth-user';

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

const setStoredUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

// Mock a user object for prototype
const createMockUser = (email: string, name?: string): User => ({
  uid: email,
  email: email,
  displayName: name || 'Prototype User',
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


// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadProfileForUser, clearProfile } = useStudentProfile();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        await loadProfileForUser(storedUser.uid);
      }
      setLoading(false);
    };
    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthSuccess = useCallback(async (newUser: User) => {
      setUser(newUser);
      setStoredUser(newUser);
      await loadProfileForUser(newUser.uid);
  },[loadProfileForUser]);


  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const mockUser = createMockUser(email);
      await handleAuthSuccess(mockUser);
    } catch (error) {
       console.error("Sign in failed:", error);
       toast({
           variant: 'destructive',
           title: 'Sign In Failed',
           description: 'An unexpected error occurred.',
       })
    } finally {
        setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
     const mockUser = createMockUser(email);
     await handleAuthSuccess(mockUser);
    } catch (error) {
       console.error("Sign up failed:", error);
       toast({
           variant: 'destructive',
           title: 'Sign Up Failed',
           description: 'An unexpected error occurred.',
       })
    } finally {
        setLoading(false);
    }
  };


  const signOut = async () => {
    setLoading(true);
    setUser(null);
    setStoredUser(null);
    clearProfile();
    setLoading(false);
    // Go to home page after sign out
    window.location.href = '/';
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
