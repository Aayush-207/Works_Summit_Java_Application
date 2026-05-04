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
    <section class="login-page">
      <div class="login-shell">
        <aside class="hero-panel">
          <div>
            <p class="eyebrow">Boutique Booking Platform</p>
            <h1>Stay Somewhere Worth Remembering.</h1>
            <p class="hero-copy">Monitor reservations, discover premium hotels, and manage inventory from one clean dashboard.</p>
          </div>
          <div class="stats-grid">
            <div class="stat-box">
              <p class="stat-value">24/7</p>
              <p>Availability</p>
            </div>
            <div class="stat-box">
              <p class="stat-value">Real</p>
              <p>Live Bookings</p>
            </div>
            <div class="stat-box">
              <p class="stat-value">Fast</p>
              <p>Check-in Flow</p>
            </div>
          </div>
        </aside>

        <div class="auth-card glass-card">
          <div class="auth-header">
            <div class="logo-mark">H</div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to HotelBook</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="field-group">
              <label>Username</label>
              <input type="text" formControlName="username" class="field-input" placeholder="Enter your username">
              <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid" class="field-error">Username is required</div>
            </div>

            <div class="field-group">
              <label>Password</label>
              <div class="password-wrap">
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password" class="field-input field-input--password" placeholder="Enter password">
                <button type="button" (click)="showPassword = !showPassword" class="password-toggle">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="field-error">Password is required</div>
            </div>

            <div *ngIf="errorMessage" class="error-banner">
              {{ errorMessage }}
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading" class="submit-button">
              <span *ngIf="isLoading" class="spinner"></span>
              {{ isLoading ? 'Authenticating...' : 'Login' }}
            </button>
          </form>

          <div class="demo-panel">
            <p class="demo-title">Demo Credentials</p>
            <div class="demo-grid">
              <div class="demo-chip"><strong>Admin:</strong> admin / admin123</div>
              <div class="demo-chip"><strong>User:</strong> user / user123</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
  ,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .login-page {
      min-height: 100vh;
      padding: 24px;
      display: flex;
      align-items: center;
    }

    .login-shell {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
      gap: 28px;
      align-items: stretch;
    }

    .hero-panel {
      border-radius: 32px;
      padding: 40px;
      color: #fff;
      background: linear-gradient(145deg, #0e7490 0%, #06b6d4 50%, #10b981 100%);
      box-shadow: 0 30px 80px rgba(8, 145, 178, 0.28);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 640px;
      position: relative;
      overflow: hidden;
    }

    .hero-panel::before,
    .hero-panel::after {
      content: '';
      position: absolute;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      filter: blur(2px);
    }

    .hero-panel::before {
      width: 220px;
      height: 220px;
      right: -60px;
      top: -60px;
    }

    .hero-panel::after {
      width: 160px;
      height: 160px;
      left: -40px;
      bottom: 20px;
    }

    .eyebrow {
      display: inline-flex;
      width: fit-content;
      border: 1px solid rgba(255, 255, 255, 0.38);
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.95);
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      margin: 0 0 22px;
    }

    .hero-panel h1 {
      margin: 0;
      font-size: clamp(2.5rem, 5vw, 4.8rem);
      line-height: 0.95;
      max-width: 10ch;
      color: #ffffff;
    }

    .hero-copy {
      max-width: 580px;
      margin: 18px 0 0;
      font-size: 1.05rem;
      line-height: 1.75;
      color: rgba(240, 253, 255, 0.96);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 28px;
    }

    .stat-box {
      border-radius: 22px;
      border: 1px solid rgba(255, 255, 255, 0.24);
      background: rgba(255, 255, 255, 0.13);
      padding: 18px 16px;
      backdrop-filter: blur(10px);
      min-height: 100px;
    }

    .stat-box p {
      margin: 0;
      color: rgba(255, 255, 255, 0.94);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 6px !important;
    }

    .auth-card {
      border-radius: 32px;
      padding: 34px;
      background: rgba(255, 255, 255, 0.84);
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 28px 70px rgba(15, 23, 42, 0.12);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo-mark {
      width: 66px;
      height: 66px;
      border-radius: 20px;
      margin: 0 auto 16px;
      display: grid;
      place-items: center;
      color: white;
      font-size: 1.8rem;
      font-weight: 900;
      background: linear-gradient(145deg, #06b6d4, #10b981);
      box-shadow: 0 18px 32px rgba(6, 182, 212, 0.35);
    }

    .auth-header h2 {
      margin: 0;
      font-size: clamp(2rem, 3vw, 2.8rem);
      color: #0f172a;
    }

    .auth-header p {
      margin: 8px 0 0;
      color: #64748b;
      font-size: 1rem;
    }

    .login-form {
      display: grid;
      gap: 18px;
    }

    .field-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.92rem;
      font-weight: 800;
      color: #334155;
    }

    .field-input {
      width: 100%;
      border: 1px solid #dbe5f0;
      background: rgba(255, 255, 255, 0.96);
      border-radius: 18px;
      padding: 16px 18px;
      font: inherit;
      color: #0f172a;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      box-sizing: border-box;
    }

    .field-input:focus {
      border-color: #22d3ee;
      box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.18);
    }

    .field-input--password {
      padding-right: 82px;
    }

    .password-wrap {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      border: 0;
      background: rgba(15, 23, 42, 0.04);
      color: #475569;
      border-radius: 12px;
      padding: 8px 12px;
      font-weight: 800;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }

    .password-toggle:hover {
      background: rgba(8, 145, 178, 0.12);
      color: #0e7490;
    }

    .field-error {
      margin-top: 8px;
      color: #dc2626;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .error-banner {
      border: 1px solid rgba(239, 68, 68, 0.18);
      background: #fef2f2;
      color: #b91c1c;
      border-radius: 16px;
      padding: 14px 16px;
      font-size: 0.95rem;
      font-weight: 700;
    }

    .submit-button {
      width: 100%;
      border: 0;
      border-radius: 18px;
      padding: 15px 18px;
      background: linear-gradient(145deg, #06b6d4, #0ea5a6 55%, #10b981);
      color: white;
      font: inherit;
      font-weight: 900;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 18px 34px rgba(6, 182, 212, 0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 22px 42px rgba(6, 182, 212, 0.34);
      filter: saturate(1.05);
    }

    .submit-button:disabled {
      cursor: not-allowed;
      opacity: 0.72;
      box-shadow: none;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    .demo-panel {
      margin-top: 24px;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 0.96));
      padding: 18px;
    }

    .demo-title {
      margin: 0 0 12px;
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #64748b;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .demo-chip {
      border-radius: 18px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 14px;
      color: #475569;
      font-size: 0.94rem;
      line-height: 1.45;
    }

    .demo-chip strong {
      color: #0f172a;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .login-shell {
        grid-template-columns: 1fr;
      }

      .hero-panel {
        min-height: 0;
        padding: 32px;
      }
    }

    @media (max-width: 720px) {
      .login-page {
        padding: 16px;
        align-items: flex-start;
      }

      .auth-card,
      .hero-panel {
        border-radius: 24px;
        padding: 24px;
      }

      .stats-grid,
      .demo-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
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
