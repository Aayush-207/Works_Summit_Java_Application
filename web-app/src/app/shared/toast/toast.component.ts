import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toastService.toast() as toast" 
         [ngClass]="{
           'bg-emerald-600': toast.type === 'success',
           'bg-red-600': toast.type === 'error'
         }"
         class="fixed bottom-6 right-6 px-6 py-3 text-white rounded-xl shadow-2xl z-[100] flex items-center gap-3 animate-bounce-in">
      <span *ngIf="toast.type === 'success'">✅</span>
      <span *ngIf="toast.type === 'error'">⚠️</span>
      <span class="font-medium">{{ toast.message }}</span>
    </div>
  `,
  styles: [`
    @keyframes bounce-in {
      0% { transform: scale(0.9); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-in {
      animation: bounce-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
