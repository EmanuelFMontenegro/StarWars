import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule], // Agrega FormsModule a los imports
  template: `
    <div class="search-bar">
      <input
        type="text"
        placeholder="Buscar..."
        [(ngModel)]="searchTerm"
      />
      <button (click)="onSearch()">Buscar</button>
    </div>
  `,
  styles: [
    `
      .search-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
      }

      .search-bar input {
        width: 100%;
        max-width: 400px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 16px;
      }

      .search-bar button {
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .search-bar button:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class SearchBarComponent {
  searchTerm: string = '';

  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }
}
