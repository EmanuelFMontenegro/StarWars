import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleListComponent } from './people-list.component';
import { of } from 'rxjs';
import { PeopleService } from '../services/people.service';
import { PeopleResponse } from '../services/person.model';
import { ToastrService } from 'ngx-toastr';

describe('PeopleListComponent', () => {
  let component: PeopleListComponent;
  let fixture: ComponentFixture<PeopleListComponent>;
  let mockPeopleService: jasmine.SpyObj<PeopleService>;

  const mockPeopleResponse: PeopleResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        name: 'Luke Skywalker',
        birth_year: '19BBY',
        height: '172',
        mass: '77',
        gender: 'male',
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
        url: '',
      },
    ],
  };

  beforeEach(async () => {
    const mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    mockPeopleService = jasmine.createSpyObj('PeopleService', ['getPeople']);
    mockPeopleService.getPeople.and.returnValue(of(mockPeopleResponse));

    await TestBed.configureTestingModule({
      imports: [PeopleListComponent], // Cambiado a imports
      providers: [
        { provide: PeopleService, useValue: mockPeopleService },
        { provide: ToastrService, useValue: mockToastr }, // Simulación de ToastrService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters and update filteredPeople', () => {
    const mockPeople: PeopleResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          name: 'Luke Skywalker',
          birth_year: '19BBY',
          height: '172',
          mass: '77',
          gender: 'male',
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
          url: '',
        },
        {
          name: 'Darth Vader',
          birth_year: '41.9BBY',
          height: '202',
          mass: '136',
          gender: 'male',
          hair_color: 'none',
          skin_color: 'white',
          eye_color: 'yellow',
          homeworld: 'Tatooine',
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: '',
          edited: '',
          url: '',
        },
      ],
    };

    mockPeopleService.getPeople.and.returnValue(of(mockPeople));
    component.ngOnInit();

    expect(mockPeopleService.getPeople).toHaveBeenCalled();
    expect(component.filteredPeople.length).toBe(2);
    expect(component.filteredPeople[0].name).toBe('Luke Skywalker');
  });
});
