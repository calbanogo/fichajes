import { Routes } from '@angular/router';

export const welcomeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'create-company',
    loadComponent: () => import('./create-company/create-company.page').then((m) => m.CreateCompanyPage),
  }
];