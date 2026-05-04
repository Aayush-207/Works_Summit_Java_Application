import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { Hotel } from '../models/hotel.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.getClient();
  private readonly BOOKINGS_TABLE = 'bookings';
  private readonly HOTELS_TABLE = 'hotels';

  getBookings(): Observable<Booking[]> {
    return from(
      this.supabase
        .from(this.BOOKINGS_TABLE)
        .select('*')
        .order('booked_at', { ascending: false })
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data.map(booking => ({
          id: booking.id,
          hotelId: booking.hotel_id,
          hotelName: booking.hotel_name,
          reservedDate: booking.reserved_date,
          reservedForUser: booking.reserved_for_user,
          amountPaid: booking.amount_paid,
          bookedAt: booking.booked_at
        })) as Booking[];
      })
    );
  }

  async createBooking(booking: Booking): Promise<void> {
    try {
      // 1. Create the booking document
      const { error: bookingError } = await this.supabase
        .from(this.BOOKINGS_TABLE)
        .insert({
          hotel_id: booking.hotelId,
          hotel_name: booking.hotelName,
          reserved_date: booking.reservedDate,
          reserved_for_user: booking.reservedForUser,
          amount_paid: booking.amountPaid,
          booked_at: new Date().toISOString()
        });

      if (bookingError) throw bookingError;

      // 2. Update the hotel's unavailable dates
      const { data: hotelData, error: fetchError } = await this.supabase
        .from(this.HOTELS_TABLE)
        .select('unavailable_dates')
        .eq('id', booking.hotelId)
        .single();

      if (fetchError) throw fetchError;

      const currentUnavailable = hotelData?.unavailable_dates || [];
      if (!currentUnavailable.includes(booking.reservedDate)) {
        const { error: updateError } = await this.supabase
          .from(this.HOTELS_TABLE)
          .update({ unavailable_dates: [...currentUnavailable, booking.reservedDate] })
          .eq('id', booking.hotelId);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }
}
