/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAqLA4cVKh6JFuYeSmiQgP5ffmLWip51dU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "india-intern-final.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "india-intern-final",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "india-intern-final.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1087150914586",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1087150914586:web:882254659e0652c78765a3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
