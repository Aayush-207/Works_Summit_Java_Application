import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HotelService } from '../../../core/services/hotel.service';
import { ImageUploadService } from '../../../core/services/image-upload.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h3 class="form-title">Add New Hotel</h3>
        <p class="form-subtitle">List a property with complete details and upload images for quick bookings.</p>
      </div>
      
      <form [formGroup]="hotelForm" (ngSubmit)="onSubmit()" class="form-grid">
        <!-- Image Upload Section -->
        <div class="form-group form-group-full image-upload-section">
          <label class="form-label">Hotel Image</label>
          <div class="image-upload-wrapper">
            <input 
              type="file" 
              #imageInput
              (change)="onImageSelected($event)"
              accept="image/*"
              hidden
              class="image-input"
            />
            
            <!-- Preview if image is selected -->
            <div *ngIf="imagePreview" class="image-preview-container">
              <img [src]="imagePreview" alt="Hotel preview" class="image-preview">
              <button type="button" (click)="removeImage()" class="remove-image-btn">✕ Remove</button>
            </div>

            <!-- Upload prompt if no image -->
            <div *ngIf="!imagePreview" (click)="imageInput.click()" class="image-upload-prompt">
              <div class="upload-icon">📸</div>
              <p class="upload-text">Click to upload or drag and drop</p>
              <p class="upload-subtext">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
          <div *ngIf="imageError" class="form-error">{{ imageError }}</div>
        </div>

        <!-- Hotel Details Form Fields -->
        <div class="form-group">
          <label class="form-label">Hotel Name</label>
          <input type="text" formControlName="name" class="form-input" placeholder="The Grand Palace">
          <div *ngIf="f['name'].touched && f['name'].errors" class="form-error">Min 3 characters required</div>
        </div>

        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" formControlName="location" class="form-input" placeholder="Mumbai, Maharashtra">
          <div *ngIf="f['location'].touched && f['location'].errors" class="form-error">Location is required</div>
        </div>

        <div class="form-group">
          <label class="form-label">Price Per Night (₹)</label>
          <input type="number" formControlName="pricePerNight" class="form-input" placeholder="5000">
          <div *ngIf="f['pricePerNight'].touched && f['pricePerNight'].errors" class="form-error">Price must be at least 1</div>
        </div>

        <div class="form-group form-group-full">
          <label class="form-label">Description</label>
          <textarea formControlName="description" rows="3" class="form-input" placeholder="Detailed description..."></textarea>
          <div *ngIf="f['description'].touched && f['description'].errors" class="form-error">Min 20 characters required</div>
        </div>

        <div class="form-group form-group-full">
          <label class="form-label">Unavailable Dates (Comma-separated YYYY-MM-DD)</label>
          <input type="text" formControlName="unavailableDatesStr" class="form-input" placeholder="2025-05-10, 2025-05-15">
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="hotelForm.invalid || isLoading || !imagePreview" class="submit-button">
            <span *ngIf="isLoading" class="button-spinner"></span>
            {{ isLoading ? 'Adding...' : 'Add Hotel' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      border-radius: 1.5rem;
      border: 1px solid #e2e8f0;
      background: white;
      padding: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 188, 212, 0.1);
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 1.875rem;
      font-weight: 900;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .form-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group-full {
      grid-column: 1 / -1;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.5rem;
    }

    .form-input {
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
      background: white;
      font-size: 0.95rem;
      color: #1e293b;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #06b6d4;
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
      background: #f0f9ff;
    }

    .form-input::placeholder {
      color: #cbd5e1;
    }

    textarea.form-input {
      font-family: inherit;
      resize: vertical;
    }

    .form-error {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.375rem;
      font-weight: 500;
    }

    /* Image Upload Styles */
    .image-upload-section {
      gap: 0.75rem;
    }

    .image-upload-wrapper {
      position: relative;
      width: 100%;
    }

    .image-input {
      display: none;
    }

    .image-preview-container {
      position: relative;
      width: 100%;
      border-radius: 1rem;
      overflow: hidden;
      border: 2px solid rgba(6, 182, 212, 0.3);
      background: rgba(240, 249, 255, 0.5);
    }

    .image-preview {
      display: block;
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 0.875rem;
    }

    .remove-image-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 0.75rem;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .remove-image-btn:hover {
      background: rgba(239, 68, 68, 1);
      transform: scale(1.05);
    }

    .image-upload-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2.5rem 2rem;
      border: 2px dashed rgba(6, 182, 212, 0.3);
      border-radius: 1rem;
      background: rgba(240, 249, 255, 0.3);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .image-upload-prompt:hover {
      border-color: rgba(6, 182, 212, 0.6);
      background: rgba(240, 249, 255, 0.6);
    }

    .upload-icon {
      font-size: 2.5rem;
      opacity: 0.7;
    }

    .upload-text {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .upload-subtext {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5rem;
    }

    .submit-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 2.5rem;
      border-radius: 0.75rem;
      border: none;
      background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(6, 182, 212, 0.3);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .button-spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AddHotelComponent {
  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private imageUploadService = inject(ImageUploadService);
  private toastService = inject(ToastService);

  hotelForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    pricePerNight: [null, [Validators.required, Validators.min(1)]],
    unavailableDatesStr: ['']
  });

  isLoading = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  imageError = '';

  get f() { return this.hotelForm.controls; }

  onImageSelected(event: Event): void {
    this.imageError = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.imageError = 'File size must be less than 5MB';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.imageError = 'Please select a valid image file';
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.selectedFile = file;
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.imageError = '';
  }

  async onSubmit() {
    if (this.hotelForm.invalid || !this.selectedFile) return;

    this.isLoading = true;
    try {
      const formValue = this.hotelForm.value;
      
      // Upload image to Supabase Storage
      const imageUrl = await this.imageUploadService.uploadImage(
        this.selectedFile,
        formValue.name || 'hotel'
      );

      const unavailableDates = formValue.unavailableDatesStr 
        ? formValue.unavailableDatesStr.split(',').map(d => d.trim()).filter(d => d)
        : [];

      // Add hotel with image URL to Supabase
      await this.hotelService.addHotel({
        name: formValue.name!,
        location: formValue.location!,
        description: formValue.description!,
        pricePerNight: formValue.pricePerNight!,
        imageUrl: imageUrl,
        unavailableDates: unavailableDates
      });

      this.toastService.show('Hotel added successfully!', 'success');
      this.hotelForm.reset();
      this.removeImage();
    } catch (err) {
      console.error('Error adding hotel:', err);
      this.toastService.show('Failed to add hotel. Please try again.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
