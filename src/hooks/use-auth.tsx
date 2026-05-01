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
import { subscribeToUserDocument, fsUpdateUserDocument } from '../lib/firebase-db';
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
        // Subscribe to user document for real-time role/profile updates
        unsubDoc = subscribeToUserDocument(currentUser.uid, (doc) => {
          if (doc) {
            setUserTypeState(doc.userType || 'student');
          } else {
            // Document doesn't exist yet, wait for manual setUserType
          }
        });
      } else {
        setUserTypeState(null);
        if (unsubDoc) unsubDoc();
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const setUserType = async (type: UserType, profileData?: Partial<UserDocument>) => {
    if (user && type) {
      await fsUpdateUserDocument(user.uid, { 
        userType: type,
        ...profileData 
      }).catch(console.error);
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
