
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "internship-aligner",
  "appId": "1:440687570290:web:d2ebd88ceafd2f067501eb",
  "storageBucket": "internship-aligner.firebasestorage.app",
  "apiKey": "AIzaSyAnndiBhtYgdGth2_mcj2fJmxR3TT8mZnM",
  "authDomain": "internship-aligner.firebaseapp.com",
  "messagingSenderId": "440687570290"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
