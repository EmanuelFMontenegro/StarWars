import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../services/people.service';
import { Person } from '../services/person.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, DialogComponent],
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  filteredPeople: Person[] = [];
  searchTerm: string = '';

  constructor(
    private peopleService: PeopleService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.peopleService.getPeople().subscribe((response) => {
      this.people = response.results;
      this.filteredPeople = this.people;
    });
  }

  onSearch(): void {
    this.filteredPeople = this.people.filter((person) =>
      person.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewDetails(person: Person): void {
    this.dialog.open(DialogComponent, {
      data: person,
      width: '400px',
      position: { top: '10%' },
    });
  }

  getImageUrl(person: Person): string {
    const id = person.url.split('/').slice(-2, -1)[0];
    return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
  }
}
