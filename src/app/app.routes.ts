import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard], // Protege el acceso al home
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routing').then((m) => m.authRoutes),
  },
  {
    path: 'personajes',
    loadComponent: () =>
      import('./features/people/people-list/people-list.component').then(
        (m) => m.PeopleListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'naves',
    loadComponent: () =>
      import('./features/starships/starships/starships.component').then(
        (m) => m.StarshipsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'planetas',
    loadComponent: () =>
      import('./features/planets/planets-list/planets-list.component').then(
        (m) => m.PlanetsListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '', // Redirige al home
  },
];
