import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Hotel } from '../../../core/models/hotel.model';
import { BookingCalendarComponent } from '../booking-calendar/booking-calendar.component';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule, BookingCalendarComponent, CurrencyPipe],
  template: `
    <div class="card-container">
      <div class="image-section">
        <img [src]="hotel.imageUrl" [alt]="hotel.name" class="hotel-image">
        <div class="image-overlay"></div>
        <div class="location-badge">
          <span>📍</span> {{ hotel.location }}
        </div>
      </div>
      
      <div class="card-content">
        <div class="header-section">
          <h3 class="hotel-name">{{ hotel.name }}</h3>
          <div class="price-section">
            <span class="price">{{ hotel.pricePerNight | currency:'INR':'symbol':'1.0-0' }}</span>
            <span class="price-label">per night</span>
          </div>
        </div>
        
        <p class="hotel-description">{{ hotel.description }}</p>

        <app-booking-calendar 
          [unavailableDates]="hotel.unavailableDates" 
          [selectedDate]="selectedDate()"
          (dateSelected)="onDateSelected($event)">
        </app-booking-calendar>

        <button 
          (click)="bookNow()"
          [disabled]="!selectedDate() || isBooking"
          class="book-button"
          [class.loading]="isBooking">
          <span *ngIf="isBooking" class="spinner"></span>
          {{ isBooking ? 'Processing...' : 'Book It' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 1.5rem;
      border: 1px solid #e2e8f0;
      background: white;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 188, 212, 0.1);
      transition: all 0.3s ease;
    }

    .card-container:hover {
      transform: translateY(-4px);
      box-shadow: 0 25px 50px -12px rgba(0, 188, 212, 0.15);
    }

    .image-section {
      position: relative;
      height: 12rem;
      overflow: hidden;
    }

    .hotel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .card-container:hover .hotel-image {
      transform: scale(1.1);
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.05) 50%, transparent 100%);
      pointer-events: none;
    }

    .location-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.9);
      font-size: 0.75rem;
      font-weight: 700;
      color: #334155;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(8px);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 1.25rem;
    }

    .header-section {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .hotel-name {
      font-size: 1.5rem;
      font-weight: 900;
      color: #1e293b;
      line-height: 1.2;
    }

    .price-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      white-space: nowrap;
    }

    .price {
      font-size: 1.125rem;
      font-weight: 900;
      color: #0891b2;
    }

    .price-label {
      font-size: 0.625rem;
      font-weight: 500;
      color: #94a3b8;
    }

    .hotel-description {
      flex: 1;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #64748b;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .book-button {
      margin-top: 1.5rem;
      padding: 0.75rem 1rem;
      width: 100%;
      border-radius: 0.75rem;
      border: none;
      background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .book-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(6, 182, 212, 0.3);
    }

    .book-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
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
export class HotelCardComponent {
  @Input() hotel!: Hotel;
  
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  selectedDate = signal<string | null>(null);
  isBooking = false;

  onDateSelected(date: string) {
    this.selectedDate.set(date);
  }

  async bookNow() {
    if (!this.selectedDate()) return;

    this.isBooking = true;
    try {
      await this.bookingService.createBooking({
        hotelId: this.hotel.id!,
        hotelName: this.hotel.name,
        reservedDate: this.selectedDate()!,
        reservedForUser: this.authService.getUsername()!,
        amountPaid: this.hotel.pricePerNight
      });
      
      this.toastService.show(`Your booking for the ${this.hotel.name} is successful`, 'success');
      // Update local state (optimistic update happens via Firestore real-time)
      this.selectedDate.set(null);
    } catch (err) {
      this.toastService.show('Please try again!!', 'error');
    } finally {
      this.isBooking = false;
    }
  }
}
