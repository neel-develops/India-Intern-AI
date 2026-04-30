import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import type { StudentProfile } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { subscribeToUserDocument, fsUpdateUserDocument } from '@/lib/firebase-db';

interface StudentProfileContextType {
  profile: StudentProfile | null;
  saveProfile: (userId: string, newProfile: StudentProfile) => Promise<void>;
  isLoading: boolean;
  clearProfile: () => void;
}

const StudentProfileContext = createContext<StudentProfileContextType | undefined>(undefined);

export const StudentProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const unsub = subscribeToUserDocument(user.uid, (data) => {
        setProfile(data?.studentProfile || null);
        setIsLoading(false);
      });
      return () => unsub();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user]);

  const saveProfile = useCallback(async (userId: string, newProfile: StudentProfile) => {
    try {
      await fsUpdateUserDocument(userId, { studentProfile: newProfile });
    } catch (error) {
      console.error('Failed to save student profile to Firestore:', error);
      throw error; // re-throw so the form can show an error toast
    }
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
