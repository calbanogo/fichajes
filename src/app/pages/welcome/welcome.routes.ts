import { Routes } from '@angular/router';

export const welcomeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'create-company',
    loadComponent: () => import('./create-company/create-company.page').then((m) => m.CreateCompanyPage),
  },
  {
    path: 'edit-company',
    loadComponent: () => import('./edit-company/edit-company.page').then((m) => m.EditCompanyPage),
  }
//   {
//     path: 'info',
//     loadComponent: () => import('../infoApp/info.page').then((m) => m.InfoPage),
//   },
];