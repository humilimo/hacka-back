import { Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class ComplaintService {
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

  async getNearbyDumpsters(latitude: number, longitude: number) {
    const dumpstersRef = await fetch(`http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=2f3a8820-8680-4768-9f27-b5105239482a`);
    if (!dumpstersRef.success) {
    const querySnapshot = await dumpstersRef.where('latitude', '>=', latitude - 0.01).where('latitude', '<=', latitude + 0.01).where('longitude', '>=', longitude - 0.01).where('longitude', '<=', longitude + 0.01).get();
    return querySnapshot.docs.map(doc => doc.data());
  }

  async updateDumpster(id: string, weight: number) {
    const dumpsterRef = this.firestore.collection('dumpsters').doc(id);
    await dumpsterRef.update({ weight });
    return { id, weight };
  }
} 