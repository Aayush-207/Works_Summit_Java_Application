import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div class="w-full max-w-md glass-card rounded-3xl shadow-2xl p-8 border border-white">
        <div class="text-center mb-8">
          <div class="text-5xl mb-4">🏨</div>
          <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">HotelBook</h2>
          <p class="text-slate-500 mt-2">Sign in to manage your stays</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input type="text" formControlName="username" 
                   class="input-field" placeholder="Enter your username">
            <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid" 
                 class="text-red-500 text-xs mt-1">Username is required</div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div class="relative">
              <input [type]="showPassword ? 'text' : 'password'" formControlName="password" 
                     class="input-field pr-10" placeholder="••••••••">
              <button type="button" (click)="showPassword = !showPassword" 
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" 
                 class="text-red-500 text-xs mt-1">Password is required</div>
          </div>

          <div *ngIf="errorMessage" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" 
                  class="w-full btn-primary py-3 flex justify-center items-center gap-2">
            <span *ngIf="isLoading" class="animate-spin border-2 border-white/30 border-t-white rounded-full h-5 w-5"></span>
            {{ isLoading ? 'Authenticating...' : 'Login' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100">
          <div class="grid grid-cols-2 gap-4 text-xs text-slate-400">
            <div class="p-2 bg-slate-50 rounded text-center">
              <span class="font-bold">Admin:</span> admin / admin123
            </div>
            <div class="p-2 bg-slate-50 rounded text-center">
              <span class="font-bold">User:</span> user / user123
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value as any).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/user-dashboard']);
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Invalid username or password. Please try again.';
        }
      });
    }
  }
}
