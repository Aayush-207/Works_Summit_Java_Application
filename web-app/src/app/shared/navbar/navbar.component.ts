import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="nav-shell">
      <div class="nav-inner">
        <div class="brand-block">
          <div class="brand-mark">H</div>
          <div class="brand-copy">
            <h1>HotelBook</h1>
            <p>Smart Stays</p>
          </div>
        </div>

        <div class="nav-meta">
          <div class="user-block">
            <span class="user-kicker">{{ role === 'ADMIN' ? 'Administrator' : 'Guest' }}</span>
            <span class="user-name">{{ username }}</span>
          </div>

          <div *ngIf="role === 'ADMIN'" class="role-pill">
            <span class="role-dot"></span>
            <span>Admin</span>
          </div>

          <button type="button" (click)="logout()" class="logout-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-shell {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(255, 255, 255, 0.55);
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(18px);
      box-shadow: 0 14px 40px rgba(14, 165, 233, 0.08);
    }

    .nav-inner {
      max-width: 80rem;
      margin: 0 auto;
      min-height: 5.25rem;
      padding: 0.875rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .brand-block {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      min-width: 0;
      flex: 1 1 auto;
    }

    .brand-mark {
      width: 3rem;
      height: 3rem;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border-radius: 1rem;
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 48%, #10b981 100%);
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      box-shadow: 0 14px 30px rgba(8, 145, 178, 0.22);
    }

    .brand-copy {
      min-width: 0;
    }

    .brand-copy h1 {
      margin: 0;
      color: #0f172a;
      font-size: 1.15rem;
      line-height: 1.1;
      font-weight: 900;
      letter-spacing: -0.03em;
    }

    .brand-copy p {
      margin: 0.2rem 0 0;
      color: #0ea5e9;
      font-size: 0.69rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.22em;
    }

    .nav-meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 0.75rem;
      flex: 0 1 auto;
    }

    .user-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.15rem;
      padding-right: 0.75rem;
      border-right: 1px solid rgba(148, 163, 184, 0.25);
    }

    .user-kicker {
      color: #64748b;
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .user-name {
      color: #0f172a;
      font-size: 0.95rem;
      font-weight: 800;
      line-height: 1.1;
      max-width: 14rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .role-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.55rem 0.85rem;
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(255, 247, 237, 0.95), rgba(254, 243, 199, 0.85));
      border: 1px solid rgba(245, 158, 11, 0.22);
      color: #b45309;
      font-size: 0.7rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }

    .role-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 999px;
      background: #f59e0b;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15);
    }

    .logout-button {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.72rem 1rem;
      border-radius: 0.95rem;
      border: 1px solid rgba(226, 232, 240, 0.9);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95));
      color: #334155;
      font-size: 0.9rem;
      font-weight: 800;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    }

    .logout-button:hover {
      transform: translateY(-1px);
      border-color: rgba(248, 113, 113, 0.35);
      color: #dc2626;
      background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(254, 242, 242, 0.95));
      box-shadow: 0 10px 24px rgba(239, 68, 68, 0.12);
    }

    .logout-button:active {
      transform: translateY(0);
    }

    .logout-icon {
      width: 1rem;
      height: 1rem;
      flex: 0 0 auto;
    }

    @media (max-width: 768px) {
      .nav-inner {
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        gap: 0.9rem;
        padding: 1rem;
      }

      .brand-block {
        justify-content: center;
      }

      .nav-meta {
        justify-content: center;
      }

      .user-block {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  
  username = this.authService.getUsername();
  role = this.authService.getRole();

  logout() {
    this.authService.logout();
  }
}
