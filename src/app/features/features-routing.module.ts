import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PeopleListComponent } from './people/people-list/people-list.component';
import { PlanetsComponent } from './planets/planets/planets.component';
import { StarshipsComponent } from './starships/starships/starships.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'people', component: PeopleListComponent },
  { path: 'planets', component: PlanetsComponent },
  { path: 'starships', component: StarshipsComponent },
];
