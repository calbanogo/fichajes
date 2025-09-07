import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.routes').then((m) => m.welcomeRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'company',
    loadChildren: () => import('./pages/company/tabs/tabs.routes').then((m) => m.tabRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'attendance-detail',
    loadComponent: () => import('./pages/company/tab0/attendance-detail/attendance-detail.page').then( m => m.AttendanceDetailPage)
  }
];
