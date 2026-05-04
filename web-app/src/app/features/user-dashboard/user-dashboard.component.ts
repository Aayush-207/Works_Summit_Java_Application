import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../core/services/hotel.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { HotelCardComponent } from './hotel-card/hotel-card.component';
import { Observable } from 'rxjs';
import { Hotel } from '../../core/models/hotel.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HotelCardComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="main-container">
      <header class="header-card">
        <p class="header-label">Curated Collection</p>
        <h2 class="header-title">Discover Hotels</h2>
        <p class="header-subtitle">Pick your perfect stay and book instantly.</p>
      </header>

      <div *ngIf="hotels$ | async as hotels; else loading" class="hotels-grid">
        <app-hotel-card *ngFor="let hotel of hotels" [hotel]="hotel"></app-hotel-card>
      </div>

      <ng-template #loading>
        <div class="hotels-grid">
          <div *ngFor="let i of [1,2,3,4]" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line skeleton-line-lg"></div>
              <div class="skeleton-line skeleton-line-md"></div>
              <div class="skeleton-line skeleton-line-sm"></div>
            </div>
          </div>
        </div>
      </ng-template>
    </main>
  `,
  styles: [`
    .main-container {
      max-width: 80rem;
      margin: 0 auto;
      padding: 1rem;
    }

    @media (min-width: 640px) {
      .main-container { padding: 1.5rem; }
    }

    @media (min-width: 768px) {
      .main-container { padding: 2.5rem; }
    }

    .header-card {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.7);
      background: rgba(255, 255, 255, 0.7);
      box-shadow: 0 20px 25px -5px rgba(0, 188, 212, 0.1);
      backdrop-filter: blur(8px);
    }

    .header-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #0891b2;
      margin-bottom: 0.5rem;
    }

    .header-title {
      font-size: 2.25rem;
      font-weight: 900;
      color: #1e293b;
    }

    .header-subtitle {
      margin-top: 0.5rem;
      color: #475569;
    }

    .hotels-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .hotels-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .hotels-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .skeleton-card {
      border-radius: 1.5rem;
      border: 1px solid #e2e8f0;
      background: white;
      overflow: hidden;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-image {
      height: 12rem;
      background-color: #f1f5f9;
    }

    .skeleton-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton-line {
      height: 0.5rem;
      border-radius: 0.25rem;
      background-color: #f1f5f9;
    }

    .skeleton-line-lg {
      height: 1.5rem;
      width: 75%;
    }

    .skeleton-line-md {
      height: 1rem;
      width: 100%;
    }

    .skeleton-line-sm {
      height: 1rem;
      width: 83%;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class UserDashboardComponent {
  private hotelService = inject(HotelService);
  hotels$: Observable<Hotel[]> = this.hotelService.getHotels();
}
