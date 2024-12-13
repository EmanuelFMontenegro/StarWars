import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StarshipService {
  private baseUrl = 'https://starwars-databank-server.vercel.app/api/v1/vehicles';

  constructor(private http: HttpClient) {}


  getStarships(page: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}`);
  }

  
  getStarshipImage(starship: any): string {
    return starship.img_url ? starship.img_url : 'assets/images/no-image.png';
  }
}
