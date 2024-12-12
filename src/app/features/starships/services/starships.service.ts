import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StarshipService {
  private baseUrl = 'https://swapi.dev/api/starships/';

  constructor(private http: HttpClient) {}


  getStarships(page: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}`);
  }

  
  getStarshipImageUrl(starshipUrl: string): string {
    const id = starshipUrl.split('/').slice(-2, -1)[0];
    return `https://starwars-visualguide.com/assets/img/starships/${id}.jpg`;
  }
}
