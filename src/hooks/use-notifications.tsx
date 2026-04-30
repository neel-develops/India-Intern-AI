import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import type { Notification } from '@/lib/types';
import { useAuth } from './use-auth';
import { subscribeToUserNotifications, fsAddNotification, fsUpdateNotification } from '@/lib/firebase-db';

interface NotificationsContextType {
    notifications: Notification[];
    addNotification: (newNotification: Omit<Notification, 'id' | 'date' | 'read'> & { id?: string }) => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
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
        const unsub = subscribeToUserNotifications(user.uid, (data) => {
            setNotifications(data);
            setIsLoading(false);
        });
        return () => unsub();
    } else {
        setNotifications([]);
        setIsLoading(false);
    }
  }, [user]);

  const addNotification = useCallback(async (newNotification: Omit<Notification, 'id' | 'date' | 'read'> & { id?: string }) => {
    if (!user) return;
    try {
        const notificationWithDefaults: Omit<Notification, 'id'> = {
            date: new Date().toISOString(),
            read: false,
            message: newNotification.message,
            link: newNotification.link,
        }
        await fsAddNotification(user.uid, notificationWithDefaults);
    } catch (error) {
        console.error('Failed to add notification to Firestore:', error);
    }
  }, [user]);
  
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;
    try {
        await fsUpdateNotification(user.uid, notificationId, { read: true });
    } catch (error) {
        console.error('Failed to mark notification as read in Firestore:', error);
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
        const unread = notifications.filter(n => !n.read);
        await Promise.all(unread.map(n => fsUpdateNotification(user.uid, n.id, { read: true })));
    } catch (error) {
        console.error('Failed to mark all notifications as read in Firestore:', error);
    }
  }, [user, notifications]);

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
