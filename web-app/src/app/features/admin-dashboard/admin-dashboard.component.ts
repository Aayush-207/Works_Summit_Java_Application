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
    
    <main class="max-w-7xl mx-auto p-6 md:p-10">
      <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h2>
          <p class="text-slate-500">Overview of all bookings and system management.</p>
        </div>
        <div class="flex gap-2">
          <div class="px-4 py-2 bg-primary-50 rounded-xl border border-primary-100 flex flex-col">
            <span class="text-[10px] text-primary-400 font-bold uppercase">Total Bookings</span>
            <span class="text-xl font-extrabold text-primary-700">{{ (bookings$ | async)?.length || 0 }}</span>
          </div>
        </div>
      </header>

      <section class="mb-12">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div class="p-6 border-b border-slate-50">
            <h3 class="text-xl font-bold text-slate-800">Recent Bookings</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-4">Hotel Name</th>
                  <th class="px-6 py-4">Reserved Date</th>
                  <th class="px-6 py-4">Guest</th>
                  <th class="px-6 py-4">Amount Paid</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let booking of bookings$ | async" class="hover:bg-slate-50/30 transition-colors">
                  <td class="px-6 py-4 font-semibold text-slate-800">{{ booking.hotelName }}</td>
                  <td class="px-6 py-4 text-slate-600">{{ booking.reservedDate | date:'mediumDate' }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{{ booking.reservedForUser }}</span>
                  </td>
                  <td class="px-6 py-4 font-bold text-emerald-600">{{ booking.amountPaid | currency:'INR':'symbol':'1.0-0' }}</td>
                </tr>
                <tr *ngIf="(bookings$ | async)?.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">No bookings yet</td>
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
