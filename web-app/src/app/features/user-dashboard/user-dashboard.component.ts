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
    
    <main class="max-w-7xl mx-auto p-6 md:p-10">
      <header class="mb-10">
        <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Discover Hotels</h2>
        <p class="text-slate-500">Pick your perfect stay and book instantly.</p>
      </header>

      <div *ngIf="hotels$ | async as hotels; else loading" 
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <app-hotel-card *ngFor="let hotel of hotels" [hotel]="hotel"></app-hotel-card>
      </div>

      <ng-template #loading>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let i of [1,2,3,4]" class="bg-white rounded-3xl h-96 animate-pulse border border-slate-100">
            <div class="h-48 bg-slate-100 rounded-t-3xl"></div>
            <div class="p-5 space-y-4">
              <div class="h-6 bg-slate-100 rounded w-3/4"></div>
              <div class="h-4 bg-slate-100 rounded w-full"></div>
              <div class="h-4 bg-slate-100 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </ng-template>
    </main>
  `
})
export class UserDashboardComponent {
  private hotelService = inject(HotelService);
  hotels$: Observable<Hotel[]> = this.hotelService.getHotels();
}
