
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Notification } from '@/lib/types';

const STORAGE_KEY = 'notifications';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        setNotifications(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const saveNotifications = useCallback((updatedNotifications: Notification[]) => {
    try {
      // Sort by date descending before saving
      const sorted = updatedNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      setNotifications(sorted);
    } catch (error) {
      console.error('Failed to save notifications to local storage:', error);
    }
  }, []);

  const addNotification = useCallback((newNotification: Notification) => {
    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);
  
  const markAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(n => ({...n, read: true}));
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  return { notifications, addNotification, markAsRead, markAllAsRead, isLoading };
}
