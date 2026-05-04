import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <h4 class="calendar-title">Select Date (Next 7 Days)</h4>
      <div class="calendar-grid">
        <button 
          *ngFor="let day of weekDays"
          (click)="onDateClick(day)"
          [disabled]="day.unavailable"
          [class.selected]="selectedDate === day.isoDate && !day.unavailable"
          [class.available]="selectedDate !== day.isoDate && !day.unavailable"
          [class.unavailable]="day.unavailable"
          class="day-button">
          <span class="day-name">{{ day.name }}</span>
          <span class="day-date">{{ day.date }}</span>
          <span *ngIf="day.unavailable" class="day-unavailable">×</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      background: rgba(248, 250, 252, 0.7);
    }

    .calendar-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #64748b;
      margin-bottom: 0.75rem;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
    }

    .day-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.75rem;
    }

    .day-button.selected {
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      color: white;
      border-color: #10b981;
      box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
      transform: scale(1.05);
    }

    .day-button.available {
      border-color: #a5f3fc;
      color: #0891b2;
    }

    .day-button.available:hover {
      border-color: #06b6d4;
      background: rgba(6, 182, 212, 0.05);
      transform: translateY(-2px);
    }

    .day-button.unavailable {
      background: #f1f5f9;
      color: #cbd5e1;
      border-color: #e2e8f0;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .day-name {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 0.125rem;
    }

    .day-date {
      font-size: 1rem;
      font-weight: 900;
      display: block;
    }

    .day-unavailable {
      font-size: 0.75rem;
      text-decoration: line-through;
      color: #ef4444;
      display: block;
      margin-top: 0.125rem;
    }
  `]
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
