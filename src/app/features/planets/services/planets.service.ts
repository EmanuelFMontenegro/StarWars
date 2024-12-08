import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanetResponse } from './planet.model';

@Injectable({
  providedIn: 'root',
})
export class PlanetsService {
  private apiUrl = 'https://swapi.dev/api/planets';
  private imageBaseUrl = 'https://starwars-visualguide.com/assets/img/planets';

  constructor(private http: HttpClient) {}

  // Devuelve la URL base de la API
  getApiUrl(): string {
    return this.apiUrl;
  }

  // Devuelve la respuesta de la API
  getPlanetsByUrl(url: string): Observable<PlanetResponse> {
    return this.http.get<PlanetResponse>(url);
  }

  // Generar la URL de la imagen a partir del ID
  getPlanetImageUrl(planetUrl: string): string {
    const id = planetUrl.split('/').slice(-2, -1)[0];
    return `${this.imageBaseUrl}/${id}.jpg`;
  }
}
