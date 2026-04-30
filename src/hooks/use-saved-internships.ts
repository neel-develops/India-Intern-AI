import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { subscribeToUserDocument, fsUpdateUserDocument } from '@/lib/firebase-db';

export function useSavedInternships() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const unsub = subscribeToUserDocument(user.uid, (data) => {
        setSavedIds(data?.savedInternships || []);
      });
      return () => unsub();
    } else {
      setSavedIds([]);
    }
  }, [user]);

  const persist = useCallback(async (ids: string[]) => {
    if (!user) return;
    try {
      await fsUpdateUserDocument(user.uid, { savedInternships: ids });
      // No need to setSavedIds here because the subscription will update it
    } catch {
      console.error('Failed to save bookmarks to Firestore');
    }
  }, [user]);

  const saveInternship = useCallback((id: string) => {
    if (savedIds.includes(id)) return;
    persist([...savedIds, id]);
  }, [savedIds, persist]);

  const unsaveInternship = useCallback((id: string) => {
    persist(savedIds.filter(s => s !== id));
  }, [savedIds, persist]);

  const toggleSave = useCallback((id: string) => {
    if (savedIds.includes(id)) {
      unsaveInternship(id);
    } else {
      saveInternship(id);
    }
  }, [savedIds, saveInternship, unsaveInternship]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { savedIds, saveInternship, unsaveInternship, toggleSave, isSaved };
}
