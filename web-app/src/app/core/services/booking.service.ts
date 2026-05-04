import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, getDoc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private firestore = inject(Firestore);
  private bookingsCollection = collection(this.firestore, 'bookings');

  getBookings(): Observable<Booking[]> {
    const q = query(this.bookingsCollection, orderBy('bookedAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Booking[]>;
  }

  async createBooking(booking: Booking): Promise<void> {
    // 1. Create the booking document
    await addDoc(this.bookingsCollection, {
      ...booking,
      bookedAt: new Date()
    });

    // 2. Update the hotel's unavailable dates
    const hotelRef = doc(this.firestore, `hotels/${booking.hotelId}`);
    const hotelSnap = await getDoc(hotelRef);
    
    if (hotelSnap.exists()) {
      const hotelData = hotelSnap.data() as Hotel;
      const currentUnavailable = hotelData.unavailableDates || [];
      if (!currentUnavailable.includes(booking.reservedDate)) {
        await updateDoc(hotelRef, {
          unavailableDates: [...currentUnavailable, booking.reservedDate]
        });
      }
    }
  }
}
