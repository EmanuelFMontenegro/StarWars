import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu state', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should close menu on document click if menu is open', () => {
    component.isMenuOpen = true;
    const mockEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    spyOn(mockEvent.target as HTMLElement, 'closest').and.returnValue(null);
    component.onDocumentClick(mockEvent);
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should not close menu on document click if menu is closed', () => {
    component.isMenuOpen = false;
    const mockEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    spyOn(mockEvent.target as HTMLElement, 'closest').and.returnValue(null);
    component.onDocumentClick(mockEvent);
    expect(component.isMenuOpen).toBeFalse();
  });
});
