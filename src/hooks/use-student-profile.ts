
'use client';

import { useState, useCallback } from 'react';
import type { StudentProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

const getStorageKey = (userId: string) => `student-profile-${userId}`;

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadProfileForUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const item = window.localStorage.getItem(getStorageKey(userId));
      if (item) {
        setProfile(JSON.parse(item));
      } else {
        setProfile(null);
        // We don't auto-redirect here anymore, let pages decide
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

  return { profile, saveProfile, isLoading, loadProfileForUser, clearProfile };
}
