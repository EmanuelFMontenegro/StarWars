import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanetResponse, Planet } from './planet.model';

@Injectable({
  providedIn: 'root',
})
export class PlanetsService {
  private apiUrl = 'https://swapi.dev/api/planets';
  private imageBaseUrl = 'https://starwars-visualguide.com/assets/img/planets';

  constructor(private http: HttpClient) {}


  getApiUrl(): string {
    return this.apiUrl;
  }


  getPlanetsByUrl(url: string): Observable<PlanetResponse> {
    return this.http.get<PlanetResponse>(url);
  }

  
  getPlanetImageUrl(planet: Planet): string {
    const id = planet.url.split('/').slice(-2, -1)[0];
    return `${this.imageBaseUrl}/${id}.jpg`;
  }
}
