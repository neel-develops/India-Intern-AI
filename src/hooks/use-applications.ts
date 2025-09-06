
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Application } from '@/lib/types';
import { useAuth } from './use-auth';

const getStorageKey = (userId: string) => `applications-${userId}`;


export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      try {
        const item = window.localStorage.getItem(getStorageKey(user.uid));
        if (item) {
          setApplications(JSON.parse(item));
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error('Failed to load applications from local storage:', error);
        setApplications([]);
      } finally {
          setIsLoading(false);
      }
    } else {
        // If there's no user, ensure applications are cleared and loading is false.
        if (applications.length > 0) setApplications([]);
        if (isLoading) setIsLoading(false);
    }
  }, [user, applications.length, isLoading]);

  const saveApplications = useCallback((updatedApplications: Application[]) => {
    if (user) {
        try {
          window.localStorage.setItem(getStorageKey(user.uid), JSON.stringify(updatedApplications));
          setApplications(updatedApplications);
        } catch (error) {
          console.error('Failed to save applications to local storage:', error);
        }
    }
  }, [user]);

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
