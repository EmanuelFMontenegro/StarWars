import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { DialogDataService } from '../../../shared/dialog/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { StarshipService } from '../services/starships.service';
import { StarshipResponse, Starship } from '../services/starship.model';

@Component({
  selector: 'app-starships-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    DialogComponent,
    NgxSpinnerModule,
  ],
  templateUrl: './starships-list.component.html',
  styleUrls: ['./starships-list.component.scss'],
})
export class StarshipsListComponent implements OnInit {
  starships: Starship[] = [];
  filteredStarshipsList: Starship[] = [];
  currentPage: number = 1;
  cardsPerPage: number = 4;
  totalPages: number = 0;
  searchTerm: string = '';
  isSpinnerVisible: boolean = false;

  constructor(
    private starshipService: StarshipService,
    private router: Router,
    private dialog: MatDialog,
    private dialogDataService: DialogDataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadStarships(this.currentPage);
  }

  loadStarships(page: number): void {
    if (page > 3) {
      this.toastr.warning('No hay más páginas disponibles.', 'Atención');
      return;
    }

    this.isSpinnerVisible = true;
    this.spinner.show();

    this.starshipService.getStarships(page).subscribe({
      next: (response: StarshipResponse) => {
        if (response && response.data && response.info) {
          // Mapea las naves y asigna una imagen válida o predeterminada
          this.starships = response.data.map((starship) => ({
            ...starship,
            imageUrl: starship.image ? starship.image : 'assets/images/no-image.png',
          }));

          this.totalPages = Math.min(3, Math.ceil(response.info.total / response.info.limit));
          this.updateFilteredStarships();
        } else {
          this.toastr.error('Datos inválidos recibidos de la API.', 'Error');
        }
      },
      error: (err) => {
        console.error('Error al cargar las naves:', err);
        this.toastr.error('Error al cargar las naves.', 'Error');
      },
      complete: () => {
        this.isSpinnerVisible = false;
        this.spinner.hide();
      },
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.toastr.warning('Por favor ingrese un nombre para buscar.', 'Atención');
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredStarshipsList = this.starships.filter((starship) =>
      starship.name.toLowerCase().includes(search)
    );

    if (this.filteredStarshipsList.length === 0) {
      this.toastr.info('No se encontraron naves.', 'Información');
    }
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.filteredStarshipsList = [...this.starships];
    this.updateFilteredStarships();
    this.toastr.success('Búsqueda restablecida.', 'Limpieza exitosa');
  }


  nextPage(): void {
    if (this.currentPage < 3) {
      this.currentPage++;
      this.loadStarships(this.currentPage);
    } else {
      this.toastr.warning('No hay más páginas disponibles.', 'Atención');
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStarships(this.currentPage);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewDetails(starship: Starship): void {
    const starshipMappings = {
      name: 'Nombre',
      description: 'Descripción',
    };

    const details = this.dialogDataService.prepareDetails(starship, starshipMappings);

    this.dialog.open(DialogComponent, {
      data: {
        title: `Detalles de ${starship.name}`,
        details,
      },
    });
  }

  updateFilteredStarships(): void {
    const startIndex = (this.currentPage - 1) * this.cardsPerPage;
    const endIndex = startIndex + this.cardsPerPage;
    this.filteredStarshipsList = this.starships.slice(startIndex, endIndex);
  }
}
