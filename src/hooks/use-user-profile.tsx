

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import type { StudentProfile } from '@/lib/types';

interface StudentProfileContextType {
  profile: StudentProfile | null;
  saveProfile: (userId: string, newProfile: StudentProfile) => void;
  isLoading: boolean;
  loadProfileForUser: (userId: string) => Promise<void>;
  clearProfile: () => void;
}

const StudentProfileContext = createContext<StudentProfileContextType | undefined>(undefined);


const getStorageKey = (userId: string) => `student-profile-${userId}`;

export const StudentProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfileForUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const item = window.localStorage.getItem(getStorageKey(userId));
      if (item) {
        setProfile(JSON.parse(item));
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to load profile from local storage:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback((userId: string, newProfile: StudentProfile) => {
    try {
      const profileToSave = { ...newProfile, resumeFilename: newProfile.resumeFilename || 'resume.pdf' };
      window.localStorage.setItem(getStorageKey(userId), JSON.stringify(profileToSave));
      setProfile(profileToSave);
    } catch (error) {
      console.error('Failed to save profile to local storage:', error);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setIsLoading(false);
  }, []);

  return (
    <StudentProfileContext.Provider value={{ profile, saveProfile, isLoading, loadProfileForUser, clearProfile }}>
        {children}
    </StudentProfileContext.Provider>
  )
}

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);
  if (context === undefined) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider');
  }
  return context;
}
