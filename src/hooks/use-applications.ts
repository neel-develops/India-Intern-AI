
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Application } from '@/lib/types';

const STORAGE_KEY = 'applications';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const saveApplications = useCallback((updatedApplications: Application[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApplications));
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Failed to save applications to local storage:', error);
    }
  }, []);

  const addApplication = useCallback((newApplication: Omit<Application, 'id'>) => {
    const applicationWithId: Application = {
        ...newApplication,
        id: crypto.randomUUID(),
    };
    const updatedApplications = [...applications, applicationWithId];
    saveApplications(updatedApplications);
  }, [applications, saveApplications]);
  
  const updateApplicationStatus = useCallback((applicationId: string, status: Application['status']) => {
    const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
    );
    saveApplications(updatedApplications);
  }, [applications, saveApplications]);

  return { applications, addApplication, updateApplicationStatus, isLoading };
}
