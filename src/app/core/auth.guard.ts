import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('authToken');
    if (token && this.isTokenValid(token)) {
      return true;
    }

    console.log('AuthGuard - Token inválido o ausente. Redirigiendo al login.');
    this.router.navigate(['/auth/login']);
    return false;
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
