import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [RouterModule, CommonModule, MatIcon],
})
export class HomeComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  items = [
    { name: 'Personajes', image: '/img/personaje.png', link: '/personajes' },
    { name: 'Naves', image: '/img/naves.png', link: '/naves' },
    { name: 'Planetas', image: '/img/planeta.png', link: '/planetas' },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  logout(): void {
    this.isMenuOpen = false;

    this.router.navigate(['auth/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    
    if (!target.closest('.menu') && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}
