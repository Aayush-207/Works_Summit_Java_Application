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
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col h-full group hover:shadow-2xl transition-all duration-300">
      <div class="relative h-48 overflow-hidden">
        <img [src]="hotel.imageUrl" [alt]="hotel.name" 
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        <div class="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
          <span>📍</span> {{ hotel.location }}
        </div>
      </div>
      
      <div class="p-5 flex-grow flex flex-col">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-bold text-slate-800">{{ hotel.name }}</h3>
          <div class="text-right">
            <span class="text-primary-600 font-extrabold text-lg">{{ hotel.pricePerNight | currency:'INR':'symbol':'1.0-0' }}</span>
            <span class="text-slate-400 text-[10px] block font-medium">per night</span>
          </div>
        </div>
        
        <p class="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-grow">
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
          class="mt-6 w-full btn-primary py-3 flex justify-center items-center gap-2">
          <span *ngIf="isBooking" class="animate-spin border-2 border-white/30 border-t-white rounded-full h-4 w-4"></span>
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
