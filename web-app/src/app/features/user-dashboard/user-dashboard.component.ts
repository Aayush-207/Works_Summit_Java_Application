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

    <main class="mx-auto max-w-7xl p-4 sm:p-6 md:p-10">
      <header class="mb-8 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-cyan-100/40 backdrop-blur">
        <p class="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Curated Collection</p>
        <h2 class="text-4xl font-black text-slate-800">Discover Hotels</h2>
        <p class="mt-2 text-slate-600">Pick your perfect stay and book instantly.</p>
      </header>

      <div *ngIf="hotels$ | async as hotels; else loading" 
           class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <app-hotel-card *ngFor="let hotel of hotels" [hotel]="hotel"></app-hotel-card>
      </div>

      <ng-template #loading>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div *ngFor="let i of [1,2,3,4]" class="h-96 animate-pulse rounded-3xl border border-slate-100 bg-white">
            <div class="h-48 rounded-t-3xl bg-slate-100"></div>
            <div class="space-y-4 p-5">
              <div class="h-6 w-3/4 rounded bg-slate-100"></div>
              <div class="h-4 w-full rounded bg-slate-100"></div>
              <div class="h-4 w-5/6 rounded bg-slate-100"></div>
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
