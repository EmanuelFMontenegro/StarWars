import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './core/authentication/authentication.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'starwars';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (!token) {
      console.log('AppComponent - Sin token. Redirigiendo al login.');
      this.router.navigate(['/auth/login']);
    } else {
      console.log('AppComponent - Token detectado.');
      // No redirigir aquí. El AuthGuard gestionará la validación.
    }
  }
}
