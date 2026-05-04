import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <div class="relative min-h-screen overflow-x-hidden">
      <div class="pointer-events-none absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl"></div>
      <div class="pointer-events-none absolute right-[-6rem] top-24 h-64 w-64 rounded-full bg-amber-200/50 blur-3xl"></div>

      <router-outlet></router-outlet>
      <app-toast></app-toast>
    </div>
  `
})
export class AppComponent {}
