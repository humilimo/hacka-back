import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

export const initializeFirebase = () => {
  if (!getApps().length) {
    try {
      // Try to use service account credentials if available
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccount) {
        const serviceAccountJson = JSON.parse(serviceAccount);
        initializeApp({
          credential: cert(serviceAccountJson),
          projectId: "hacka-recolhe",
          storageBucket: "hacka-recolhe.firebasestorage.app",
        });
      } else {
        // Fallback to default credentials
        initializeApp({
          projectId: "hacka-recolhe",
          storageBucket: "hacka-recolhe.firebasestorage.app",
        });
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw new Error('Failed to initialize Firebase. Please check your credentials.');
    }
  }
  return getFirestore();
}; 