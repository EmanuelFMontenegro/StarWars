import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarshipsListComponent } from './starships-list.component';
import { StarshipService } from '../services/starships.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StarshipsListComponent', () => {
  let component: StarshipsListComponent;
  let fixture: ComponentFixture<StarshipsListComponent>;
  let mockStarshipService: jasmine.SpyObj<StarshipService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockResponse = {
    results: [
      { name: 'Starship 1', url: 'mock-url/1', model: 'Model 1' },
      { name: 'Starship 2', url: 'mock-url/2', model: 'Model 2' },
    ],
    count: 2,
  };

  beforeEach(async () => {
    mockStarshipService = jasmine.createSpyObj('StarshipService', ['getStarships', 'getStarshipImageUrl']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockStarshipService.getStarships.and.returnValue(of(mockResponse));
    mockStarshipService.getStarshipImageUrl.and.callFake((url) => `${url}/image`);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StarshipsListComponent],
      providers: [
        { provide: StarshipService, useValue: mockStarshipService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StarshipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load starships and update filtered list', () => {
    component.loadStarships(1);
    expect(mockStarshipService.getStarships).toHaveBeenCalledWith(1);
    expect(component.starships.length).toBe(2);
    expect(component.filteredStarshipsList.length).toBe(2);
  });

  it('should handle search functionality', () => {
    component.searchTerm = 'Starship 1';
    component.onSearch();
    expect(component.filteredStarshipsList.length).toBe(1);
    expect(component.filteredStarshipsList[0].name).toBe('Starship 1');
  });

  it('should show warning if search term is empty', () => {
    component.searchTerm = '';
    component.onSearch();
    expect(mockToastrService.warning).toHaveBeenCalledWith('Por favor ingrese un nombre para buscar.', 'Atención');
  });

  it('should show info if no starships match search', () => {
    component.searchTerm = 'Nonexistent';
    component.onSearch();
    expect(mockToastrService.info).toHaveBeenCalledWith('No se encontraron naves.', 'Información');
  });

  it('should clear search and reload starships', () => {
    component.onClearSearch();
    expect(component.searchTerm).toBe('');
    expect(mockStarshipService.getStarships).toHaveBeenCalledWith(component.currentPage);
  });

  it('should navigate to the home page', () => {
    component.goHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle pagination correctly', () => {
    component.totalPages = 2;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not paginate beyond limits', () => {
    component.totalPages = 1;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(1);
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should open dialog with starship details', () => {
    const starship = { name: 'Starship 1', model: 'Model 1', manufacturer: 'Manufacturer 1', cost_in_credits: '1000' };
    component.viewDetails(starship);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should handle error when loading starships', () => {
    mockStarshipService.getStarships.and.returnValue(throwError(() => new Error('Network error')));
    component.loadStarships(1);
    expect(mockToastrService.error).toHaveBeenCalledWith('Error al cargar las naves', 'Error');
  });
});
