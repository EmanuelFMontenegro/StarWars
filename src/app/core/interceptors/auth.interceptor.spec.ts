import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthenticationService } from '../authentication/authentication.service';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    // Mock del AuthenticationService
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'getToken',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: HTTP_INTERCEPTORS, useValue: AuthInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should add Authorization header when token exists', () => {
    const mockToken = 'mock-token';
    authServiceSpy.getToken.and.returnValue(mockToken); // Simula un token válido

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush({});
  });

  it('should not add Authorization header when token does not exist', () => {
    authServiceSpy.getToken.and.returnValue(null); // Simula ausencia de token

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
