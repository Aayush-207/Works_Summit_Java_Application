import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hotel } from '../models/hotel.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.getClient();
  private readonly TABLE_NAME = 'hotels';

  getHotels(): Observable<Hotel[]> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data.map(hotel => ({
          id: hotel.id,
          name: hotel.name,
          description: hotel.description,
          pricePerNight: hotel.price_per_night,
          imageUrl: hotel.image_url,
          location: hotel.location,
          unavailableDates: hotel.unavailable_dates || [],
          createdAt: hotel.created_at
        })) as Hotel[];
      })
    );
  }

  async addHotel(hotel: Hotel): Promise<void> {
    const { error } = await this.supabase
      .from(this.TABLE_NAME)
      .insert({
        name: hotel.name,
        description: hotel.description,
        price_per_night: hotel.pricePerNight,
        image_url: hotel.imageUrl,
        location: hotel.location,
        unavailable_dates: hotel.unavailableDates || [],
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  async updateHotelUnavailableDates(hotelId: string, dates: string[]): Promise<void> {
    const { error } = await this.supabase
      .from(this.TABLE_NAME)
      .update({ unavailable_dates: dates })
      .eq('id', hotelId);

    if (error) throw error;
  }

  async deleteHotel(hotelId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', hotelId);

    if (error) throw error;
  }
}
