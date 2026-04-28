import { useState, useEffect, useCallback } from 'react';
import type { Application } from '@/lib/types';
import { useAuth } from './use-auth';

const getStorageKey = (userId: string) => `applications-${userId}`;

// Shared cross-user application store — all applications keyed by internship + student
const GLOBAL_APPS_KEY = 'global-applications';

function loadGlobalApps(): Application[] {
  try {
    const raw = window.localStorage.getItem(GLOBAL_APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGlobalApps(apps: Application[]) {
  try {
    window.localStorage.setItem(GLOBAL_APPS_KEY, JSON.stringify(apps));
  } catch {
    console.error('Failed to persist global applications');
  }
}

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load this user's applications (by studentEmail)
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      try {
        const all = loadGlobalApps();
        const mine = all.filter(a => a.studentEmail === (user.email ?? user.uid));
        setApplications(mine);
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setApplications([]);
      setIsLoading(false);
    }
  }, [user]);

  const addApplication = useCallback((newApplication: Omit<Application, 'id'>) => {
    const applicationWithId: Application = {
      ...newApplication,
      id: crypto.randomUUID(),
    };
    const all = loadGlobalApps();
    // Prevent duplicate applications to the same internship
    const alreadyApplied = all.some(
      a => a.internshipId === newApplication.internshipId && a.studentEmail === newApplication.studentEmail
    );
    if (alreadyApplied) return;
    const updated = [...all, applicationWithId];
    saveGlobalApps(updated);
    setApplications(prev => [...prev, applicationWithId]);
  }, []);

  const updateApplicationStatus = useCallback((applicationId: string, status: Application['status']) => {
    const all = loadGlobalApps();
    const updated = all.map(app => app.id === applicationId ? { ...app, status } : app);
    saveGlobalApps(updated);
    setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status } : app));
  }, []);

  // Recruiter: get all applications for a given internshipId
  const getApplicationsByInternship = useCallback((internshipId: string): Application[] => {
    const all = loadGlobalApps();
    return all.filter(a => a.internshipId === internshipId);
  }, []);

  // Recruiter: get all applications across all internships (for aggregate views)
  const getAllApplications = useCallback((): Application[] => {
    return loadGlobalApps();
  }, []);

  return {
    applications,
    addApplication,
    updateApplicationStatus,
    getApplicationsByInternship,
    getAllApplications,
    isLoading,
  };
}
