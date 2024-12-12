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
  starships: any[] = [];
  filteredStarshipsList: any[] = [];
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
    this.isSpinnerVisible = true;
    this.spinner.show();
    this.starshipService.getStarships(page).subscribe({
      next: (data: { results: any[]; count: number }) => {
        this.starships = data.results.map((starship: any) => ({
          ...starship,
          imageUrl: this.starshipService.getStarshipImageUrl(starship.url),
        }));

        this.totalPages = Math.ceil(data.count / this.cardsPerPage);
        this.updateFilteredStarships();
      },
      error: (err: any) => {
        console.error('Error cargando las naves:', err);
        this.toastr.error('Error al cargar las naves', 'Error');
      },
      complete: () => {
        this.isSpinnerVisible = false;
        this.spinner.hide();
      },
    });
  }

  getStarshipImage(starship: any): string {
    const imageUrl = this.starshipService.getStarshipImageUrl(starship.url);
    return imageUrl && imageUrl.trim() !== '' ? imageUrl : 'assets/images/no-image.png';
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.toastr.warning('Por favor ingrese un nombre para buscar.', 'Atención');
      return;
    }

    const search = this.searchTerm.toLowerCase();
    const results = this.starships.filter((starship) =>
      starship.name.toLowerCase().includes(search)
    );

    if (results.length === 0) {
      this.toastr.info('No se encontraron naves.', 'Información');
      return;
    }

    this.starships = results;
    this.totalPages = Math.ceil(this.starships.length / this.cardsPerPage);
    this.currentPage = 1;
    this.updateFilteredStarships();
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.loadStarships(this.currentPage);
    this.filteredStarshipsList = [...this.starships];
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStarships(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStarships(this.currentPage);
    }
  }

  goHome(): void {
    console.log('Navegando al Home...');
    this.router.navigate(['/']);
  }

  viewDetails(starship: any): void {
    const starshipMappings = {
      name: 'Nombre',
      model: 'Modelo',
      manufacturer: 'Fabricante',
      cost_in_credits: 'Costo',
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
