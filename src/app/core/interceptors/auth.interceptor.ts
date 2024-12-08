import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthenticationService); // Inyección funcional
  const token = authService.getToken();

  console.log('Token usado en la solicitud:', token);

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Añade el token al header Authorization
      },
    });
    return next(clonedRequest); // Pasa la solicitud clonada
  }

  return next(req); // Si no hay token, continúa con la solicitud original
};
