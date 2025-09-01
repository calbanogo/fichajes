import { Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

export const tab1Routes: Routes = [
  {
    path: '',
    component: Tab1Page,
    children: [
      {
        path: 'create-employee',
        loadComponent: () =>
          import('./create-employee/create-employee.page').then(m => m.CreateEmployeePage),
      }
    ],
  },
];