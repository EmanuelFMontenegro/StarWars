import { TestBed } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AuthenticationService } from '../authentication/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    mockSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['getSpinner']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token is available', () => {
    const mockToken = 'mock-token';
    mockAuthService.getToken.and.returnValue(mockToken);

    httpClient.get('/test').subscribe();
    const req = httpMock.expectOne('/test');

    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should not add Authorization header when token is not available', () => {
    mockAuthService.getToken.and.returnValue(null);

    httpClient.get('/test').subscribe();
    const req = httpMock.expectOne('/test');

    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should handle multiple requests correctly', () => {
    const mockToken = 'mock-token';
    mockAuthService.getToken.and.returnValue(mockToken);

    httpClient.get('/test1').subscribe();
    httpClient.get('/test2').subscribe();

    const req1 = httpMock.expectOne('/test1');
    const req2 = httpMock.expectOne('/test2');

    expect(req1.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should proceed without Authorization header if getToken throws an error', () => {
    mockAuthService.getToken.and.throwError('Error fetching token');

    httpClient.get('/test').subscribe();
    const req = httpMock.expectOne('/test');

    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});
