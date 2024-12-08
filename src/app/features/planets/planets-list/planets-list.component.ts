import { Component, OnInit } from '@angular/core';
import { PlanetsService } from '../services/planets.service';
import { Planet } from '../services/planet.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-planets-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planets-list.component.html',
  styleUrls: ['./planets-list.component.scss'],
})
export class PlanetsListComponent implements OnInit {
  planets: Planet[] = [];
  filteredPlanetsList: Planet[] = [];
  currentPage: number = 1;
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;
  isLoading: boolean = false; // Estado de carga

  constructor(private planetsService: PlanetsService) {}

  ngOnInit(): void {
    this.loadPlanets();
  }

  // Cargar planetas desde la URL
  loadPlanets(url: string = this.planetsService.getApiUrl()): void {
    this.isLoading = true; // Activa el spinner
    this.planetsService.getPlanetsByUrl(url).subscribe({
      next: (data) => {
        this.planets = data.results;
        this.filteredPlanetsList = [...this.planets];
        this.nextPageUrl = data.next;
        this.previousPageUrl = data.previous;
        this.isLoading = false; // Desactiva el spinner
      },
      error: (err) => {
        console.error('Error cargando los planetas:', err);
        this.isLoading = false; // Desactiva el spinner
      },
    });
  }

  // Obtener la URL de la imagen
  getPlanetImage(planetUrl: string): string {
    return this.planetsService.getPlanetImageUrl(planetUrl);
  }

  nextPage(): void {
    if (this.nextPageUrl) {
      this.currentPage++;
      this.loadPlanets(this.nextPageUrl);
    }
  }

  previousPage(): void {
    if (this.previousPageUrl) {
      this.currentPage--;
      this.loadPlanets(this.previousPageUrl);
    }
  }
}
