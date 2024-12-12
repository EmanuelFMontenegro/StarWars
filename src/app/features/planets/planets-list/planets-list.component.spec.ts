import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetsListComponent } from './planets-list.component';
import { PlanetsService } from '../services/planets.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlanetsListComponent', () => {
  let component: PlanetsListComponent;
  let fixture: ComponentFixture<PlanetsListComponent>;
  let mockPlanetsService: jasmine.SpyObj<PlanetsService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockResponse = {
    count: 2,
    results: [
      {
        name: 'Planet 1',
        url: 'mock-url/1',
        rotation_period: '24',
        orbital_period: '365',
        diameter: '12742',
        climate: 'temperate',
        gravity: '1 standard',
        terrain: 'plains',
        surface_water: '71',
        population: '7000000000',
        residents: ['resident1-url', 'resident2-url'],
        films: ['film1-url', 'film2-url'],
        created: '2024-12-12T10:00:00Z',
        edited: '2024-12-12T12:00:00Z',
      },
      {
        name: 'Planet 2',
        url: 'mock-url/2',
        rotation_period: '30',
        orbital_period: '400',
        diameter: '15000',
        climate: 'arid',
        gravity: '0.9 standard',
        terrain: 'desert',
        surface_water: '0',
        population: '1000000',
        residents: ['resident3-url'],
        films: ['film3-url'],
        created: '2024-12-11T09:00:00Z',
        edited: '2024-12-11T11:00:00Z',
      },
    ],
    next: null,
    previous: null,
  };

  beforeEach(async () => {
    mockPlanetsService = jasmine.createSpyObj('PlanetsService', ['getPlanetsByUrl', 'getPlanetImageUrl', 'getApiUrl']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPlanetsService.getPlanetsByUrl.and.returnValue(of(mockResponse));
    mockPlanetsService.getPlanetImageUrl.and.callFake((planet) => `mock-image-url/${planet.name}`);
    mockPlanetsService.getApiUrl.and.returnValue('mock-api-url');

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PlanetsListComponent],
      providers: [
        { provide: PlanetsService, useValue: mockPlanetsService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load planets and update filtered list', () => {
    component.loadPlanets();
    expect(mockPlanetsService.getPlanetsByUrl).toHaveBeenCalledWith('mock-api-url');
    expect(component.planets.length).toBe(2);
    expect(component.filteredPlanetsList.length).toBe(2); // Update filtered list based on mock data
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  });

  it('should handle search functionality', () => {
    component.searchTerm = 'Planet 1';
    component.onSearch();
    expect(component.filteredPlanetsList.length).toBe(1);
    expect(component.filteredPlanetsList[0].name).toBe('Planet 1');
  });

  it('should clear search and reload planets', () => {
    component.onClearSearch();
    expect(component.searchTerm).toBe('');
    expect(mockPlanetsService.getPlanetsByUrl).toHaveBeenCalled();
    expect(component.filteredPlanetsList.length).toBe(2); // Should reload the full list
  });

  it('should show an error message when loading planets fails', () => {
    mockPlanetsService.getPlanetsByUrl.and.returnValue(throwError(() => new Error('Network error')));
    component.loadPlanets();
    expect(mockToastrService.error).toHaveBeenCalledWith('Error al cargar los planetas', 'Error');
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  });

  it('should navigate to the next page', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should not navigate beyond the last page', () => {
    component.totalPages = 3;
    component.currentPage = 3;
    component.nextPage();
    expect(component.currentPage).toBe(3);
  });

  it('should navigate to the previous page', () => {
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not navigate before the first page', () => {
    component.currentPage = 1;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should open dialog with planet details', () => {
    const planet = mockResponse.results[0];
    component.viewDetails(planet);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should show a warning message if searchTerm is empty', () => {
    component.searchTerm = '';
    component.onSearch();
    expect(mockToastrService.warning).toHaveBeenCalledWith('Por favor ingrese un nombre para buscar.', 'Atención');
  });
});
