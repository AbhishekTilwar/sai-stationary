// Firebase client initialization.
//
// All values are read from Vite env vars (see .env.example). The app is
// designed to run in a "demo / mock" mode when Firebase is not configured,
// so the storefront is fully browsable without credentials during dev.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ⚠️ TEMPORARILY DISABLED — Firebase is not set up yet, so we force demo mode.
// The whole app runs on local/mock data (auth via OTP 123456, orders in
// localStorage). To go live: restore the line below and set the VITE_FIREBASE_*
// env vars.
//
// export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
export const isFirebaseConfigured = false;

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // eslint-disable-next-line no-console
  console.info(
    '[Sai Stationary] Firebase not configured — running in demo mode with mock catalog data.'
  );
}

export { app, auth, db, storage };
