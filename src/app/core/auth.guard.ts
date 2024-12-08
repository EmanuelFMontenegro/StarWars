import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      // Aquí podrías validar el token en el backend si es necesario
      return true;
    }
    // Redirige al login si no hay token
    this.router.navigate(['/auth/login']);
    return false;
  }
}
