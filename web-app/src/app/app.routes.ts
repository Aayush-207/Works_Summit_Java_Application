import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'USER' }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  { path: '**', redirectTo: 'login' }
];
