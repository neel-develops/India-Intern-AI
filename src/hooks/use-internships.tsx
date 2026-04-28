import { useState, useEffect, useCallback } from 'react';
import type { Internship } from '@/lib/types';
import { useAuth } from './use-auth';
import { useIndustryProfile } from './use-industry-profile';
import {
  seedInternshipsIfEmpty,
  subscribeToAllInternships,
  subscribeToRecruiterInternships,
  fsAddInternship,
  fsUpdateInternship,
  fsDeleteInternship,
} from '@/lib/firebase-db';

let _seedStarted = false;

export function useInternships() {
  const { user, userType } = useAuth();
  const { profile: industryProfile } = useIndustryProfile();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Seed static internships to Firestore once per app session
  useEffect(() => {
    if (!_seedStarted) {
      _seedStarted = true;
      seedInternshipsIfEmpty();
    }
  }, []);

  // Real-time subscription
  useEffect(() => {
    setIsLoading(true);
    let unsub: () => void;
    if (userType === 'industry' && user) {
      // Recruiter sees only their own postings in manage view
      unsub = subscribeToRecruiterInternships(user.uid, data => {
        setInternships(data);
        setIsLoading(false);
      });
    } else {
      // Students + guests see all internships (static + recruiter-posted)
      unsub = subscribeToAllInternships(data => {
        setInternships(data);
        setIsLoading(false);
      });
    }
    return () => unsub?.();
  }, [user, userType]);

  const addInternship = useCallback(async (
    newData: Omit<Internship, 'id' | 'image' | 'company'>
  ) => {
    if (!user || !industryProfile) {
      console.error('Need user + industry profile to post internship');
      return;
    }
    await fsAddInternship({
      ...newData,
      company: industryProfile.companyName,
      image: `https://picsum.photos/seed/${crypto.randomUUID()}/600/400`,
      recruiterId: user.uid,
    });
  }, [user, industryProfile]);

  const updateInternship = useCallback(async (updated: Internship) => {
    const { id, ...data } = updated;
    await fsUpdateInternship(id, data);
  }, []);

  const deleteInternship = useCallback(async (internshipId: string) => {
    await fsDeleteInternship(internshipId);
  }, []);

  return { internships, addInternship, updateInternship, deleteInternship, isLoading };
}
