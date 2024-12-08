import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']); // Espía para el servicio Router

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }, // Proveedor de mock para Router
      ],
    });

    guard = TestBed.inject(AuthGuard); // Inyecta el guard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Verifica que el guard esté creado
  });

  it('should allow activation when token exists in sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('valid-token'); // Simula un token válido

    const result = guard.canActivate();
    expect(result).toBeTrue(); // Espera que canActivate permita el acceso
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // No debe redirigir
  });

  it('should block activation and redirect when token is missing', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null); // Simula ausencia de token

    const result = guard.canActivate();
    expect(result).toBeFalse(); // Espera que canActivate bloquee el acceso
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']); // Debe redirigir al login
  });
});
