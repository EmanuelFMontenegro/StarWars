import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loginUrl = 'https://sandbox-be.helipagos.com/api/auth/login'; 

  constructor(private http: HttpClient) {}

  login(formData: FormData): Observable<any> {
    return this.http.post(this.loginUrl, formData);
  }

  setToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
  }
}
