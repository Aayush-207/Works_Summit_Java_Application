import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AddHotelComponent } from './add-hotel/add-hotel.component';
import { Observable } from 'rxjs';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AddHotelComponent, CurrencyPipe, DatePipe],
  template: `
    <app-navbar></app-navbar>

    <main class="mx-auto max-w-7xl p-4 sm:p-6 md:p-10">
      <header class="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-cyan-100/40 backdrop-blur md:flex-row md:items-center">
        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Operations Hub</p>
          <h2 class="text-4xl font-black text-slate-800">Admin Dashboard</h2>
          <p class="mt-2 text-slate-600">Overview of all bookings and inventory management.</p>
        </div>
        <div class="flex gap-2">
          <div class="flex flex-col rounded-2xl border border-primary-100 bg-primary-50 px-4 py-2">
            <span class="text-[10px] font-bold uppercase text-primary-500">Total Bookings</span>
            <span class="text-xl font-extrabold text-primary-700">{{ (bookings$ | async)?.length || 0 }}</span>
          </div>
        </div>
      </header>

      <section class="mb-12">
        <div class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-cyan-100/40">
          <div class="border-b border-slate-50 p-6">
            <h3 class="text-2xl font-black text-slate-800">Recent Bookings</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th class="px-6 py-4">Hotel Name</th>
                  <th class="px-6 py-4">Reserved Date</th>
                  <th class="px-6 py-4">Guest</th>
                  <th class="px-6 py-4">Amount Paid</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let booking of bookings$ | async" class="transition-colors hover:bg-cyan-50/30">
                  <td class="px-6 py-4 font-bold text-slate-800">{{ booking.hotelName }}</td>
                  <td class="px-6 py-4 text-slate-600">{{ booking.reservedDate | date:'mediumDate' }}</td>
                  <td class="px-6 py-4">
                    <span class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{{ booking.reservedForUser }}</span>
                  </td>
                  <td class="px-6 py-4 font-extrabold text-emerald-600">{{ booking.amountPaid | currency:'INR':'symbol':'1.0-0' }}</td>
                </tr>
                <tr *ngIf="(bookings$ | async)?.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center italic text-slate-400">No bookings yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <app-add-hotel></app-add-hotel>
    </main>
  `
})
export class AdminDashboardComponent {
  private bookingService = inject(BookingService);
  bookings$: Observable<Booking[]> = this.bookingService.getBookings();
}
