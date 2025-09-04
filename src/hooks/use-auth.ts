
'use client';

import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from './use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: 'Success', description: 'Logged in successfully.' });
    } catch (error) {
      console.error('Login error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to log in.' });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Success', description: 'Logged out successfully.' });
    } catch (error) {
      console.error('Logout error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to log out.' });
    }
  };

  return { user, loading, login, logout };
}
