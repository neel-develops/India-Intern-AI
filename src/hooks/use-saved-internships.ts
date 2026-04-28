import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

const getStorageKey = (userId: string) => `saved-internships-${userId}`;

export function useSavedInternships() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      try {
        const item = window.localStorage.getItem(getStorageKey(user.uid));
        setSavedIds(item ? JSON.parse(item) : []);
      } catch {
        setSavedIds([]);
      }
    } else {
      setSavedIds([]);
    }
  }, [user]);

  const persist = useCallback((ids: string[]) => {
    if (!user) return;
    try {
      window.localStorage.setItem(getStorageKey(user.uid), JSON.stringify(ids));
      setSavedIds(ids);
    } catch {
      console.error('Failed to save bookmarks');
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
