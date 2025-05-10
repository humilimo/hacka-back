import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ComplaintDto } from './dto/complaint.dto';
import { firstValueFrom } from 'rxjs';
import { NominatimResponse } from 'src/types/nominatim.type';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class ComplaintService {
  private firestore;

  constructor(private readonly httpService: HttpService) {
    if (!getApps().length) {
      initializeApp({
        projectId: "hacka-recolhe",
        storageBucket: "hacka-recolhe.firebasestorage.app",
      });
    }
    this.firestore = getFirestore();
  }

  async getComplaints(phoneNumber: string): Promise<{ complaints: number }> {
    try {
      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }

      const complaintsRef = this.firestore.collection('complaints');
      const querySnapshot = await complaintsRef.where('userPhoneNumber', '==', phoneNumber).get();

      if (querySnapshot.empty) {
        return { complaints: 0 };
      }

      const complaintDoc = querySnapshot.docs[0];
      const complaintData = complaintDoc.data();

      return {
        complaints: complaintData.complaints || 0
      };
    } catch (error) {
      throw new Error(`Error getting complaints: ${error.message}`);
    }
  }

  async createComplaint(complaintDto: ComplaintDto): Promise<{ id: string } & ComplaintDto> {
    try {
      const complaintsRef = this.firestore.collection('complaints');
      const docRef = await complaintsRef.add(complaintDto);
      return { id: docRef.id, ...complaintDto };
    } catch (error) {
      throw new Error(`Error creating complaint: ${error.message}`);
    }
  }

  async updateComplaint(id: string, complaintDto: ComplaintDto): Promise<{ id: string } & ComplaintDto> {
    try {
      const complaintRef = this.firestore.collection('complaints').doc(id);
      await complaintRef.update(complaintDto);
      return { id, ...complaintDto };
    } catch (error) {
      throw new Error(`Error updating complaint: ${error.message}`);
    }
  }

  async reverseGeocode(lat: string, lon: string): Promise<string> {
    const url = 'https://nominatim.openstreetmap.org/reverse';
    const params = {
      lat,
      lon,
      format: 'json',
      addressdetails: '1',
    };

    const headers = {
      'User-Agent': 'recolhe-app/1.0 (lucass.dcss75@gmail.com)', // obrigatório para Nominatim
    };

    const response = await firstValueFrom(
      this.httpService.get(url, { params, headers })
    ).then((response) => {
      return response.data as NominatimResponse
    });
    
    return `${response.address.road || ''}, ${response.address.house_number || ''}, ${response.address.suburb || ''}`;
  }
} 