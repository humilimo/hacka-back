import { Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebase } from '../config/firebase.config';

@Injectable()
export class DumpsterService {
  private firestore;

  constructor() {
    this.firestore = initializeFirebase();
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
      
      return dumpsterLat >= searchLat - 1 && 
             dumpsterLat <= searchLat + 1 && 
             dumpsterLng >= searchLng - 1 && 
             dumpsterLng <= searchLng + 1;
    });
    const formattedDumpsters = filteredDumpsters.map(dumpster => ({
      name: dumpster.nome,
      address: dumpster.endereco,
      tiporesiduo: dumpster.tiporesiduo,
    }));
    return formattedDumpsters;
  }

  async updateDumpster(id: string, weight: number) {
    const dumpsterRef = this.firestore.collection('dumpsters').doc(id);
    await dumpsterRef.update({ weight });
    return { id, weight };
  }
} 