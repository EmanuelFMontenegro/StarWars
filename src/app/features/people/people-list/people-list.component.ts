import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../services/people.service';
import { Person } from '../services/person.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { DialogDataService } from '../../../shared/dialog/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    DialogComponent,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
  ],
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  filteredPeople: Person[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  cardsPerPage: number = 4;
  totalPages: number = 0;
  isSpinnerVisible: boolean = false;

  constructor(
    private peopleService: PeopleService,
    private dialog: MatDialog,
    private dialogDataService: DialogDataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.TraerPersonajes();
  }

  TraerPersonajes(): void {
    this.isSpinnerVisible = true;
    this.spinner.show();
    this.peopleService.getPeople().subscribe({
      next: (response) => {
        this.people = response.results;
        this.totalPages = Math.ceil(this.people.length / this.cardsPerPage);
        this.updateFilteredPeople();
      },
      error: () => {
        this.toastr.error('Error al cargar los personajes.', 'Error');
      },
      complete: () => {
        this.spinner.hide();
        this.isSpinnerVisible = false;
      },
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.toastr.warning('Por favor ingrese un nombre para buscar.', 'Atención');
      return;
    }

    const search = this.searchTerm.toLowerCase();
    const results = this.people.filter((person) =>
      person.name.toLowerCase().includes(search)
    );

    if (results.length === 0) {
      this.toastr.info('Personaje inexistente.', 'Información');
      this.filteredPeople = this.people.slice(0, this.cardsPerPage);
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.people.length / this.cardsPerPage);
      return;
    }

    this.filteredPeople = results.slice(0, this.cardsPerPage);
    this.currentPage = 1;
    this.totalPages = Math.ceil(results.length / this.cardsPerPage);
  }


  viewDetails(person: Person): void {
    const personMappings = {
      height: 'Altura',
      mass: 'Peso',
      gender: 'Género',
      birth_year: 'Año de Nacimiento',
    };

    const details = this.dialogDataService.prepareDetails(
      person,
      personMappings
    );

    this.dialog.open(DialogComponent, {
      data: {
        title: `Detalles de ${person.name}`,
        details,
      },
    });
  }

  getImageUrl(person: Person): string {
    return this.peopleService.getImageUrl(person);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredPeople();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredPeople();
    }
  }

  updateFilteredPeople(): void {
    const startIndex = (this.currentPage - 1) * this.cardsPerPage;
    this.filteredPeople = this.people.slice(
      startIndex,
      startIndex + this.cardsPerPage
    );
  }
  onClearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.TraerPersonajes();
    this.toastr.success('Búsqueda restablecida.', 'Limpieza exitosa');
  }
}
