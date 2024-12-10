import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import { Injectable } from '@angular/core';
import { Person } from '../../features/people/services/person.model';

@Injectable({ providedIn: 'root' })
export class DialogDataService {
  preparePersonDetails(person: Person): { label: string; value: string | number }[] {
    return [
      { label: 'Altura', value: `${person.height} cm` },
      { label: 'Peso', value: `${person.mass} kg` },
      // { label: 'Color de Cabello', value: person.hair_color },
      // { label: 'Color de Piel', value: person.skin_color },
      { label: 'Género', value: person.gender },
      { label: 'Año de Nacimiento', value: person.birth_year },
    ];
  }
}
