import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PeopleService } from './people.service';
import { PeopleResponse, Person } from './person.model';

describe('PeopleService', () => {
  let service: PeopleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PeopleService],
    });

    service = TestBed.inject(PeopleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve people data from the API', () => {
    const mockResponse: PeopleResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          gender: 'male',
          birth_year: '19BBY',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'blue',
          homeworld: 'Tatooine',
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: '',
          edited: '',
          url: 'https://swapi.dev/api/people/1/',
        },
      ],
    };

    service.getPeople().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should generate correct image URL for a person', () => {
    const mockPerson: Person = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      gender: 'male',
      birth_year: '19BBY',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      homeworld: 'Tatooine',
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: '',
      edited: '',
      url: 'https://swapi.dev/api/people/1/',
    };

    const imageUrl = service.getImageUrl(mockPerson);
    expect(imageUrl).toBe('https://starwars-visualguide.com/assets/img/characters/1.jpg');
  });
});
