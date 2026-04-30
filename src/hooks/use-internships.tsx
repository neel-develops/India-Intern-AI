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

  // Real-time subscription + Static Fallback
  useEffect(() => {
    setIsLoading(true);
    let unsub: () => void;
    let fallbackTimeout: NodeJS.Timeout;

    const fetchFallback = async () => {
      try {
        console.log('--- Fetching Static Fallback Internships ---');
        const baseUrl = import.meta.env.BASE_URL || '/';
        const jsonUrl = (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + 'internships.json';
        const res = await fetch(jsonUrl);
        if (res.ok) {
          const data = await res.json();
          setInternships(prev => prev.length === 0 ? data : prev);
        }
      } catch (err) {
        console.error('Fallback fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userType === 'industry' && user) {
      unsub = subscribeToRecruiterInternships(user.uid, data => {
        setInternships(data);
        setIsLoading(false);
      });
    } else {
      unsub = subscribeToAllInternships(data => {
        if (data.length > 0) {
          setInternships(data);
          setIsLoading(false);
        } else {
          // If Firestore is empty, wait 3s then try fallback
          fallbackTimeout = setTimeout(fetchFallback, 3000);
        }
      });
    }

    return () => {
      unsub?.();
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
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
