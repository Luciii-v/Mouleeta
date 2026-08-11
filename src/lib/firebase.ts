// Firebase client-side configuration for MOULEETA V.2
// Used for Phone Authentication (SMS OTP via Firebase)
//
// Setup:
// 1. Go to https://console.firebase.google.com
// 2. Create a project (or use existing)
// 3. Enable Phone Authentication under Authentication → Sign-in method
// 4. Register your web app to get these config values
// 5. Add ALL NEXT_PUBLIC_ vars to Vercel environment variables

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Prevent re-initialization on hot reloads
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export { firebaseAuth };
export default app;
