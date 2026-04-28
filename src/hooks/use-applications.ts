import { useState, useEffect, useCallback } from 'react';
import type { Application } from '@/lib/types';
import { useAuth } from './use-auth';
import {
  subscribeToStudentApplications,
  fsAddApplication,
  fsUpdateApplicationStatus,
} from '@/lib/firebase-db';

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listener for this student's applications
  useEffect(() => {
    const email = user?.email ?? user?.uid;
    if (!email) {
      setApplications([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsub = subscribeToStudentApplications(email, data => {
      setApplications(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, [user]);

  const addApplication = useCallback(async (newApplication: Omit<Application, 'id'>) => {
    await fsAddApplication(newApplication);
  }, []);

  const updateApplicationStatus = useCallback(async (
    applicationId: string,
    status: Application['status']
  ) => {
    await fsUpdateApplicationStatus(applicationId, status);
  }, []);

  return { applications, addApplication, updateApplicationStatus, isLoading };
}
