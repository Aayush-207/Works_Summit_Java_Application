import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="sticky top-0 z-50 border-b border-white/60 bg-white/75 px-4 py-4 shadow-sm shadow-cyan-100/50 backdrop-blur md:px-8">
      <div class="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-lg text-white shadow-lg shadow-cyan-200">
            H
          </div>
          <div>
            <h1 class="text-xl font-black text-slate-800">HotelBook</h1>
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Smart Stays</p>
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-6">
          <div class="hidden flex-col items-end sm:flex">
            <span class="text-xs text-slate-500">Signed in as</span>
            <span class="font-semibold text-slate-800">{{ username }}</span>
          </div>

          <div *ngIf="role === 'ADMIN'" class="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
            Admin
          </div>

          <button (click)="logout()" class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition-colors hover:border-red-200 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  
  username = this.authService.getUsername();
  role = this.authService.getRole();

  logout() {
    this.authService.logout();
  }
}
