
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { StudentProfile } from '@/lib/types';
import { studentProfiles } from '@/lib/data';

const STORAGE_KEY = 'student-profile';

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client-side after hydration
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        setProfile(JSON.parse(item));
      } else {
        // For demonstration, pre-populate with the first sample profile if none exists
        setProfile(studentProfiles[0]);
      }
    } catch (error) {
      console.error('Failed to load profile from local storage:', error);
      // If parsing fails, remove the corrupted item
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback((newProfile: StudentProfile | null) => {
    try {
      if (newProfile) {
        const profileToSave = { ...newProfile, resumeFilename: newProfile.resumeFilename || 'resume.pdf' };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
        setProfile(profileToSave);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to save profile to local storage:', error);
    }
  }, []);

  return { profile, saveProfile, isLoading };
}
