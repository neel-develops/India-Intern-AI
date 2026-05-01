import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import type { IndustryProfile } from '@/lib/types';
import { fsGetUserDocument, fsUpdateUserDocument } from '@/lib/firebase-db';
import { useAuth } from './use-auth';

interface IndustryProfileContextType {
  profile: IndustryProfile | null;
  saveProfile: (userId: string, newProfile: IndustryProfile) => Promise<void>;
  isLoading: boolean;
  loadProfileForUser: (userId: string) => Promise<void>;
  clearProfile: () => void;
}

const IndustryProfileContext = createContext<IndustryProfileContextType | undefined>(undefined);

export const IndustryProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<IndustryProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfileForUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const doc = await fsGetUserDocument(userId);
      setProfile(doc?.industryProfile || null);
    } catch (error) {
      console.error('Failed to load industry profile from Firestore:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (userId: string, newProfile: IndustryProfile) => {
    try {
      await fsUpdateUserDocument(userId, { industryProfile: newProfile });
      setProfile(newProfile);
    } catch (error) {
      console.error('Failed to save industry profile to Firestore:', error);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setIsLoading(false);
  }, []);

  const { user, userType } = useAuth();

  useEffect(() => {
    if (user && userType === 'industry') {
      loadProfileForUser(user.uid);
    } else if (!user) {
      clearProfile();
    } else {
      setIsLoading(false);
    }
  }, [user, userType, loadProfileForUser, clearProfile]);

  return (
    <IndustryProfileContext.Provider value={{ profile, saveProfile, isLoading, loadProfileForUser, clearProfile }}>
        {children}
    </IndustryProfileContext.Provider>
  )
}

export function useIndustryProfile() {
  const context = useContext(IndustryProfileContext);
  if (context === undefined) {
    throw new Error('useIndustryProfile must be used within a IndustryProfileProvider');
  }
  return context;
}
