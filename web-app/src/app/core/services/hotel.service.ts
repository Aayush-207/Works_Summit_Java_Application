import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private injector = inject(EnvironmentInjector);
  private firestore = inject(Firestore);

  private inContext<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }

  getHotels(): Observable<Hotel[]> {
    return this.inContext(() => {
      const hotelsCollection = collection(this.firestore, 'hotels');
      const q = query(hotelsCollection, orderBy('createdAt', 'desc'));
      return collectionData(q, { idField: 'id' }) as Observable<Hotel[]>;
    });
  }

  async addHotel(hotel: Hotel): Promise<void> {
    const hotelsCollection = this.inContext(() => collection(this.firestore, 'hotels'));
    await this.inContext(() => addDoc(hotelsCollection, {
      ...hotel,
      createdAt: new Date()
    }));
  }

  async updateHotelUnavailableDates(hotelId: string, dates: string[]): Promise<void> {
    const hotelDoc = this.inContext(() => doc(this.firestore, `hotels/${hotelId}`));
    await this.inContext(() => updateDoc(hotelDoc, { unavailableDates: dates }));
  }
}
