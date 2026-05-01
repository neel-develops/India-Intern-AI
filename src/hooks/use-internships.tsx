import { useState, useEffect, useCallback } from 'react';
import type { Internship } from '@/lib/types';
import { useAuth } from './use-auth';
import { useIndustryProfile } from './use-industry-profile';
import {
  seedInternshipsIfEmpty,
  subscribeToAllInternships,
  subscribeToRecruiterInternships,
  subscribeToCompanyInternships,
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
    let unsub: (() => void) | undefined;
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
      // For recruiters, we subscribe to ALL internships but filter locally to ensure
      // they always see their own posts AND posts from their company.
      // We use fuzzy matching for company names to handle abbreviations (e.g., 'TCS' matching 'Tata Consultancy Services').
      unsub = subscribeToAllInternships((data: Internship[]) => {
        const filtered = data.filter(i => {
          // 1. Direct ownership
          if (i.recruiterId === user.uid) return true;
          
          // 2. Company name matching (fuzzy)
          if (industryProfile?.companyName) {
            const recCo = industryProfile.companyName.toLowerCase().trim();
            const jobCo = i.company.toLowerCase().trim();
            
            // Match if either is contained in the other (e.g., "TCS" in "TATA CONSULTANCY SERVICES LIMITED")
            // Or if they are exact matches
            if (recCo === jobCo || jobCo.includes(recCo) || recCo.includes(jobCo)) return true;
            
            // Match common abbreviations (manual check for TCS/Tata)
            if (recCo === 'tcs' && jobCo.includes('tata consultancy services')) return true;
            if (recCo === 'reliance' && jobCo.includes('reliance industries')) return true;
          }
          
          return false;
        });
        setInternships(filtered);
        setIsLoading(false);
      });
    } else {
      unsub = subscribeToAllInternships((data: Internship[]) => {
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
  }, [user, userType, industryProfile]);

  const addInternship = useCallback(async (
    newData: Omit<Internship, 'id' | 'image' | 'company'>
  ) => {
    if (!user) {
      console.error('Need user to post internship');
      return;
    }
    await fsAddInternship({
      ...newData,
      company: industryProfile?.companyName || 'Unknown Company',
      image: `https://picsum.photos/seed/${Math.random()}/600/400`,
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
