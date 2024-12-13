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
      info: { total: 20, page: 1, limit: 10 },
      data: [
        { _id: '1', name: 'Starship 1', img_url: 'url-to-image-1' },
        { _id: '2', name: 'Starship 2', img_url: 'url-to-image-2' },
      ],
    };

    service.getStarships(1).subscribe((data) => {
      expect(data).toEqual(mockResponse);
      expect(data.data.length).toBe(2);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}?page=1`);
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

    const req = httpMock.expectOne(`${service['baseUrl']}?page=1`);
    expect(req.request.method).toBe('GET');

    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should return correct image URL if img_url is present', () => {
    const starship = { img_url: 'url-to-image-1' };
    const imageUrl = service.getStarshipImage(starship);
    expect(imageUrl).toBe('url-to-image-1');
  });

  it('should return default image URL if img_url is missing', () => {
    const starship = { img_url: '' };
    const imageUrl = service.getStarshipImage(starship);
    expect(imageUrl).toBe('assets/images/no-image.png');
  });
});
