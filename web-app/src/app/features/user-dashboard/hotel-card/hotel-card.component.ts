import { Component, Input, inject, signal, NgZone } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Hotel } from '../../../core/models/hotel.model';
import { BookingCalendarComponent } from '../booking-calendar/booking-calendar.component';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule, BookingCalendarComponent, CurrencyPipe, DatePipe],
  template: `
    <!-- Collapsed Card -->
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
      </div>

      <!-- Arrow Button at Bottom -->
      <button class="expand-button-bottom" (click)="openModal()" title="View details">
        ↓ View Details
      </button>
    </div>

    <!-- Details Modal Popup -->
    <div *ngIf="showModal()" class="modal-overlay" (click)="closeModal()">
      <div class="details-modal" (click)="$event.stopPropagation()">
        <button class="modal-close-btn" (click)="closeModal()">✕</button>

        <!-- Hotel Image in Modal -->
        <div class="modal-image-container">
          <img [src]="hotel.imageUrl" [alt]="hotel.name" class="modal-hotel-image">
          <div class="modal-image-overlay"></div>
        </div>

        <div class="modal-header">
          <h2 class="modal-title">{{ hotel.name }}</h2>
          <div class="modal-price">{{ hotel.pricePerNight | currency:'INR':'symbol':'1.0-0' }} /night</div>
        </div>

        <div class="modal-content-scroll">
          <div class="info-section">
            <h3>About This Hotel</h3>
            <p>{{ hotel.description }}</p>
            <p class="location-info">📍 Located in {{ hotel.location }}</p>
          </div>

          <div class="offers-section">
            <h3>Special Offers</h3>
            <ul class="offers-list">
              <li>✨ Free WiFi available</li>
              <li>🛎️ 24-hour front desk</li>
              <li>🏊 Swimming pool access</li>
              <li>🍽️ Complimentary breakfast</li>
            </ul>
          </div>

          <div class="calendar-section">
            <h3>Select Your Dates</h3>
            <p class="calendar-hint">Green dates are available, Red dates are booked</p>
            <app-booking-calendar 
              [unavailableDates]="hotel.unavailableDates" 
              [selectedDate]="selectedDate()"
              (dateSelected)="onDateSelected($event)">
            </app-booking-calendar>
          </div>

          <div *ngIf="selectedDate()" class="selected-info">
            <span class="selected-label">Selected Date:</span>
            <span class="selected-date">{{ selectedDate() | date: 'MMM dd, yyyy' }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            (click)="bookNow()"
            [disabled]="!selectedDate() || isBooking"
            class="book-button"
            [class.loading]="isBooking">
            <span *ngIf="isBooking" class="spinner"></span>
            {{ isBooking ? 'Processing...' : '✓ Book Now' }}
          </button>
          <button 
            (click)="closeModal()"
            class="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div *ngIf="showSuccessModal()" class="modal-overlay" (click)="closeSuccessModal()">
      <div class="success-modal" (click)="$event.stopPropagation()">
        <div class="modal-content">
          <div class="checkmark">✓</div>
          <h2>Booking Successful!</h2>
          <p>Your booking for <strong>{{ hotel.name }}</strong> is confirmed.</p>
          <p class="booking-date">{{ selectedDate() | date: 'MMMM dd, yyyy' }}</p>
          <button (click)="closeSuccessModal()" class="modal-button">Continue</button>
        </div>
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

    /* Bottom Arrow Button */
    .expand-button-bottom {
      width: 100%;
      padding: 0.75rem;
      border: none;
      background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 0 0 1.5rem 1.5rem;
    }

    .expand-button-bottom:hover {
      background: linear-gradient(135deg, #0891b2 0%, #059669 100%);
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }

    .expand-button-bottom:active {
      transform: scale(0.98);
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

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      z-index: 100;
      animation: fadeIn 0.2s ease;
      padding: 1rem;
    }

    /* Modal Styles - Details Modal */
    .details-modal {
      background: white;
      border-radius: 1.5rem;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      position: relative;
      overflow: hidden;
    }

    .modal-close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.05);
      color: #64748b;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .modal-close-btn:hover {
      background: rgba(0, 0, 0, 0.1);
      transform: scale(1.1);
    }

    /* Modal Image */
    .modal-image-container {
      position: relative;
      width: 100%;
      height: 16rem;
      overflow: hidden;
      border-radius: 1.5rem 1.5rem 0 0;
    }

    .modal-hotel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: slideUp 0.4s ease;
    }

    .modal-image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%);
    }

    .modal-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
      color: white;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
    }

    .modal-price {
      font-size: 1rem;
      font-weight: 600;
      opacity: 0.95;
    }

    .modal-content-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-section {
      animation: slideUp 0.4s ease 0.05s forwards;
    }

    .info-section h3 {
      font-size: 1.125rem;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }

    .info-section p {
      color: #64748b;
      line-height: 1.6;
      margin: 0.5rem 0;
    }

    .location-info {
      color: #0891b2;
      font-weight: 500;
      margin-top: 1rem !important;
    }

    .offers-section {
      animation: slideUp 0.4s ease 0.1s forwards;
    }

    .offers-section h3 {
      font-size: 1.125rem;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 1rem;
    }

    .offers-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .offers-list li {
      padding: 0.75rem;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
      border-radius: 0.5rem;
      border: 1px solid rgba(6, 182, 212, 0.2);
      font-size: 0.875rem;
      color: #334155;
      transition: all 0.2s ease;
    }

    .offers-list li:hover {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
      border-color: rgba(6, 182, 212, 0.4);
      transform: translateY(-2px);
    }

    .calendar-section {
      animation: slideUp 0.4s ease 0.15s forwards;
    }

    .calendar-section h3 {
      font-size: 1.125rem;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .calendar-hint {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-bottom: 1rem;
    }

    .selected-info {
      padding: 1rem;
      background: linear-gradient(135deg, #d1fae5 0%, #cffafe 100%);
      border-radius: 0.75rem;
      border-left: 4px solid #10b981;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      animation: fadeIn 0.3s ease;
    }

    .selected-label {
      font-weight: 600;
      color: #0f766e;
    }

    .selected-date {
      font-weight: bold;
      color: #0891b2;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 0 0 1.5rem 1.5rem;
      animation: slideUp 0.4s ease 0.2s forwards;
    }

    .book-button {
      flex: 1;
      padding: 0.75rem 1rem;
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

    .book-button.loading {
      opacity: 0.8;
    }

    .cancel-button {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      border: 2px solid #e2e8f0;
      background: white;
      color: #64748b;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-button:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
      color: #334155;
    }

    /* Success Modal */
    .success-modal {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
      animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }

    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .checkmark {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s forwards;
      opacity: 0;
    }

    .success-modal h2 {
      font-size: 1.25rem;
      font-weight: bold;
      color: #1e293b;
      margin: 0.5rem 0;
    }

    .success-modal p {
      color: #64748b;
      margin: 0.5rem 0;
    }

    .booking-date {
      font-size: 1rem;
      font-weight: bold;
      color: #0891b2;
      margin: 1rem 0 !important;
    }

    .modal-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      border: none;
      background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }

    .modal-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(6, 182, 212, 0.3);
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class HotelCardComponent {
  @Input() hotel!: Hotel;
  
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  showModal = signal(false);
  selectedDate = signal<string | null>(null);
  showSuccessModal = signal(false);
  isBooking = false;

  openModal() {
    this.ngZone.run(() => {
      this.showModal.set(true);
    });
  }

  closeModal() {
    this.ngZone.run(() => {
      this.showModal.set(false);
      this.selectedDate.set(null);
    });
  }

  onDateSelected(date: string) {
    this.ngZone.run(() => {
      this.selectedDate.set(date);
    });
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
      
      this.ngZone.run(() => {
        this.showSuccessModal.set(true);
        setTimeout(() => {
          this.closeSuccessModal();
        }, 3000);
      });
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      this.isBooking = false;
    }
  }

  closeSuccessModal() {
    this.ngZone.run(() => {
      this.showSuccessModal.set(false);
      this.showModal.set(false);
      this.selectedDate.set(null);
    });
  }
}
