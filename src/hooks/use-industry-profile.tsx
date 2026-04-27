

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import type { IndustryProfile } from '@/lib/types';

interface IndustryProfileContextType {
  profile: IndustryProfile | null;
  saveProfile: (userId: string, newProfile: IndustryProfile) => void;
  isLoading: boolean;
  loadProfileForUser: (userId: string) => Promise<void>;
  clearProfile: () => void;
}

const IndustryProfileContext = createContext<IndustryProfileContextType | undefined>(undefined);


const getStorageKey = (userId: string) => `industry-profile-${userId}`;

export const IndustryProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<IndustryProfile | null>(null);
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
      console.error('Failed to load industry profile from local storage:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback((userId: string, newProfile: IndustryProfile) => {
    try {
      window.localStorage.setItem(getStorageKey(userId), JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Failed to save industry profile to local storage:', error);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setIsLoading(false);
  }, []);

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
