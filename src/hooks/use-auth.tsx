
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { useStudentProfile } from './use-student-profile';
import { useIndustryProfile } from './use-industry-profile';
import { useToast } from './use-toast';
import type { IndustryProfile } from '@/lib/types';


// --- Helper Functions ---
const AUTH_STORAGE_KEY = 'firebase-auth-user';
const USER_TYPE_STORAGE_KEY = 'firebase-auth-user-type';

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

const getStoredUserType = (): 'student' | 'industry' | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(USER_TYPE_STORAGE_KEY) as 'student' | 'industry' | null;
}

const setStoredUser = (user: User | null, userType: 'student' | 'industry' | null) => {
  if (typeof window === 'undefined') return;
  if (user && userType) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.localStorage.setItem(USER_TYPE_STORAGE_KEY, userType);
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(USER_TYPE_STORAGE_KEY);
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
  userType: 'student' | 'industry' | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string, type?: 'student' | 'industry') => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signUpIndustryUser: (data: Omit<IndustryProfile, 'email'> & { email: string, password?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'student' | 'industry' | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadProfileForUser: loadStudentProfile, clearProfile: clearStudentProfile } = useStudentProfile();
  const { loadProfileForUser: loadIndustryProfile, saveProfile: saveIndustryProfile, clearProfile: clearIndustryProfile } = useIndustryProfile();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedUser = getStoredUser();
      const storedUserType = getStoredUserType();
      if (storedUser && storedUserType) {
        setUser(storedUser);
        setUserType(storedUserType);
        if (storedUserType === 'student') {
            await loadStudentProfile(storedUser.uid);
        } else if (storedUserType === 'industry') {
            await loadIndustryProfile(storedUser.uid);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [loadStudentProfile, loadIndustryProfile]);

  const handleLogin = useCallback(async (newUser: User, type: 'student' | 'industry') => {
    setStoredUser(newUser, type);
    setUser(newUser);
    setUserType(type);
    if (type === 'student') {
        await loadStudentProfile(newUser.uid);
    } else {
        await loadIndustryProfile(newUser.uid);
    }
  }, [loadStudentProfile, loadIndustryProfile]);


  const signInWithEmail = async (email: string, pass: string, type: 'student' | 'industry' = 'student') => {
    setLoading(true);
    try {
      // Any email/password is valid in prototype mode
      const mockUser = createMockUser(email);
      await handleLogin(mockUser, type);
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
     // Any email/password is valid in prototype mode
      const mockUser = createMockUser(email);
      await handleLogin(mockUser, 'student');
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

  const signUpIndustryUser = async (data: Omit<IndustryProfile, 'email'> & { email: string, password?: string }) => {
    setLoading(true);
    try {
        const mockUser = createMockUser(data.email, data.name);
        await handleLogin(mockUser, 'industry');
        // Save the profile data after login
        await saveIndustryProfile(mockUser.uid, {
            name: data.name,
            email: data.email,
            companyName: data.companyName,
            position: data.position,
        });
    } catch (error) {
        console.error("Industry sign up failed:", error);
        toast({
           variant: 'destructive',
           title: 'Sign Up Failed',
           description: 'An unexpected error occurred.',
       })
    } finally {
        setLoading(false);
    }
  }

  const signOut = async () => {
    setLoading(true);
    setUser(null);
    setUserType(null);
    setStoredUser(null, null);
    clearStudentProfile();
    clearIndustryProfile();
    setLoading(false);
  };
  
  return (
    <AuthContext.Provider value={{ user, userType, loading, signInWithEmail, signUpWithEmail, signOut, signUpIndustryUser }}>
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
