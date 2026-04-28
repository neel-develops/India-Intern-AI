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
  setUserType: (type: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserTypeKey = (uid: string) => `userType-${uid}`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserTypeState] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const stored = localStorage.getItem(getUserTypeKey(currentUser.uid)) as UserType;
        setUserTypeState(stored || 'student');
      } else {
        setUserTypeState(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const setUserType = (type: UserType) => {
    if (user && type) {
      localStorage.setItem(getUserTypeKey(user.uid), type);
    }
    setUserTypeState(type);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
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
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      await signInWithPopup(auth, provider);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, userType, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, setUserType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
