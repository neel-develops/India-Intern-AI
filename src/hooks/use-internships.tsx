'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Internship } from '@/lib/types';
import { useAuth } from './use-auth';
import { useIndustryProfile } from './use-industry-profile';
import { internships as defaultInternships } from '@/lib/data';

const getStorageKey = (userId: string) => `internships-${userId}`;

export function useInternships() {
  const { user, userType } = useAuth();
  const { profile: industryProfile } = useIndustryProfile();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For students, just show all default internships
    if (userType === 'student' || !user) {
      setInternships(defaultInternships);
      setIsLoading(false);
      return;
    }

    // For industry users, load their own internships from local storage
    if (user && userType === 'industry') {
      setIsLoading(true);
      try {
        const item = window.localStorage.getItem(getStorageKey(user.uid));
        // If they have internships, load them. Otherwise, show default ones as an example.
        setInternships(item ? JSON.parse(item) : defaultInternships);
      } catch (error) {
        console.error('Failed to load internships from local storage:', error);
        setInternships(defaultInternships); // Fallback to default
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, userType]);

  const saveInternships = useCallback((updatedInternships: Internship[]) => {
    if (user && userType === 'industry') {
      try {
        window.localStorage.setItem(getStorageKey(user.uid), JSON.stringify(updatedInternships));
        setInternships(updatedInternships);
      } catch (error) {
        console.error('Failed to save internships to local storage:', error);
      }
    }
  }, [user, userType]);

  const addInternship = useCallback((newInternshipData: Omit<Internship, 'id' | 'image' | 'company'>) => {
    if (!industryProfile) {
        console.error("Cannot add internship without an industry profile.");
        return;
    }
    const newInternship: Internship = {
      ...newInternshipData,
      id: crypto.randomUUID(),
      company: industryProfile.companyName,
      image: `https://picsum.photos/seed/${Math.random()}/600/400`, // Placeholder image
    };
    const updatedInternships = [...internships, newInternship];
    saveInternships(updatedInternships);
  }, [internships, saveInternships, industryProfile]);

  const updateInternship = useCallback((updatedInternship: Internship) => {
    const updatedInternships = internships.map(internship =>
      internship.id === updatedInternship.id ? updatedInternship : internship
    );
    saveInternships(updatedInternships);
  }, [internships, saveInternships]);

  const deleteInternship = useCallback((internshipId: string) => {
    const updatedInternships = internships.filter(internship => internship.id !== internshipId);
    saveInternships(updatedInternships);
  }, [internships, saveInternships]);

  return { internships, addInternship, updateInternship, deleteInternship, isLoading };
}
