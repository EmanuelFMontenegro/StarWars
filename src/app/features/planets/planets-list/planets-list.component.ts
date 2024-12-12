import { Component, OnInit } from '@angular/core';
import { PlanetsService } from '../services/planets.service';
import { Planet } from '../services/planet.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { DialogDataService } from '../../../shared/dialog/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-planets-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    DialogComponent,
    NgxSpinnerModule,
  ],
  templateUrl: './planets-list.component.html',
  styleUrls: ['./planets-list.component.scss'],
})
export class PlanetsListComponent implements OnInit {
  planets: Planet[] = [];
  filteredPlanetsList: Planet[] = [];
  currentPage: number = 1;
  cardsPerPage: number = 4;
  totalPages: number = 0;
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;
  searchTerm: string = '';
  isSpinnerVisible: boolean = false;

  constructor(
    private planetsService: PlanetsService,
    private router: Router,
    private dialog: MatDialog,
    private dialogDataService: DialogDataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadPlanets();
  }
  loadPlanets(url: string = this.planetsService.getApiUrl()): void {
    this.isSpinnerVisible = true;
    this.spinner.show();
    this.planetsService.getPlanetsByUrl(url).subscribe({
      next: (data) => {
          this.planets = data.results.filter((planet) =>
          this.planetsService.getPlanetImageUrl(planet)
        );

        this.totalPages = Math.ceil(this.planets.length / this.cardsPerPage);
        this.updateFilteredPlanets();
        this.nextPageUrl = data.next;
        this.previousPageUrl = data.previous;
        this.isSpinnerVisible = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error cargando los planetas:', err);
        this.toastr.error('Error al cargar los planetas', 'Error');
        this.isSpinnerVisible = false;
        this.spinner.hide();
      },
    });
  }

  getPlanetImage(planet: Planet): string {
    const imageUrl = this.planetsService.getPlanetImageUrl(planet);
    return imageUrl && imageUrl.trim() !== '' ? imageUrl : 'assets/images/no-image.png';
  }
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.toastr.warning('Por favor ingrese un nombre para buscar.', 'Atención');
      return;
    }

    const search = this.searchTerm.toLowerCase();
    const results = this.planets.filter((planet) =>
      planet.name.toLowerCase().includes(search)
    );

    if (results.length === 0) {
      this.toastr.info('No se encontraron planetas.', 'Información');
      return;
    }

    this.planets = results;
    this.totalPages = Math.ceil(this.planets.length / this.cardsPerPage);
    this.currentPage = 1;
    this.updateFilteredPlanets();
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.loadPlanets();
    this.filteredPlanetsList = [...this.planets];
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredPlanets();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredPlanets();
    }
  }



  goHome(): void {
    this.router.navigate(['/']);
  }


  viewDetails(planet: Planet): void {
    const planetMappings = {
      name: 'Nombre',
      climate: 'Clima',
      population: 'Población',
      terrain: 'Terreno',
    };

    const details = this.dialogDataService.prepareDetails(planet, planetMappings);

    this.dialog.open(DialogComponent, {
      data: {
        title: `Detalles de ${planet.name}`,
        details,
      },
    });
  }
  updateFilteredPlanets(): void {
    const startIndex = (this.currentPage - 1) * this.cardsPerPage;
    const endIndex = startIndex + this.cardsPerPage;

    this.filteredPlanetsList = this.planets.slice(startIndex, endIndex);
  }


}
