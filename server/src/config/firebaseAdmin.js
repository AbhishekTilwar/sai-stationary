// Firebase Admin initialization. Used for verifying ID tokens, reading/writing
// Firestore with elevated privileges, and accessing Storage.
import admin from 'firebase-admin';

let initialized = false;

export function getAdmin() {
  if (!initialized) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      initialized = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[firebaseAdmin] Not initialized (running without credentials):', err.message);
    }
  }
  return admin;
}

export const db = () => getAdmin().firestore();
export const isAdminReady = () => initialized;
