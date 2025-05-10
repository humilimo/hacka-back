import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

export const initializeFirebase = () => {
  if (!getApps().length) {
    try {
        initializeApp({
          credential: admin.credential.cert('src/config/serviceAccountKey.json'),
          projectId: "hacka-recolhe",
          storageBucket: "hacka-recolhe.firebasestorage.app",
        });
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw new Error('Failed to initialize Firebase. Please check your credentials.');
    }
  }
  return getFirestore();
}; 