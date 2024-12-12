import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StarshipService } from './starships.service';

describe('StarshipService', () => {
  let service: StarshipService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StarshipService],
    });
    service = TestBed.inject(StarshipService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch starships by page', () => {
    const mockResponse = {
      count: 2,
      results: [
        { name: 'Starship 1', url: 'https://swapi.dev/api/starships/1/' },
        { name: 'Starship 2', url: 'https://swapi.dev/api/starships/2/' },
      ],
    };

    service.getStarships(1).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://swapi.dev/api/starships/?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle errors when fetching starships', () => {
    const errorMessage = 'Network error';

    service.getStarships(1).subscribe({
      next: () => fail('Expected an error, but got data'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = httpMock.expectOne('https://swapi.dev/api/starships/?page=1');
    expect(req.request.method).toBe('GET');

    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should generate correct image URL for a starship', () => {
    const url = 'https://swapi.dev/api/starships/12/';
    const imageUrl = service.getStarshipImageUrl(url);
    expect(imageUrl).toBe('https://starwars-visualguide.com/assets/img/starships/12.jpg');
  });

  it('should handle invalid starship URL gracefully', () => {
    const url = 'invalid-url';
    const imageUrl = service.getStarshipImageUrl(url);
    expect(imageUrl).toBe('https://starwars-visualguide.com/assets/img/starships/undefined.jpg');
  });
});
