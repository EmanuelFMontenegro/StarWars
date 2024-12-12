import { Routes } from '@angular/router';

export const FeaturesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'personajes',
    loadComponent: () =>
      import('./people/people-list/people-list.component').then(
        (m) => m.PeopleListComponent
      ),
  },
  {
    path: 'planetas',
    loadComponent: () =>
      import('./planets/planets-list/planets-list.component').then(
        (m) => m.PlanetsListComponent
      ),
  },
  {
    path: 'naves',
    loadComponent: () =>
      import('./starships/starships-list/starships-list.component').then(
        (m) => m.StarshipsListComponent
      ),
  },
];
