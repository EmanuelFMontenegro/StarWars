import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService],
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send a POST request to the login URL', () => {
      const mockFormData = new FormData();
      mockFormData.append('username', 'testuser');
      mockFormData.append('password', 'testpass');

      const mockResponse = { token: 'mock-token' };

      service.login(mockFormData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(service['loginUrl']);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle login errors', () => {
      const mockFormData = new FormData();
      mockFormData.append('username', 'testuser');
      mockFormData.append('password', 'wrongpass');

      service.login(mockFormData).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpMock.expectOne(service['loginUrl']);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('setToken', () => {
    it('should store the token in sessionStorage', () => {
      const mockToken = 'mock-token';
      service.setToken(mockToken);
      expect(sessionStorage.getItem('authToken')).toBe(mockToken);
    });
  });

  describe('getToken', () => {
    it('should retrieve the token from sessionStorage', () => {
      const mockToken = 'mock-token';
      sessionStorage.setItem('authToken', mockToken);
      expect(service.getToken()).toBe(mockToken);
    });

    it('should return null if no token is stored', () => {
      sessionStorage.removeItem('authToken');
      expect(service.getToken()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove the token from sessionStorage', () => {
      sessionStorage.setItem('authToken', 'mock-token');
      service.logout();
      expect(sessionStorage.getItem('authToken')).toBeNull();
    });
  });
});
