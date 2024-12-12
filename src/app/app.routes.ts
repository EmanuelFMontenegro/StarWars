import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { FeaturesRoutes } from './features/features.routing';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routing').then((m) => m.authRoutes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/features.routing').then((m) => m.FeaturesRoutes),
    canActivate: [AuthGuard], 
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];

