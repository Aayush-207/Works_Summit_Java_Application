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
    <div class="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-cyan-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div class="relative h-48 overflow-hidden">
        <img [src]="hotel.imageUrl" [alt]="hotel.name" 
             class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/5 to-transparent"></div>
        <div class="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
          <span>Loc</span> {{ hotel.location }}
        </div>
      </div>
      
      <div class="flex flex-grow flex-col p-5">
        <div class="mb-2 flex items-start justify-between gap-3">
          <h3 class="text-2xl font-black text-slate-800">{{ hotel.name }}</h3>
          <div class="text-right">
            <span class="text-lg font-extrabold text-primary-700">{{ hotel.pricePerNight | currency:'INR':'symbol':'1.0-0' }}</span>
            <span class="block text-[10px] font-medium text-slate-400">per night</span>
          </div>
        </div>
        
        <p class="mb-4 flex-grow text-sm leading-relaxed text-slate-500 line-clamp-2">
          {{ hotel.description }}
        </p>

        <app-booking-calendar 
          [unavailableDates]="hotel.unavailableDates" 
          [selectedDate]="selectedDate()"
          (dateSelected)="onDateSelected($event)">
        </app-booking-calendar>

        <button 
          (click)="bookNow()"
          [disabled]="!selectedDate() || isBooking"
          class="btn-primary mt-6 flex w-full items-center justify-center gap-2 py-3">
          <span *ngIf="isBooking" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
          {{ isBooking ? 'Processing...' : 'Book It' }}
        </button>
      </div>
    </div>
  `
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
