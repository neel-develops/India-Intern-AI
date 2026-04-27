
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import type { Notification } from '@/lib/types';
import { useAuth } from './use-auth';

const getStorageKey = (userId: string) => `notifications-${userId}`;

interface NotificationsContextType {
    notifications: Notification[];
    addNotification: (newNotification: Omit<Notification, 'id' | 'date' | 'read'> & { id?: string }) => void;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
        setIsLoading(true);
        try {
          const item = window.localStorage.getItem(getStorageKey(user.uid));
          if (item) {
            setNotifications(JSON.parse(item));
          } else {
            setNotifications([]);
          }
        } catch (error) {
          console.error('Failed to load notifications:', error);
          setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    } else {
        setNotifications([]);
        setIsLoading(false);
    }
  }, [user]);

  const saveNotifications = useCallback((updatedNotifications: Notification[]) => {
    if (user) {
        try {
          // Sort by date descending before saving
          const sorted = updatedNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          window.localStorage.setItem(getStorageKey(user.uid), JSON.stringify(sorted));
          setNotifications(sorted);
        } catch (error) {
          console.error('Failed to save notifications to local storage:', error);
        }
    }
  }, [user]);

  const addNotification = useCallback((newNotification: Omit<Notification, 'id' | 'date' | 'read'> & { id?: string }) => {
    const notificationWithDefaults: Notification = {
        id: newNotification.id || crypto.randomUUID(),
        date: new Date().toISOString(),
        read: false,
        ...newNotification,
    }
    const updatedNotifications = [notificationWithDefaults, ...notifications];
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

  const value = { notifications, addNotification, markAsRead, markAllAsRead, isLoading };

  return (
    <NotificationsContext.Provider value={value}>
        {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
