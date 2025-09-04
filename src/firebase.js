import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAL2zunT6aXlgapsqcTTZKz3r-9iB_seRo",
  authDomain: "real-time-eaf21.firebaseapp.com",
  projectId: "real-time-eaf21",
  storageBucket: "real-time-eaf21.firebasestorage.app",
  messagingSenderId: "182368123067",
  appId: "1:182368123067:web:3e595c978c582b8880d19e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

