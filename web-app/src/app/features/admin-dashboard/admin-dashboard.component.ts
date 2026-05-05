import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { HotelService } from '../../core/services/hotel.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AddHotelComponent } from './add-hotel/add-hotel.component';
import { Observable } from 'rxjs';
import { Booking } from '../../core/models/booking.model';
import { Hotel } from '../../core/models/hotel.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AddHotelComponent, CurrencyPipe, DatePipe],
  template: `
    <app-navbar></app-navbar>

    <main class="main-container">
      <!-- Header Section -->
      <header class="header-section">
        <div class="header-content">
          <p class="header-label">Operations Hub</p>
          <h2 class="header-title">Admin Dashboard</h2>
          <p class="header-subtitle">Manage all hotel bookings, track revenue, and oversee inventory.</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-label">Total Bookings</span>
              <span class="stat-value">{{ (bookings$ | async)?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Bookings Section -->
      <section class="bookings-section">
        <div class="bookings-container">
          <div class="bookings-header">
            <div class="header-left">
              <h3 class="section-title">Recent Bookings</h3>
              <p class="section-subtitle">Latest transactions from your guests</p>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table class="bookings-table" *ngIf="(bookings$ | async)?.length! > 0; else emptyState">
              <thead class="table-head">
                <tr>
                  <th class="col-hotel">Hotel Name</th>
                  <th class="col-date">Reserved Date</th>
                  <th class="col-guest">Guest Name</th>
                  <th class="col-amount">Amount Paid</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr *ngFor="let booking of bookings$ | async; let i = index" [class.row-alt]="i % 2 === 0">
                  <td class="cell-hotel">
                    <span class="hotel-badge">{{ booking.hotelName }}</span>
                  </td>
                  <td class="cell-date">{{ booking.reservedDate | date:'MMM dd, yyyy' }}</td>
                  <td class="cell-guest">{{ booking.reservedForUser }}</td>
                  <td class="cell-amount">{{ booking.amountPaid | currency:'INR':'symbol':'1.0-0' }}</td>
                </tr>
              </tbody>
            </table>
            <ng-template #emptyState>
              <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p class="empty-text">No bookings yet</p>
                <p class="empty-subtext">Bookings will appear here once guests start making reservations</p>
              </div>
            </ng-template>
          </div>
        </div>
      </section>

      <!-- Add Hotel Section -->
      <app-add-hotel (hotelAdded)="onHotelAdded()"></app-add-hotel>

      <!-- Hotels Management Section -->
      <section class="hotels-section">
        <div class="hotels-container">
          <div class="hotels-header">
            <div class="header-left">
              <h3 class="section-title">Hotel Inventory</h3>
              <p class="section-subtitle">Manage your property listings</p>
            </div>
          </div>
          
          <div class="hotels-grid" *ngIf="hotels$ | async as hotelList">
            <div *ngIf="hotelList.length > 0; else noHotels" class="grid">
              <div *ngFor="let hotel of hotelList" class="hotel-card">
                <div class="hotel-image-wrapper">
                  <img [src]="hotel.imageUrl" [alt]="hotel.name" class="hotel-image">
                </div>
                <div class="hotel-info">
                  <h4 class="hotel-title">{{ hotel.name }}</h4>
                  <p class="hotel-location">📍 {{ hotel.location }}</p>
                  <p class="hotel-price">₹{{ hotel.pricePerNight | number:'1.0-0' }}/night</p>
                  <p class="hotel-desc">{{ hotel.description | slice:0:80 }}...</p>
                </div>
                <div class="hotel-actions">
                  <button class="delete-btn" (click)="deleteHotel(hotel.id!)">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
            <ng-template #noHotels>
              <div class="empty-state">
                <div class="empty-icon">🏨</div>
                <p class="empty-text">No hotels added yet</p>
                <p class="empty-subtext">Add your first hotel using the form above</p>
              </div>
            </ng-template>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .main-container {
      max-width: 80rem;
      margin: 0 auto;
      padding: 1.5rem;
    }

    @media (min-width: 640px) {
      .main-container { padding: 2rem; }
    }

    @media (min-width: 768px) {
      .main-container { padding: 3rem 2rem; }
    }

    /* Header Section */
    .header-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 3rem;
      padding: 2rem 2.5rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.8);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 249, 255, 0.6) 100%);
      box-shadow: 0 25px 50px -12px rgba(0, 188, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(12px);
    }

    @media (min-width: 768px) {
      .header-section {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }
    }

    .header-content {
      flex: 1;
    }

    .header-label {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: #0891b2;
      margin-bottom: 0.75rem;
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #1e293b 0%, #0891b2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .header-subtitle {
      font-size: 1rem;
      color: #64748b;
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      min-width: 100%;
    }

    @media (min-width: 768px) {
      .stats-grid {
        min-width: 320px;
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 2rem;
      border-radius: 1.5rem;
      border: 1.5px solid rgba(6, 182, 212, 0.2);
      background: linear-gradient(135deg, rgba(240, 249, 255, 0.8) 0%, rgba(207, 250, 254, 0.4) 100%);
      box-shadow: 0 10px 30px rgba(0, 188, 212, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(0, 188, 212, 0.15);
      border-color: rgba(6, 182, 212, 0.4);
    }

    .stat-icon {
      font-size: 2rem;
      opacity: 0.9;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.625rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #0891b2;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 900;
      color: #0891b2;
    }

    /* Bookings Section */
    .bookings-section {
      margin-bottom: 3rem;
    }

    .bookings-container {
      border-radius: 2rem;
      border: 1px solid rgba(226, 232, 240, 0.8);
      background: white;
      overflow: hidden;
      box-shadow: 0 20px 50px -15px rgba(0, 188, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }

    .bookings-container:hover {
      box-shadow: 0 25px 60px -15px rgba(0, 188, 212, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .bookings-header {
      border-bottom: 1px solid rgba(226, 232, 240, 0.5);
      padding: 2rem 2.5rem;
      background: linear-gradient(90deg, rgba(248, 250, 252, 0.5) 0%, rgba(240, 249, 255, 0.3) 100%);
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-title {
      font-size: 1.75rem;
      font-weight: 900;
      color: #1e293b;
      margin: 0;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .bookings-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .table-head {
      background: rgba(248, 250, 252, 0.8);
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
    }

    .table-head th {
      padding: 1.25rem 1.5rem;
      border-bottom: 2px solid rgba(226, 232, 240, 0.6);
    }

    .col-hotel { width: 35%; }
    .col-date { width: 20%; }
    .col-guest { width: 25%; }
    .col-amount { width: 20%; text-align: right; }

    .table-body tr {
      transition: all 0.2s ease;
      border-bottom: 1px solid rgba(226, 232, 240, 0.3);
    }

    .table-body tr:not(.row-alt):hover {
      background: rgba(6, 182, 212, 0.05);
    }

    .table-body tr.row-alt {
      background: rgba(248, 250, 252, 0.6);
    }

    .table-body tr.row-alt:hover {
      background: rgba(6, 182, 212, 0.08);
    }

    .table-body td {
      padding: 1.25rem 1.5rem;
      font-size: 0.95rem;
    }

    .cell-hotel {
      font-weight: 700;
      color: #1e293b;
    }

    .hotel-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #f0f9ff 0%, #cffafe 100%);
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: 0.75rem;
      color: #0891b2;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .cell-date {
      color: #64748b;
      font-weight: 500;
    }

    .cell-guest {
      color: #475569;
    }

    .cell-amount {
      font-weight: 800;
      color: #10b981;
      text-align: right;
      font-size: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #cbd5e1;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #64748b;
      margin: 0.5rem 0;
    }

    .empty-subtext {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0.5rem 0;
    }

    /* Hotels Section */
    .hotels-section {
      margin-top: 3rem;
      padding: 0;
    }

    .hotels-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .hotels-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1e293b;
      margin: 0;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }

    .hotels-grid {
      width: 100%;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .hotel-card {
      display: flex;
      flex-direction: column;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      background: white;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .hotel-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -4px rgba(6, 182, 212, 0.15);
    }

    .hotel-image-wrapper {
      height: 200px;
      overflow: hidden;
      background: #f1f5f9;
    }

    .hotel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .hotel-card:hover .hotel-image {
      transform: scale(1.05);
    }

    .hotel-info {
      flex: 1;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .hotel-title {
      font-size: 1.125rem;
      font-weight: bold;
      color: #1e293b;
      margin: 0;
    }

    .hotel-location {
      font-size: 0.875rem;
      color: #0891b2;
      margin: 0;
    }

    .hotel-price {
      font-size: 1rem;
      font-weight: bold;
      color: #10b981;
      margin: 0.25rem 0 0;
    }

    .hotel-desc {
      font-size: 0.8rem;
      color: #64748b;
      margin: 0.5rem 0;
      line-height: 1.4;
    }

    .hotel-actions {
      padding: 0 1.25rem 1.25rem;
      display: flex;
      gap: 0.5rem;
    }

    .delete-btn {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: none;
      background: #fee2e2;
      color: #dc2626;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .delete-btn:hover {
      background: #fecaca;
      transform: translateY(-2px);
    }

    .delete-btn:active {
      transform: translateY(0);
    }
  `]
})
export class AdminDashboardComponent {
  private bookingService = inject(BookingService);
  private hotelService = inject(HotelService);
  
  bookings$: Observable<Booking[]> = this.bookingService.getBookings();
  hotels$: Observable<Hotel[]> = this.hotelService.getHotels();

  async deleteHotel(hotelId: string) {
    if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      try {
        await this.hotelService.deleteHotel(hotelId);
        // Refresh hotels list
        this.hotels$ = this.hotelService.getHotels();
      } catch (error) {
        console.error('Failed to delete hotel:', error);
        alert('Failed to delete hotel. Please try again.');
      }
    }
  }

  onHotelAdded() {
    // Refresh hotels list when a new hotel is added
    this.hotels$ = this.hotelService.getHotels();
  }
}
