
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { StudentProfile } from '@/lib/types';
import { studentProfiles } from '@/lib/data';

export function useStudentProfile(userId?: string) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY = userId ? `student-profile-${userId}` : '';

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setProfile(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        setProfile(JSON.parse(item));
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to load profile from local storage:', error);
      window.localStorage.removeItem(STORAGE_KEY);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [STORAGE_KEY, userId]);

  const saveProfile = useCallback((newProfile: StudentProfile) => {
    if (!userId) return;
    try {
      const profileToSave = { ...newProfile, resumeFilename: newProfile.resumeFilename || 'resume.pdf' };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
      setProfile(profileToSave);
    } catch (error) {
      console.error('Failed to save profile to local storage:', error);
    }
  }, [STORAGE_KEY, userId]);

  return { profile, saveProfile, isLoading };
}
