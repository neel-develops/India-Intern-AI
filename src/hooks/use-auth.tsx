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
  UserCredential,
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
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  setUserType: (type: UserType, profileData?: Partial<UserDocument>, uid?: string) => Promise<void>;
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
        setLoading(true);
        unsubDoc = subscribeToUserDocument(currentUser.uid, (doc) => {
          // If we have a doc with a userType, always trust it
          if (doc && doc.userType) {
            setUserTypeState(doc.userType);
            setLoading(false);
          } else {
            // If the document is missing or role is null, only set it to null 
            // if we aren't currently waiting for a role or in a transition.
            // This prevents the 'null' flash during registration.
            setUserTypeState(prev => prev ? prev : null);
            setLoading(false);
          }
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

  const setUserType = async (type: UserType, profileData?: Partial<UserDocument>, uid?: string) => {
    const targetUid = uid || user?.uid || auth.currentUser?.uid;
    if (targetUid && type) {
      try {
        await fsUpdateUserDocument(targetUid, { 
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
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return cred.user;
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
      return cred.user;
    } finally {
      // setLoading(false) is handled by onAuthStateChanged
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      return cred.user;
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
