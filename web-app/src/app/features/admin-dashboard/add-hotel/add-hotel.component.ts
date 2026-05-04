import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HotelService } from '../../../core/services/hotel.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-cyan-100/35">
      <h3 class="mb-1 text-3xl font-black text-slate-800">Add New Hotel</h3>
      <p class="mb-6 text-sm text-slate-500">List a property with complete details for quick bookings.</p>
      
      <form [formGroup]="hotelForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="label">Hotel Name</label>
          <input type="text" formControlName="name" class="input-field" placeholder="The Grand Palace">
          <div *ngIf="f['name'].touched && f['name'].errors" class="error">Min 3 characters required</div>
        </div>

        <div>
          <label class="label">Location</label>
          <input type="text" formControlName="location" class="input-field" placeholder="Mumbai, Maharashtra">
          <div *ngIf="f['location'].touched && f['location'].errors" class="error">Location is required</div>
        </div>

        <div class="md:col-span-2">
          <label class="label">Description</label>
          <textarea formControlName="description" rows="3" class="input-field" placeholder="Detailed description..."></textarea>
          <div *ngIf="f['description'].touched && f['description'].errors" class="error">Min 20 characters required</div>
        </div>

        <div>
          <label class="label">Price Per Night (₹)</label>
          <input type="number" formControlName="pricePerNight" class="input-field" placeholder="5000">
          <div *ngIf="f['pricePerNight'].touched && f['pricePerNight'].errors" class="error">Price must be at least 1</div>
        </div>

        <div>
          <label class="label">Image URL</label>
          <input type="url" formControlName="imageUrl" class="input-field" placeholder="https://image-url.com/hotel.jpg">
          <div *ngIf="f['imageUrl'].touched && f['imageUrl'].errors" class="error">Valid URL required</div>
        </div>

        <div class="md:col-span-2">
          <label class="label">Unavailable Dates (Comma-separated YYYY-MM-DD)</label>
          <input type="text" formControlName="unavailableDatesStr" class="input-field" placeholder="2025-05-10, 2025-05-15">
        </div>

        <div class="md:col-span-2 flex justify-end">
          <button type="submit" [disabled]="hotelForm.invalid || isLoading" 
                  class="btn-primary flex items-center gap-2 px-10 py-3">
            <span *ngIf="isLoading" class="animate-spin border-2 border-white/30 border-t-white rounded-full h-4 w-4"></span>
            Add Hotel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .label { @apply mb-1 block text-sm font-semibold text-slate-700; }
    .error { @apply mt-1 text-xs text-red-500; }
  `]
})
export class AddHotelComponent {
  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private toastService = inject(ToastService);

  hotelForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    pricePerNight: [null, [Validators.required, Validators.min(1)]],
    imageUrl: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
    unavailableDatesStr: ['']
  });

  isLoading = false;

  get f() { return this.hotelForm.controls; }

  async onSubmit() {
    if (this.hotelForm.invalid) return;

    this.isLoading = true;
    try {
      const formValue = this.hotelForm.value;
      const unavailableDates = formValue.unavailableDatesStr 
        ? formValue.unavailableDatesStr.split(',').map(d => d.trim()).filter(d => d)
        : [];

      await this.hotelService.addHotel({
        name: formValue.name!,
        location: formValue.location!,
        description: formValue.description!,
        pricePerNight: formValue.pricePerNight!,
        imageUrl: formValue.imageUrl!,
        unavailableDates: unavailableDates
      });

      this.toastService.show('Hotel added successfully!', 'success');
      this.hotelForm.reset();
    } catch (err) {
      this.toastService.show('Failed to add hotel. Please try again.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
