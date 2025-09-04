
'use client';

import { useAuth } from '@/hooks/use-auth';
import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useStudentProfile } from '@/hooks/use-student-profile';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const { profile, isLoading: isProfileLoading } = useStudentProfile(auth.user?.uid);
  
  if (auth.user && !isProfileLoading && !profile) {
    router.push('/profile');
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
