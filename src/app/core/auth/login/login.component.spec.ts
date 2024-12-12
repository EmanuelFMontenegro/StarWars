import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../authentication/authentication.service';
import { LoginComponent } from './login.component';
import { MatIconModule } from '@angular/material/icon';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock para AuthenticationService
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'login',
      'setToken',
      'getToken',
      'logout',
    ]);

    // Mock para ToastrService
    mockToastr = jasmine.createSpyObj('ToastrService', [
      'warning',
      'error',
      'success',
    ]);

    // Mock para Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Configuración del TestBed
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // LoginComponent como standalone
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatIconModule,
      ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    // Crear el componente
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if form control is invalid and touched', () => {
    const controlName = 'username';
    component.loginForm.controls[controlName].markAsTouched();
    component.loginForm.controls[controlName].setValue('');
    expect(component.isControlInvalid(controlName)).toBeTrue();
  });

  it('should toggle password visibility', () => {
    component.showPassword = false;
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
  });

  it('should initialize the form with empty controls', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('should show error message on login failure', () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    mockAuthService.login.and.returnValue(
      throwError(() => ({ error: 'Unauthorized' }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      'Contraseña o usuario incorrectos.',
      'Atención'
    );
  });

  it('should call login service on valid form submission', () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    mockAuthService.login.and.returnValue(of({ token: 'mock-token' }));
    component.onSubmit();
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockAuthService.setToken).toHaveBeenCalledWith('mock-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should mark form as invalid if fields are empty on submit', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(component.loginForm.invalid).toBeTrue();
    expect(mockToastr.warning).toHaveBeenCalledWith(
      'Debe ingresar las credenciales para iniciar sesión.',
      'Advertencia'
    );
  });
  it('should show an error message when server returns 500', () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    mockAuthService.login.and.returnValue(
      throwError(() => ({ status: 500, message: 'Internal Server Error' }))
    );
    component.onSubmit();
    expect(mockToastr.error).toHaveBeenCalledWith(
      'Tenemos un problema para iniciar sesión. Por favor, intente más tarde.',
      'Error del servidor'
    );
    expect(component.loading).toBeFalse();
  });
});
