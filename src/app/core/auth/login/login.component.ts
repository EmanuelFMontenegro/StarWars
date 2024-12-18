import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatIconModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      if (!username || !password) {
        this.toastr.warning(
          'Debe ingresar las credenciales para iniciar sesión.',
          'Advertencia'
        );
      }

      console.log('Formulario inválido:', this.loginForm.value);
      return;
    }

    this.loading = true;

    const { username, password } = this.loginForm.value;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    this.authService.login(formData).subscribe({
      next: (response: { token: string }) => {
        this.authService.setToken(response.token);
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);

        if (err.status === 500) {
          this.toastr.error(
            'Tenemos un problema para iniciar sesión. Por favor, intente más tarde.',
            'Error del servidor'
          );
        } else {
          this.toastr.error('Contraseña o usuario incorrectos.', 'Atención');
        }

        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

}
