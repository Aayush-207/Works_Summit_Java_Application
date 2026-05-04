import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🏨</span>
        <h1 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          HotelBook
        </h1>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-end">
          <span class="text-sm text-slate-500">Welcome,</span>
          <span class="font-semibold text-slate-800">{{ username }}</span>
        </div>
        
        <div *ngIf="role === 'ADMIN'" class="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Admin Panel
        </div>

        <button (click)="logout()" class="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="font-medium">Logout</span>
        </button>
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
