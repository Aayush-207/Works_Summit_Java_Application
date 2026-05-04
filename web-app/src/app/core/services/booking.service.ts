import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, getDoc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private injector = inject(EnvironmentInjector);
  private firestore = inject(Firestore);

  private inContext<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }

  getBookings(): Observable<Booking[]> {
    return this.inContext(() => {
      const bookingsCollection = collection(this.firestore, 'bookings');
      const q = query(bookingsCollection, orderBy('bookedAt', 'desc'));
      return collectionData(q, { idField: 'id' }) as Observable<Booking[]>;
    });
  }

  async createBooking(booking: Booking): Promise<void> {
    const bookingsCollection = this.inContext(() => collection(this.firestore, 'bookings'));

    // 1. Create the booking document
    await this.inContext(() => addDoc(bookingsCollection, {
      ...booking,
      bookedAt: new Date()
    }));

    // 2. Update the hotel's unavailable dates
    const hotelRef = this.inContext(() => doc(this.firestore, `hotels/${booking.hotelId}`));
    const hotelSnap = await this.inContext(() => getDoc(hotelRef));
    
    if (hotelSnap.exists()) {
      const hotelData = hotelSnap.data() as Hotel;
      const currentUnavailable = hotelData.unavailableDates || [];
      if (!currentUnavailable.includes(booking.reservedDate)) {
        await this.inContext(() => updateDoc(hotelRef, {
          unavailableDates: [...currentUnavailable, booking.reservedDate]
        }));
      }
    }
  }
}
