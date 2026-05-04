import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-4">
      <h4 class="text-sm font-semibold text-slate-700 mb-3">Select a date (Next 7 days)</h4>
      <div class="grid grid-cols-7 gap-2">
        <button 
          *ngFor="let day of weekDays"
          (click)="onDateClick(day)"
          [disabled]="day.unavailable"
          [ngClass]="{
            'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200': selectedDate === day.isoDate && !day.unavailable,
            'bg-slate-50 text-emerald-600 border-emerald-100 hover:border-emerald-300': selectedDate !== day.isoDate && !day.unavailable,
            'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-50': day.unavailable
          }"
          class="flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200">
          <span class="text-[10px] uppercase font-bold tracking-tighter">{{ day.name }}</span>
          <span class="text-base font-extrabold">{{ day.date }}</span>
          <span *ngIf="day.unavailable" class="text-[8px] line-through decoration-red-400">X</span>
        </button>
      </div>
    </div>
  `
})
export class BookingCalendarComponent {
  @Input() unavailableDates: string[] = [];
  @Input() selectedDate: string | null = null;
  @Output() dateSelected = new EventEmitter<string>();

  weekDays: any[] = [];

  constructor() {
    this.generateWeek();
  }

  ngOnChanges() {
    this.generateWeek();
  }

  generateWeek() {
    const today = new Date();
    this.weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isoDate = date.toISOString().split('T')[0];
      
      this.weekDays.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        isoDate: isoDate,
        unavailable: this.unavailableDates.includes(isoDate)
      });
    }
  }

  onDateClick(day: any) {
    if (!day.unavailable) {
      this.dateSelected.emit(day.isoDate);
    }
  }
}
