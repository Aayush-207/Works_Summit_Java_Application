import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import hotelsData from '../../../assets/seed-data.json';

@Injectable({
  providedIn: 'root'
})
export class SeedService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.getClient();
  private readonly TABLE_NAME = 'hotels';

  async seedData() {
    const isSeeded = localStorage.getItem('supabase_seeded');
    if (isSeeded) return;

    try {
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('id')
        .limit(1);

      if (error) throw error;

      // Only seed if table is empty
      if (!data || data.length === 0) {
        const hotelRecords = hotelsData.map((hotel: any) => ({
          name: hotel.name,
          description: hotel.description,
          price_per_night: hotel.pricePerNight,
          image_url: hotel.imageUrl,
          location: hotel.location,
          unavailable_dates: hotel.unavailableDates || [],
          created_at: new Date().toISOString()
        }));

        const { error: insertError } = await this.supabase
          .from(this.TABLE_NAME)
          .insert(hotelRecords);

        if (insertError) throw insertError;

        localStorage.setItem('supabase_seeded', 'true');
        console.log('Seed data successfully added to Supabase');
      }
    } catch (error) {
      console.error('Seed error:', error);
    }
  }
}

