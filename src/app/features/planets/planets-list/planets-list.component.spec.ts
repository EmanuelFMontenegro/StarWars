import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleListComponent } from '../../people/people-list/people-list.component';
import { of, throwError } from 'rxjs';
import { PeopleService } from '../../people/services/people.service';
import { ToastrService } from 'ngx-toastr';
import { Person,PeopleResponse } from '../../people/services/person.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

describe('PeopleListComponent', () => {
  let component: PeopleListComponent;
  let fixture: ComponentFixture<PeopleListComponent>;
  let mockPeopleService: jasmine.SpyObj<PeopleService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  const mockPeopleResponse: PeopleResponse = {
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
        url: 'https://swapi.dev/api/people/1/',
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
        url: 'https://swapi.dev/api/people/4/',
      },
    ],
  };

  beforeEach(async () => {
    mockPeopleService = jasmine.createSpyObj('PeopleService', ['getPeople', 'getImageUrl']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    mockPeopleService.getPeople.and.returnValue(of(mockPeopleResponse));
    mockPeopleService.getImageUrl.and.callFake((person: Person) => {
      const id = person.url.split('/').slice(-2, -1)[0];
      return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
    });

    mockDialog.open.and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [PeopleListComponent],
      providers: [
        { provide: PeopleService, useValue: mockPeopleService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: MatDialog, useValue: mockDialog },
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
    component.ngOnInit();
    expect(mockPeopleService.getPeople).toHaveBeenCalled();
    expect(component.filteredPeople.length).toBe(2);
    expect(component.filteredPeople[0].name).toBe('Luke Skywalker');
  });

  it('should return a valid image URL for a person', () => {
    const imageUrl = component.getImageUrl(mockPeopleResponse.results[0]);
    expect(imageUrl).toBe('https://starwars-visualguide.com/assets/img/characters/1.jpg');
  });

  it('should handle error when loading people', () => {
    mockPeopleService.getPeople.and.returnValue(throwError(() => new Error('Error loading people')));
    component.TraerPersonajes();
    expect(mockToastr.error).toHaveBeenCalledWith('Error al cargar los personajes.', 'Error');
  });

  it('should open dialog with person details', () => {
    const person = mockPeopleResponse.results[0];
    component.viewDetails(person);
    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: { person },
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
  });
});
