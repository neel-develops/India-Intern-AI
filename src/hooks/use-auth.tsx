import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { subscribeToUserDocument, fsUpdateUserDocument, fsGetUserDocument } from '../lib/firebase-db';
import type { UserDocument } from '../lib/types';
import { useNavigate } from 'react-router-dom';

type UserType = 'student' | 'industry' | null;

interface AuthContextType {
  user: User | null;
  userType: UserType;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserType: (type: UserType, profileData?: Partial<UserDocument>) => Promise<void>;
  waitForRole: (uid: string, targetRole: UserType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserTypeState] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setLoading(true); // Ensure loading is true while fetching doc
        // Subscribe to user document for real-time role/profile updates
        unsubDoc = subscribeToUserDocument(currentUser.uid, (doc) => {
          if (doc && doc.userType) {
            setUserTypeState(doc.userType);
          } else {
            setUserTypeState(null);
          }
          setLoading(false);
        });
      } else {
        setUserTypeState(null);
        if (unsubDoc) unsubDoc();
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const waitForRole = async (uid: string, targetRole: UserType) => {
    return new Promise<void>((resolve) => {
      const check = async () => {
        const snap = await fsGetUserDocument(uid);
        if (snap && snap.userType === targetRole) {
          setUserTypeState(targetRole);
          resolve();
        } else {
          setTimeout(check, 150);
        }
      };
      check();
    });
  };

  const setUserType = async (type: UserType, profileData?: Partial<UserDocument>) => {
    if (user && type) {
      try {
        await fsUpdateUserDocument(user.uid, { 
          userType: type,
          ...(profileData || {})
        });
        setUserTypeState(type);
      } catch (err) {
        console.error('Failed to set user type:', err);
        throw err;
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      // setLoading(false) is handled by onAuthStateChanged
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    } finally {
      // setLoading(false) is handled by onAuthStateChanged
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } finally {
      // setLoading(false) is handled by onAuthStateChanged
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, userType, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, setUserType, waitForRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
