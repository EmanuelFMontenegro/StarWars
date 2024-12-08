import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeopleResponse } from './person.model';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private apiUrl = 'https://swapi.dev/api/people';

  constructor(private http: HttpClient) {}

  getPeople(): Observable<PeopleResponse> {
    return this.http.get<PeopleResponse>(this.apiUrl);
  }
}
