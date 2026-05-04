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
           'bg-emerald-600/95': toast.type === 'success',
           'bg-red-600/95': toast.type === 'error'
         }"
         class="animate-bounce-in fixed bottom-6 right-4 z-[100] flex items-center gap-3 rounded-2xl border border-white/25 px-5 py-3 text-white shadow-2xl backdrop-blur sm:right-6">
      <span class="grid h-7 w-7 place-items-center rounded-full bg-white/20 font-black" *ngIf="toast.type === 'success'">S</span>
      <span class="grid h-7 w-7 place-items-center rounded-full bg-white/20 font-black" *ngIf="toast.type === 'error'">!</span>
      <span class="font-semibold">{{ toast.message }}</span>
    </div>
  `,
  styles: [`
    @keyframes bounce-in {
      0% { transform: translateY(12px) scale(0.95); opacity: 0; }
      60% { transform: translateY(-1px) scale(1.01); opacity: 1; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    .animate-bounce-in {
      animation: bounce-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
