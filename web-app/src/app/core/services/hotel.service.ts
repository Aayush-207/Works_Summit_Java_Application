import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private firestore = inject(Firestore);
  private hotelsCollection = collection(this.firestore, 'hotels');

  getHotels(): Observable<Hotel[]> {
    const q = query(this.hotelsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Hotel[]>;
  }

  async addHotel(hotel: Hotel): Promise<void> {
    await addDoc(this.hotelsCollection, {
      ...hotel,
      createdAt: new Date()
    });
  }

  async updateHotelUnavailableDates(hotelId: string, dates: string[]): Promise<void> {
    const hotelDoc = doc(this.firestore, `hotels/${hotelId}`);
    await updateDoc(hotelDoc, { unavailableDates: dates });
  }
}
