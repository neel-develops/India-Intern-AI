
'use client';

import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import type { StudentProfile } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface StudentProfileContextType {
  profile: StudentProfile | null;
  saveProfile: (userId: string, newProfile: StudentProfile) => void;
  isLoading: boolean;
  clearProfile: () => void;
}

const StudentProfileContext = createContext<StudentProfileContextType | undefined>(undefined);

const getStorageKey = (userId: string) => `student-profile-${userId}`;

export const StudentProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback((userId: string) => {
    setIsLoading(true);
    const item = window.localStorage.getItem(getStorageKey(userId));
    setProfile(item ? JSON.parse(item) : null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile(user.uid);
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user, loadProfile]);

  const saveProfile = useCallback((userId: string, newProfile: StudentProfile) => {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(newProfile));
    setProfile(newProfile);
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  return (
    <StudentProfileContext.Provider value={{ profile, saveProfile, isLoading, clearProfile }}>
        {children}
    </StudentProfileContext.Provider>
  )
}

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);
  if (context === undefined) throw new Error('useStudentProfile must be used within StudentProfileProvider');
  return context;
}
