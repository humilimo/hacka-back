import { Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class UsersService {
  private firestore;

  constructor() {
    if (!getApps().length) {
      initializeApp({
        projectId: "hacka-recolhe",
        storageBucket: "hacka-recolhe.firebasestorage.app",
      });
    }
    this.firestore = getFirestore();
  }

  async getUserBalanceByPhone(phoneNumber: string): Promise<{ balance: number, pendingBalance: number }> {
    try {
      const usersRef = this.firestore.collection('users');
      const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).get();

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return {
        balance: userData.balance || 0,
        pendingBalance: userData.pendingBalance || 0
      };
    } catch (error) {
      throw new Error(`Error getting user balance: ${error.message}`);
    }
  }

  async updateUserBalance(phoneNumber: string, balance: number): Promise<{ balance: number }> {
    try {
      const usersRef = this.firestore.collection('users');
      const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).get();

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      await userDoc.ref.update({ balance });

      return { balance };
    } catch (error) {
      throw new Error(`Error updating user balance: ${error.message}`);
    }
  }
} 