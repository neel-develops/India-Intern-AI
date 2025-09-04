
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Application } from '@/lib/types';

export function useApplications(userEmail?: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY = userEmail ? `applications-${userEmail}` : '';

  useEffect(() => {
    if (!userEmail) {
        setIsLoading(false);
        return;
    };
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        setApplications(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load applications from local storage:', error);
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
        setIsLoading(false);
    }
  }, [STORAGE_KEY, userEmail]);

  const saveApplications = useCallback((updatedApplications: Application[]) => {
    if (!userEmail) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApplications));
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Failed to save applications to local storage:', error);
    }
  }, [STORAGE_KEY, userEmail]);

  const addApplication = useCallback((newApplication: Application) => {
    const updatedApplications = [...applications, newApplication];
    saveApplications(updatedApplications);
  }, [applications, saveApplications]);
  
  const updateApplicationStatus = useCallback((internshipId: string, status: Application['status']) => {
    const updatedApplications = applications.map(app => 
        app.internshipId === internshipId ? { ...app, status } : app
    );
    saveApplications(updatedApplications);
  }, [applications, saveApplications]);

  return { applications, addApplication, updateApplicationStatus, isLoading };
}
