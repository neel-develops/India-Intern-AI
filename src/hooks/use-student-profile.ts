
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { StudentProfile } from '@/lib/types';
import { studentProfiles } from '@/lib/data';

const STORAGE_KEY = 'student-profile';

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        setProfile(JSON.parse(item));
      } else {
        // To demonstrate, we can load a default profile if none exists
        const defaultProfile = studentProfiles[0];
        setProfile(defaultProfile);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error('Failed to load profile from local storage:', error);
      window.localStorage.removeItem(STORAGE_KEY);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback((newProfile: StudentProfile) => {
    try {
      const profileToSave = { ...newProfile, resumeFilename: newProfile.resumeFilename || 'resume.pdf' };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
      setProfile(profileToSave);
    } catch (error) {
      console.error('Failed to save profile to local storage:', error);
    }
  }, []);

  return { profile, saveProfile, isLoading };
}
