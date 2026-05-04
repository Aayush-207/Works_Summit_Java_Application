import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.getClient();
  private readonly BUCKET_NAME = 'hotel-images';

  async uploadImage(file: File, hotelName: string): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${hotelName.replace(/\s+/g, '-')}-${timestamp}-${file.name}`;
    const filePath = `hotels/${fileName}`;

    try {
      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file);

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = this.supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf(this.BUCKET_NAME) + 1).join('/');

      const { error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Image delete error:', error);
      throw error;
    }
  }
}
