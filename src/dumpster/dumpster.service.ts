import { Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class DumpsterService {
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

  async getNearbyDumpsters(latitude: number | string, longitude: number | string) {
    const response = await fetch(`http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=2f3a8820-8680-4768-9f27-b5105239482a`);
    const dumpstersRef = await response.json();
    const dumpsters = dumpstersRef.result.records;
    
    const searchLat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const searchLng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
        
    const filteredDumpsters = dumpsters.filter(dumpster => {
      const dumpsterLat = parseFloat(dumpster.latitude);
      const dumpsterLng = parseFloat(dumpster.longitude);
      
      return dumpsterLat >= searchLat - 0.01 && 
             dumpsterLat <= searchLat + 0.01 && 
             dumpsterLng >= searchLng - 0.01 && 
             dumpsterLng <= searchLng + 0.01;
    });

    return filteredDumpsters;
  }

  async updateDumpster(id: string, weight: number) {
    const dumpsterRef = this.firestore.collection('dumpsters').doc(id);
    await dumpsterRef.update({ weight });
    return { id, weight };
  }
} 