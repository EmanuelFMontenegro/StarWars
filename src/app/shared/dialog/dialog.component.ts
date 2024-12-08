import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  template: `
    <div class="dialog-container">
      <h1 mat-dialog-title>{{ data.name }}</h1>
      <div class="title-bar"></div>
      <div mat-dialog-content>
        <div class="detail">
          <h3>Altura:</h3>
          <p>{{ data.height }} cm</p>
        </div>
        <div class="detail">
          <h3>Peso:</h3>
          <p>{{ data.mass }} kg</p>
        </div>
        <div class="detail">
          <h3>Color de Cabello:</h3>
          <p>{{ data.hair_color }}</p>
        </div>
        <div class="detail">
          <h3>Color de Piel:</h3>
          <p>{{ data.skin_color }}</p>
        </div>
        <div class="detail">
          <h3>Género:</h3>
          <p>{{ data.gender }}</p>
        </div>
        <div class="detail">
          <h3>Año de Nacimiento:</h3>
          <p>{{ data.birth_year }}</p>
        </div>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="close()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 20px;
        font-family: 'Arial', sans-serif;
      }

      h1 {
        font-size: 24px;
        text-align: center;
        color: #ffffff;
        margin: 0;
      }

      .title-bar {
        height: 4px;
        width: 100%;
        background-color: #0056b3;
        margin: 10px 0 20px 0;
      }

      mat-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .detail {
        display: flex;
        flex-direction: column;
        align-items: start;
      }

      .detail h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
      }

      .detail p {
        margin: 0;
        font-size: 16px;
        color: #555;
      }

      mat-dialog-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }

      mat-dialog-actions button {
        background-color: #007bff;
        color: #ffffff;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      mat-dialog-actions button:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
